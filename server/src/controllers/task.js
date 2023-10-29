import { TaskModel } from "../models/Task.js";
import { UserModel } from "../models/User.js";

export const getAllTasksByUserId = async (req, res, next) => {
  try {
    const userTasks = await TaskModel.find({
      taskOwner: { $in: req.user._id },
    });

    res.json(userTasks);

  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const {task, dueDateTime, taskOwner} =req.body;

    const newTask = new TaskModel({task, dueDateTime, taskOwner});
    
    await newTask.save();
    res.json(newTask);

  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await TaskModel.findByIdAndDelete(req.params.taskId);
    
    res.json(deletedTask);

  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const selectedTask = await TaskModel.findByIdAndUpdate(req.body.taskId);

    selectedTask.task = req.body.task;
    selectedTask.dueDateTime = req.body.dueDateTime;

    await selectedTask.save();
    res.json(selectedTask);

  } catch (error) {
    next(error);
  }
};
