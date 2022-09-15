import { expressjwt } from "express-jwt";

export const requireSignin = expressjwt({
  //@ts-ignore
  getToken: (req, res) => req.cookies.token,
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
});
