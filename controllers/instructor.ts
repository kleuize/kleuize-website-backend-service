import { Request, Response } from "express";
import User from "../models/user";
import queryString from "query-string";
import stripe from "stripe";

const config: any = {};

const stripes = new stripe.Stripe(process.env.STRIPE_SECRET, config);
export const makeInstructor = async (req: Request, res: Response) => {
  try {
    // 1. find user from db
    const user = await User.findById(req.body._id).exec();
    // 2. if user dont have stripe_account_id yet, then create new
    if (!user.stripe_account_id) {
      const account = await stripes.accounts.create({ type: "express" });
      console.log("ACCOUNT => ", account.id);
      user.stripe_account_id = account.id;

      user.save(function (err) {
        console.log("test");
      });
    }
    let accountLink = await stripes.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: "account_onboarding",
    });

    // 3. create account link based on account id (for frontend to complete onboarding)
    console.log(accountLink);
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
