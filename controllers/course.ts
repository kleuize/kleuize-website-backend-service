import { Request, Response } from "express";
import AWS from "aws-sdk";
import Course from "../models/course";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { readFileSync } from "fs";
import User from "../models/user";
import stripe from "stripe";
import { validationResult } from "express-validator";

const config: any = {};
const stripes = new stripe.Stripe(process.env.STRIPE_SECRET, config);

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req: Request, res: Response) => {
  // console.log(req.body);
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send("No image");

    // prepare the image
    //@ts-ignore
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    // image params
    const params = {
      Bucket: "kleuize-bucket",
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    // upload to s3
    S3.upload(params, (err: any, data: any) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeImage = async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    // image params
    const params = {
      Bucket: image.Bucket,
      Key: image.Key,
    };

    // send remove request to s3
    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};

export const create = async (req: any, res: Response) => {
  // console.log("CREATE COURSE", req.body);
  // return;
  try {
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });
    if (alreadyExist) return res.status(400).send("Title is taken");

    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.auth._id,
      ...req.body,
    }).save();

    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Course create failed. Try again.");
  }
};

export const read = async (req: Request, res: Response) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate("instructor", "_id name")
      .exec();
    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    console.log("data", req.params);
    const lesson = await Course.findOne({ lessons: req.params.lessons })
      .populate("lessons")
      .exec();
    res.json(lesson);
    console.log(lesson);
  } catch (err) {
    console.log(err);
  }
};

export const addLesson = async (req: any, res: Response) => {
  try {
    const { slug, instructorId } = req.params;
    const { lessonTitle } = req.body;

    if (req.auth._id != instructorId) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: {
          lessons: {
            lessonTitle,
            slug: slugify(lessonTitle),
          },
        },
      },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Add lesson failed");
  }
};

export const createQuiz = async (req: any, res: Response) => {
  try {
    const { slug, instructorId, lessonId } = req.params;
    const { quizTitle, questions, selectedAnswers } = req.body;
    if (req.auth._id != instructorId) {
      return res.status(400).send("Unauthorized");
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      // Looping through quesion's answers
      let { answers } = question;

      // If none of the answers was selected as the correct answer, we select the first one as the correct one
      let noSelectedAnswer = false;

      for (let j = 0; j < answers.length; j++) {
        const answer = answers[j];

        // If the selected answer id is included in the selectedAnswers array, we make it correct
        if (selectedAnswers.includes(answer.id)) {
          noSelectedAnswer = true;
          answers[j].isCorrect = true;
        }
      }

      if (!noSelectedAnswer) {
        answers[0].isCorrect = true;
      }
    }

    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: {
          "lessons.$[lessons].quiz": {
            quizTitle,
            questions,
            slug: slugify(quizTitle),
          },
        },
      },
      { arrayFilters: [
        {
          "lessons._id": lessonId
        }
      ] }
    )
      .exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Add quiz failed");
  }
};


