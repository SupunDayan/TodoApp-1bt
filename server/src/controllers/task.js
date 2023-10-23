import { TaskModel } from "../models/Task.js";
import { UserModel } from "../models/User.js";

export const getAllTasksByUserId = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        const userTasks = await TaskModel.find({
          taskOwner: { $in: user._id},
        });
        res.json({ userTasks });
      } catch (err) {
        res.json(err);
      }
}

export const createTask = async (req, res, next) => {

    // const {task, dueDateTime, taskOwner } = req.body;

    try{
        const task = new TaskModel(req.body);
        await task.save();
        res.json({success:true, task});    
    }catch(err){
        console.error(err);
        res.json({success:false,"error":err});
    } 
}

export const deleteTask = async (req, res, next) => {
    try{
        const response = await TaskModel.findByIdAndDelete(req.params.taskId);
        res.json(response);
    }catch(err){
        console.error(err);
    } 
}

export const updateTask = async (req, res, next) => {
    try{
        const task = await TaskModel.findByIdAndUpdate(req.body.taskId);
        task.task = req.body.task;
        task.dueDateTime = req.body.dueDateTime;
        await task.save();
        res.json({success: true,task});
    }catch(err){
        console.error(err);
    } 
}
