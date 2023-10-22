import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ConnectDB } from "./config/db.js";
import { AuthRouter } from "./routes/auth.js";
import { PrivateRouter } from "./routes/private.js";
import { TaskRouter } from "./routes/task.js";

dotenv.config();

ConnectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", AuthRouter);
app.use("/private", PrivateRouter);
app.use("/task", TaskRouter);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`SERVER STARTED AT PORT ${PORT}`)
);

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error is Logged: ${error.message}`);
  server.close(() => process.exit(1));
});
