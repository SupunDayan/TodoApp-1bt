import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    task: {
      type: String,
      required: [true, "Enter a task"],
    },
  
    dueDateTime: {
      type: Date,
      required: [true, "Enter Date and Time"],
      unique: true,
      default:Date.now()
    },
    
    taskOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
  });

  export const TaskModel = mongoose.model("tasks", TaskSchema);