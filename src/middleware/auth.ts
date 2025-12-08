import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers.authorization;

      console.log(`authMiddleware: ${authToken}`);
      if (!authToken) {
        return res.status(401).json({
          success: false,
          message: "You are Unauthorized",
        });
      }

      const decodedToken = jwt.verify(
        authToken,
        config.jwt_secret as string
      ) as JwtPayload;
      console.log(decodedToken);
      req.user = decodedToken;
      const user = req.user;

      // Role Checking
      if (roles.length && !roles.includes(user.role as string)) {
        console.log(`Unathorized ${user.role}`);
        return res.status(401).json({
          success: false,
          message: "Unathorized!! this role not allowed for this",
        });
      }

      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
        error: err,
      });
    }
  };
};

export default auth;