export const update = async (req: any, res: Response) => {
  try {
    const { slug } = req.params;
    // console.log(slug);
    const course = await Course.findOne({ slug }).exec();
    // console.log("COURSE FOUND => ", course);
    if (req.auth._id != course.instructor) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findOneAndUpdate({ slug }, req.body, {
      new: true,
    }).exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const removeLesson = async (req: any, res: Response) => {
  const { slug, lessonId } = req.params;
  const course = await Course.findOne({ slug }).exec();
  if (req.auth._id != course.instructor) {
    return res.status(400).send("Unauthorized");
  }

  const deletedCourse = await Course.findByIdAndUpdate(course._id, {
    $pull: { lessons: { _id: lessonId } },
  }).exec();

  res.json({ ok: true });
};

export const updateLesson = async (req: any, res: Response) => {
  try {
    // console.log("UPDATE LESSON", req.body);
    const { slug } = req.params;
    const { _id, title, content, quiz, free_preview } = req.body;
    const course = await Course.findOne({ slug }).select("instructor").exec();

    if (course.instructor._id != req.auth._id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.updateOne(
      { "lessons._id": _id },
      {
        $set: {
          "lessons.$.title": title,
          "lessons.$.content": content,
          "lessons.$.quiz": quiz,
          "lessons.$.free_preview": free_preview,
        },
      },
      { new: true }
    ).exec();
    // console.log("updated", updated);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Update lesson failed");
  }
};

export const publishCourse = async (req: any, res: Response) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("instructor").exec();

    if (course.instructor._id != req.auth._id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { published: true },
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Publish course failed");
  }
};

export const unpublishCourse = async (req: any, res: Response) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("instructor").exec();

    if (course.instructor._id != req.auth._id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { published: false },
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unpublish course failed");
  }
};

export const courses = async (req: Request, res: Response) => {
  const all = await Course.find({ published: true })
    .populate("instructor", "_id name")
    .exec();
  res.json(all);
};

export const checkEnrollment = async (req: any, res: Response) => {
  const { courseId } = req.params;
  // find courses of the currently logged in user
  const user = await User.findById(req.auth._id).exec();
  // check if course id is found in user courses array
  let ids = [];
  let length = user.courses && user.courses.length;
  for (let i = 0; i < length; i++) {
    ids.push(user.courses[i].toString());
  }
  res.json({
    status: ids.includes(courseId),
    course: await Course.findById(courseId).exec(),
  });
};

export const freeEnrollment = async (req: any, res: Response) => {
  try {
    // check if course is free or paid
    const course = await Course.findById(req.params.courseId).exec();
    if (course.paid) return;

    const result = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { courses: course._id },
      },
      { new: true }
    ).exec();
    console.log(result);
    res.json({
      message: "Congratulations! You have successfully enrolled",
      course,
    });
  } catch (err) {
    console.log("free enrollment err", err);
    return res.status(400).send("Enrollment create failed");
  }
};

// export const paidEnrollment = async (req: any, res: Response) => {
//   try {
//     // check if course is free or paid
//     const course = await Course.findById(req.params.courseId)
//       .populate("instructor")
//       .exec();
//     if (!course.paid) return;
//     // application fee 30%
//     const fee = (course.price * 30) / 100;
//     // create stripe session
//     const session = await stripes.checkout.sessions.create({
//       payment_method_types: ["card"],
//       // purchase details
//       line_items: [
//         {
//           name: course.name,
//           amount: Math.round(course.price.toFixed(2) * 100),
//           currency: "usd",
//           quantity: 1,
//         },
//       ],
//       // charge buyer and transfer remaining balance to seller (after fee)
//       payment_intent_data: {
//         application_fee_amount: Math.round(fee.toFixed(2) * 100),
//         transfer_data: {
//           destination: course.instructor.stripe_account_id,
//         },
//       },
//       // redirect url after successful payment
//       success_url: `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
//       cancel_url: process.env.STRIPE_CANCEL_URL,
//     });
//     console.log("SESSION ID => ", session);

//     await User.findByIdAndUpdate(req.auth._id, {
//       stripeSession: session,
//     }).exec();
//     res.send(session.id);
//   } catch (err) {
//     console.log("PAID ENROLLMENT ERR", err);
//     return res.status(400).send("Enrollment create failed");
//   }
// };

// export const stripeSuccess = async (req: any, res: Response) => {
//   try {
//     // find course
//     const course = await Course.findById(req.params.courseId).exec();
//     // get user from db to get stripe session id
//     const user = await User.findById(req.auth._id).exec();
//     // if no stripe session return
//     if (!user.stripeSession.id) return res.sendStatus(400);
//     // retrieve stripe session
//     const session = await stripes.checkout.sessions.retrieve(
//       user.stripeSession.id
//     );
//     console.log("STRIPE SUCCESS", session);
//     // if session payment status is paid, push course to user's course []
//     if (session.payment_status === "paid") {
//       await User.findByIdAndUpdate(user._id, {
//         $addToSet: { courses: course._id },
//         $set: { stripeSession: {} },
//       }).exec();
//     }
//     res.json({ success: true, course });
//   } catch (err) {
//     console.log("STRIPE SUCCESS ERR", err);
//     res.json({ success: false });
//   }
// };

export const userCourses = async (req: any, res: Response) => {
  const user = await User.findById(req.auth._id).exec();
  const courses = await Course.find({ _id: { $in: user.courses } })
    .populate("instructor", "_id name")
    .exec();
  res.json(courses);
};
function asyncHandler(
  arg0: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>
) {
  throw new Error("Function not implemented.");
}
