import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());

const fileData = fs.readFileSync("./data.json", "utf-8");

let todos = JSON.parse(fileData);

app.get("/", (req, res) => {
  return res.send(todos);
});

const updateFileData = () => {
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
};

app.post("/", (req, res) => {
  const body = req.body;
  const task = body.task;
  if (!task) {
    return res.status(400).send({ message: "Task connot be empty" });
  }
  const newTodo = {
    id: nanoid(),
    task: task,
    checked: false,
  };
  todos.push(newTodo);
  updateFileData();
  return res.send({ message: "Task successfully added", newTodo });
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  if (!todo) {
    return res.status(404).send({ message: "Task not found" });
  }
  const todo = todos.find((item) => item.id == id);
  return res.send(todo);
});

app.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const deletedTask = todos.find((item) => item.id == id);
  if (!deletedTask) {
    return res.status(404).send({ message: "Task not found" });
  }
  todos = todos.filter((item) => item.id !== id);
  updateFileData();
  res.send({ message: "Successfully deleted", deletedTask });
});

app.put("/:id", (req, res) => {
  const body = req.body;
  const task = body.task;
  const checked = Boolean(body.checked);
  const id = Number(req.params.id);
  const updatedTask = todos.find((todo) => todo.id == id);
  if (!updatedTask) {
    return res.status(404).send({ message: "Task not found" });
  }
  if (!task && checked === undefined) {
    return res
      .status(400)
      .send({ message: "Body must have atleast task or checked" });
  }
  const editedTask = {
    ...updatedTask,
    ...(task && { task }),
    ...(checked !== undefined && { checked }),
  };
  todos = todos.map((todo) => {
    if (todo.id == id) {
      return editedTask;
    }
    return todo;
  });
  updateFileData();
  res.send({ message: "Successfully edited", editedTask });
});

app.listen(3400, () => {
  console.log("App is running on http://localhost:3400");
});
