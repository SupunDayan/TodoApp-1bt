import { UserModel } from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { ErrorResponse } from "../utils/errorResponse.js";

const sendToken = (user, statusCode, res) => {
  const authToken = user.getSignedToken();
  res.status(statusCode).json({
    sucess: true,
    authToken,
    userId: user._id,
    username: user.username,
  });
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).select(
      "+password"
    );

    if (!user) {
      return next(new ErrorResponse("User not Found!" , 404));
    }

    res.status(200).json(user);

  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  const userExist = await UserModel.findOne({ email });

  if (userExist) {
    return next(new ErrorResponse("User already exist! Try login", 400));
  }

  try {
    const user = await UserModel.create({ username, email, password });
    sendToken(user, 201, res);

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Enter Email and Password!", 400));
  }

  try {
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Wrong Email and Password!", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorResponse("Incorrect Password!", 401));
    }
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
        return next(new ErrorResponse("Email couldn't be sent", 404));      
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const message = `
      <h1>TodoApp-1bt</h1>
      <h2>You have requested a Password Reset!"</h2> 
      <p>Please go to the following link to reset your password:</p>
      <p>The link will be expired in 10 minutes</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {

      user.resetPasswordToken = undefined;
      user.resetPasseordExpiration = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));      
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasseordExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasseordExpiration = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Updated Successfully!",
      token: user.getSignedToken(),
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ _id: userId }).select("+password");

    if (!user) {
      return next(new ErrorResponse("User does not exist", 400));
    }

    const isPasswordMatched = await user.comparePassword(oldPassword);

    if (!isPasswordMatched) {
      return next(new ErrorResponse("Enter old password and new password correctly!", 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Password Changed Successfully!",
    });
  } catch (error) {
    next(error);
  }
};
