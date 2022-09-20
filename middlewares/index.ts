import { expressjwt } from "express-jwt";
import { Request, Response } from "express";
import User from "../models/user";

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
