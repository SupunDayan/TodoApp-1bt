import express from "express";
import { getAllTasksByUserId, createTask, deleteTask, updateTask } from "../controllers/task.js";

const router = express.Router();

router.route("/getAll/:userId").get(getAllTasksByUserId);

router.route("/create").post(createTask);

router.route("/delete/:taskId").delete(deleteTask);

router.route("/update").put(updateTask);

export { router as TaskRouter };