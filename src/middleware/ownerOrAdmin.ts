import { NextFunction, Request, Response } from "express";

const adminOrOwner = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    console.log("userFrom adminorowner: ", user);
    const { userId } = req.params;

    //   checking user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    //   admin allow
    if (user.role === "admin") {
      return next();
    }

    console.log(typeof user.userId);
    console.log(typeof userId);

    //   userId match
    if (String(user.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "forbidden access",
      });
    }

    if (String(user.userId) === String(userId)) {
      return next();
    }

    return res
      .status(403)
      .json({ success: false, message: "Forbidden: not admin or owner" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default adminOrOwner;
