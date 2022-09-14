import { Request, Response } from "express";
import User from "../models/user";
import * as jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/auth";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import { IUserModel } from "../types";

export const register = async (req: Request, res: Response) => {
  //now we use the functions of the model to has the password then we'll save and divert back to register route
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    //do validation now
    if (!name) return res.status(400).send("name is required.");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send(
          "Password is required and should be minimum of 6 characters long"
        );
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");

    //now if all details are acceptable then we can save it to db correctly
    //hash password
    const hashedPassword = await hashPassword(password);
    //register
    const user = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    console.log("saved user:", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    //check if our db has user with that email
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    //check password and use the compare password function already made for register
    //@ts-ignore
    const match = await comparePassword(password, user.password);

    //if no match
    if (!match) return res.status(400).send("Wrong password!");
    //now we create JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //send it now as cookie in json response
    user.password = undefined;
    res.cookie("token", token, {
      httpOnly: true,
      //secure: true,
    });
    //send user as json response
    res.json(user);
  } catch (err: any) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout Success" });
  } catch (error: any) {
    console.log(error);
  }
};

export const currentUser = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const user = await User.findById(req.user._id)
      .select("-password")
      .exec();
    console.log("CURRENT_USER", user);
    return res.json(user);
  } catch (err) {
    console.log(err);
  }
};
