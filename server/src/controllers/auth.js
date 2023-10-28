import { UserModel } from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

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
      return res.status(404).json({ success: false, error: "User not Found!" });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  const userExist = await UserModel.findOne({ email });

  if (userExist) {
    return res
      .status(400)
      .json({ success: false, error: "User already exist! Try login" });
  }

  try {
    const user = await UserModel.create({ username, email, password });
    sendToken(user, 201, res);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Enter Email and Password!",
    });
  }

  try {
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Wrong Email and Password! or User doesn't exist!",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        error: "Incorrect Password!",
      });
    }
    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      //   return next(new ErrorResponse("No email could not be sent", 404));
      return res
        .status(404)
        .json({ success: false, error: "Email couldn't be sent" });
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const message = `
      <h1>Password Reset</h1>
      <p>Please click on the following link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasseordExpiration = undefined;

      await user.save();

      //   return next(new ErrorResponse("Email could not be sent", 500));
      return res
        .status(500)
        .json({ success: false, error: "Email could not be sent" });
    }
  } catch (error) {
    // next(err);
    return res.status(500).json({ success: false, error: error.message });
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
      return res.status(400).json({ success: false, error: "Invalid Token" });
      //   return next(new ErrorResponse("Invalid Token", 400));
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
    // next(err);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const changePassword = async (req, res, next) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ _id: userId }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "User does not exist" });
      //   return next(new ErrorResponse("Invalid Token", 400));
    }

    const isPasswordMatched = await user.comparePassword(oldPassword);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        error: "Enter old password and new password correctly!",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Password Changed Successfully!",
    });
  } catch (error) {
    // next(err);
    return res.status(500).json({ success: false, error: error.message });
  }
};
