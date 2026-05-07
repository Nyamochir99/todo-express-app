import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

const router = express.Router();

const userData = fs.readFileSync("./users.json", "utf-8");

let users = JSON.parse(userData);

const updateUserData = () => {
  fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
};

router.get("/", (req, res) => {
  return res.send(users);
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Username or password connot be empty" });
  }

  if (username.includes(" ")) {
    return res.status(400).send({ message: "Username cannot contain spaces" });
  }

  const existingUser = users.find((user) => user.username == username);
  if (existingUser) {
    return res.status(400).send({ message: "Username already taken" });
  }

  const passwordErrors = [];
  if (password.length < 8) passwordErrors.push("at least 8 characters long");
  if (!/[A-Z]/.test(password)) passwordErrors.push("one uppercase letter");
  if (!/[a-z]/.test(password)) passwordErrors.push("one lowercase letter");
  if (!/[0-9]/.test(password)) passwordErrors.push("one number");
  if (!/[!@#$%^&*_+=,.?-]/.test(password))
    passwordErrors.push("one special character ( !@#$%^&*_+=,.?- )");
  if (password.includes(" ")) passwordErrors.push("no spaces");

  if (passwordErrors.length > 0) {
    return res.status(400).send({
      message: `Password must contain: ${passwordErrors.join(", ")}.`,
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: nanoid(),
    username,
    password: hashedPassword,
  };
  users.push(newUser);
  updateUserData();
  return res.send({ message: "User successfully added", newUser });
});

router.post("/check", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Username or password connot be empty" });
  }

  const existingUser = users.find((user) => user.username == username);
  if (!existingUser) {
    return res.status(400).send({ message: "User not found" });
  }

  const isMatching = bcrypt.compareSync(password, existingUser.password);
  return res.send(isMatching);
});

export default router;
