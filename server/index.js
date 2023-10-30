import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ConnectDB } from "./src/config/db.js";
import { AuthRouter } from "./src/routes/auth.js";
import { TaskRouter } from "./src/routes/task.js";
import { errorHandler } from "./src/middleware/error.js";

dotenv.config();

ConnectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", AuthRouter);
app.use("/task", TaskRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`SERVER STARTED AT PORT ${PORT}`)
);

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error is Logged: ${error.message}`);
  server.close(() => process.exit(1));
});
