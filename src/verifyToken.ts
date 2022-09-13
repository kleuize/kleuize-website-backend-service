import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IGetUserInfoRequest extends Request {
  user?: any;
  id?: any;
  isAdmin?: boolean;
}
export const verifyToken = (
  req: IGetUserInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = (authHeader as string).split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC as string, (err, user) => {
      if (err) res.status(403).json("Token is not valid");
      req.user = user;
      next();
    });
  }
};

export const verifyTokenAndAuthorization = (
  req: IGetUserInfoRequest,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.params.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!(Auth)");
    }
  });
};

export const verifyTokenAndAdmin = (
  req: IGetUserInfoRequest,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!(isAdmin)");
    }
  });
};
