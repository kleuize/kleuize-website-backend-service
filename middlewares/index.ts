import { expressjwt } from "express-jwt";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Course from "../models/course";

export const requireSignin = expressjwt({
  //@ts-ignore
  getToken: (req, res) => req.cookies.token,
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
});

export const isInstructor = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  try {
    const user = await User.findById(req.auth._id).exec();
    //@ts-ignore
    if (!user.role.includes("Instructor")) {
      return res.sendStatus(403);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

export const isEnrolled = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: any = await User.findById(req.auth._id).exec();
    const course: any = await Course.findOne({ slug: req.params.slug }).exec();

    // check if course id is found in user courses array
    let ids = [];
    //ts-ignore
    for (let i = 0; i < user.courses.length; i++) {
      //@ts-ignore
      ids.push(user.courses[i].toString());
    }
    //@ts-ignore
    if (!ids.includes(course._id.toString())) {
      res.sendStatus(403);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
