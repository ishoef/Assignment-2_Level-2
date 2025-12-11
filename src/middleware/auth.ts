import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      console.log(`authMiddleware: ${authHeader}`);

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "You are Unauthorized",
        });
      }

      // Extract Bearer token
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1] // take the token only
        : authHeader; // fallback if "Bearer" missing

      // Verify JWT
      const decodedToken = jwt.verify(
        token as string,
        config.jwt_secret as string
      ) as JwtPayload;

      console.log("decoded token:", decodedToken);

      req.user = decodedToken;
      const user = req.user;

      // Role checking
      if (roles.length && !roles.includes(user.role as string)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized! This role is not allowed.",
        });
      }

      next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        error: err.message,
      });
    }
  };
};

export default auth;
