import express from "express";

import todoRouter from "./routers/todo-router.js";
import userRouter from "./routers/user-router.js";

const app = express();
app.use(express.json());
app.use("/api/todos", todoRouter);
app.use("/api/user", userRouter);

app.listen(3400, () => {
  console.log("App is running on http://localhost:3400");
});
