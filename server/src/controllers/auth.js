import { UserModel } from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res
    .status(statusCode)
    .json({ userId: user._id, sucess: true, token, user: user });
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.json(user);
  } catch (err) {
    return res.json(err);
  }
};

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  const userExist = await UserModel.findOne({ email });

  if (userExist) {
    return res.json({ message: "User already exist!" });
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
      error: "Enter email and password properly",
    });
  }

  try {
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Wrong credentials or User doesn't exist",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        error: "Wrong credentials or User doesn't exist",
      });
    }
    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const forgotPassword = async (req, res, next) => {
  // Send Email to email provided but first check if user exists
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      //   return next(new ErrorResponse("No email could not be sent", 404));
      return res
        .status(404)
        .json({ success: false, error: "Email couldn't be sent" });
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // HTML Message
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
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
  } catch (err) {
    // next(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const resetPassword = async (req, res, next) => {
  // Compare token in URL params to hashed token
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
      return res.status(400).json({ success: false, error: "User does not exist" });
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
      data: "Password Changed Successfully!",
    });
  } catch (error) {
    // next(err);
    return res.status(500).json({ success: false, error: error.message });
  }
};
