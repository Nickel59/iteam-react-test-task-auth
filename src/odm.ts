import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  name: { type: String, required: true },
  desiredJobTitle: { type: String, required: true },
  aboutMe: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export async function findUser(email: string) {
  return await User.findOne({ email }).lean();
}

export async function createUser(
  email: string,
  hashedPassword: string,
  name: string,
  desiredJobTitle: string,
  aboutMe: string,
) {
  await User.create({ email, hashedPassword, name, desiredJobTitle, aboutMe });
}

export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_URI as string);
    // biome-ignore lint/suspicious/noConsoleLog: Exception
    console.log("DB connection established");
  } catch (error) {
    // biome-ignore lint/suspicious/noConsoleLog: Exception
    console.log(`Connection failed ${error}`);
  }
}
