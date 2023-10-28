import { TaskModel } from "../models/Task.js";
import { UserModel } from "../models/User.js";

export const getAllTasksByUserId = async (req, res, next) => {
  try {
    // const user = await UserModel.findById(req.params.userId);
    const userTasks = await TaskModel.find({
      taskOwner: { $in: req.user._id },
    });
    res.json(userTasks);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = new TaskModel(req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const response = await TaskModel.findByIdAndDelete(req.params.taskId);
    res.json(response);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await TaskModel.findByIdAndUpdate(req.body.taskId);
    task.task = req.body.task;
    task.dueDateTime = req.body.dueDateTime;
    await task.save();
    res.json(task);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
