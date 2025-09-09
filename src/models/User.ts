import { Schema, model } from "mongoose";

interface IUser {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  accessToken?: string; // for LinkedIn/Meta later
}

const userSchema = new Schema<IUser>({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  avatar: String,
  accessToken: String,
});

export const User = model<IUser>("User", userSchema);
