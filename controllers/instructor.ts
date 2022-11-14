import { Request, Response } from "express";
import User from "../models/user";
import Course from "../models/course";
import queryString from "query-string";
import stripe from "stripe";

const config: any = {};
const stripes = new stripe.Stripe(process.env.STRIPE_SECRET, config);

export const makeInstructor = async (req: any, res: Response) => {
  try {
    // 1. find user from db
    const user = await User.findById(req.auth._id).exec();
    console.log("user", user);
    if (!user.stripe_account_id) {
      const account = await stripes.accounts.create({ type: "standard" });
      // console.log('ACCOUNT => ', account.id)
      user.stripe_account_id = account.id;
      user.save();
    }

    let accountLink = await stripes.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: "account_onboarding",
    });

    // 3. create account link based on account id (for frontend to complete onboarding)

    // 4. pre-fill any info such as email (optional), then send url resposne to frontend
    accountLink = Object.assign(accountLink, {
      "stripe_user[email]": user.email,
    });
    // 5. then send the account link as response to fronend
    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
  } catch (err) {
    console.log("MAKE INSTRUCTOR ERR ", err);
  }
};

export const getAccountStatus = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.auth._id).exec();
    const account = await stripes.accounts.retrieve(user.stripe_account_id);
    // console.log("ACCOUNT => ", account);
    if (!account.charges_enabled) {
      return res.status(401).send("Unauthorized");
    } else {
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          stripe_seller: account,
          $addToSet: { role: "Instructor" },
        },
        { new: true }
      )
        .select("-password")
        .exec();
      res.json(statusUpdated);
    }
  } catch (err) {
    console.log(err);
  }
};

export const currentInstructor = async (req: any, res: Response) => {
  try {
    let user = await User.findById(req.auth._id).select("-password").exec();
    console.log("CURRENT INSTRUCTOR => ", user);
    if (!user.role.includes("Instructor")) {
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};

export const instructorCourses = async (req: any, res: Response) => {
  try {
    const courses = await Course.find({ instructor: req.auth._id })
      .sort({ createdAt: -1 })
      .exec();
    res.json(courses);
  } catch (err) {
    console.log(err);
  }
};

export const studentCount = async (req: any, res: Response) => {
  try {
    const users = await User.find({ courses: req.auth.courseId })
      .select("_id")
      .exec();
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};
