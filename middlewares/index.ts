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

export const isInstructor = async (req: any, res: Response, next: any) => {
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

interface AsyncMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<unknown>;
}

export const asyncHandler =
  (fn: AsyncMiddleware): AsyncMiddleware =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// export const isEnrolled = async (req: any, res: Response, next: any) => {
//   try {
//     const user = await User.findById(req.auth._id).exec();
//     const course = await Course.findOne({ slug: req.params.slug }).exec();

//     // check if course id is found in user courses array
//     let ids = [];
//     for (let i = 0; i < user.courses.length; i++) {
//       ids.push(user.courses[i].toString());
//     }

//     if (!ids.includes(course._id.toString())) {
//       res.sendStatus(403);
//     } else {
//       next();
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
