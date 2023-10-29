import express from "express";
import { getAllTasksByUserId, createTask, deleteTask, updateTask } from "../controllers/task.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/getAll").get(authorize, getAllTasksByUserId);

router.route("/create").post(authorize, createTask);

router.route("/delete/:taskId").delete(authorize, deleteTask);

router.route("/update").put(authorize, updateTask);

export { router as TaskRouter };