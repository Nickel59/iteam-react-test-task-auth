import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";

import { connectDb, createUser, findUser } from "./odm.js";
import { isString, verifyUserCredentials } from "./utils.js";

dotenv.config();

(async () => await connectDb())();

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const userCredentials = verifyUserCredentials(req.body?.email, req.body?.password);
  const [name, desiredJobTitle, aboutMe] = [req.body?.name, req.body?.desiredJobTitle, req.body?.aboutMe];
  if (!(userCredentials && isString(name) && isString(desiredJobTitle) && isString(aboutMe))) {
    res.status(400).send({ error: "Invalid field" });
    return;
  }
  const user = await findUser(userCredentials.email);
  if (user) {
    res.status(400).send({ error: "Email already used" });
    return;
  }
  let hashedPassword = "";
  try {
    hashedPassword = await bcrypt.hash(userCredentials.password, await bcrypt.genSalt());
  } catch {
    res.status(500).send();
    return;
  }
  createUser(userCredentials.email, hashedPassword, name, desiredJobTitle, aboutMe);
  res.status(200).send();
});

app.post("/login", async (req, res) => {
  function send400() {
    res.status(400).send({ error: "Invalid email or password" });
  }

  const userCredentials = verifyUserCredentials(req.body?.email, req.body?.password);
  if (!userCredentials) {
    send400();
    return;
  }
  const user = await findUser(userCredentials.email);
  if (!user) {
    send400();
    return;
  }
  try {
    const result = await bcrypt.compare(userCredentials.password, user.hashedPassword);
    if (!result) {
      send400();
      return;
    }
  } catch {
    send400();
    return;
  }
  res.status(200).send({ name: user.name, desiredJobTitle: user.desiredJobTitle, aboutMe: user.aboutMe });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
