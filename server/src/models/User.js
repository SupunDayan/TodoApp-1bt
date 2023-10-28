import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter an username"],
  },

  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    select: false,
  },

  resetPasswordToken: { type: String },
  resetPasseordExpiration: { type: Date },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasseordExpiration = Date.now() + 10 * (60 * 1000); 
  return resetToken;
};

export const UserModel = mongoose.model("users", UserSchema);
