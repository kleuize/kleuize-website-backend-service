import { Request, Response } from "express";
import User from "../models/user";
import CryptoJS from "crypto-js";
import * as jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC as string
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.user_name });
    !user && res.status(401).json("Wrong User Name!");

    const hashedPassword = CryptoJS.AES.decrypt(
      //@ts-ignore
      user.password,
      process.env.PASS_SEC as string
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    const inputPassword = req.body.password;

    originalPassword != inputPassword && res.status(401).json("Wrong Password");

    const accessToken = jwt.sign(
      {
        id: user?._id,
        isAdmin: user?.isAdmin,
      },
      process.env.JWT_SEC as string,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user?._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
};
