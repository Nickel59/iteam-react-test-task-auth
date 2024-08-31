import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import type yup from "yup";

import { connectDb, createUser, findUser } from "./odm.js";
import { userCredentialsSchema, userDetailsSchema } from "./utils.js";

dotenv.config();

(async () => await connectDb())();

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  let userDetails = {} as yup.InferType<typeof userDetailsSchema>;
  try {
    userDetails = await userDetailsSchema.validate(req.body);
  } catch {
    res.status(400).send({ error: "Invalid field" });
    return;
  }
  const user = await findUser(userDetails.email);
  if (user) {
    res.status(400).send({ error: "Email already used" });
    return;
  }
  let hashedPassword = "";
  try {
    hashedPassword = await bcrypt.hash(userDetails.password, await bcrypt.genSalt());
  } catch {
    res.status(500).send();
    return;
  }
  createUser(userDetails.email, hashedPassword, userDetails.name, userDetails.desiredJobTitle, userDetails.aboutMe);
  res.status(200).send();
});

app.post("/login", async (req, res) => {
  function send400() {
    res.status(400).send({ error: "Invalid email or password" });
  }
  let userCredentials = {} as yup.InferType<typeof userCredentialsSchema>;
  try {
    userCredentials = await userCredentialsSchema.validate(req.body);
  } catch {
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
