import { Request, Response } from "express";
import User from "../models/user";
import * as jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/auth";
import AWS from "aws-sdk";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

function generateUID() {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  var firstPart: any = (Math.random() * 46656) | 0;
  var secondPart: any = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

export const register = async (req: Request, res: Response) => {
  //now we use the functions of the model to has the password then we'll save and divert back to register route
  try {
    console.log(req.body);
    const { name, surName, email, password } = req.body;
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
      surName,
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

export const currentUser = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.auth._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const shortCode = generateUID().toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) return res.status(400).send("User not found");

    const params: any = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
                <html>
                  <h1>Reset password</h1>
                  <p>User this code to reset your password</p>
                  <h2 style="color:red;">${shortCode}</h2>
                  <i>edemy.com</i>
                </html>
              `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset Password",
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err: any) => {
        console.log(err);
      });
  } catch (err: any) {
    console.log(err);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    const hashedPassword = await hashPassword(newPassword);

    const user = User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();
    res.json({ ok: true });
  } catch (err: any) {
    console.log(err);
    return res.status(400).send("Error! Try again.");
  }
};
