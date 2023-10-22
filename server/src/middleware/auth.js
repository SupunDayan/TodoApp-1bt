import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";

export const authorize = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    // return next(new ErrorResponse("Not authorized to access this route", 401));
    res
      .status(401)
      .json({ success: false, error: "Not authorized to access this route" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      //   return next(new ErrorResponse("No user found with this id", 404));
      res
        .status(404)
        .json({ success: false, error: "No user found with this id" });
    }

    req.user = user;

    next();
  } catch (err) {
    // return next(new ErrorResponse("Not authorized to access this router", 401));
    res
      .status(401)
      .json({ success: false, error: "Not authorized to access this router" });
  }
};
