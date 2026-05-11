import express from "express";

import todoRouter from "./routers/todo-router.js";
import userRouter from "./routers/user-router.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use("/api/todos", todoRouter);
app.use("/api/user", userRouter);

app.listen(3400, async () => {
  await mongoose.connect(
    "mongodb+srv://nyamochir:JnCj2n3KsKl0Tgs9@cluster0.jikqleo.mongodb.net/todo-app",
  );
  console.log("App is running on http://localhost:3400");
});
