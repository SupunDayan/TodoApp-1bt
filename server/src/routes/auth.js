import express from "express";
import { getUserById, register, login, forgotPassword, resetPassword, changePassword } from "../controllers/auth.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/get-user").get(authorize,getUserById);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password/:resetToken").put(resetPassword);

router.route("/change-password").put(authorize,changePassword);

export { router as AuthRouter };
