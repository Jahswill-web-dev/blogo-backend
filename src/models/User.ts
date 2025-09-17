import { Schema, model, InferSchemaType, Document, Types } from "mongoose";

export interface IUser extends Document {
  // _id: string;
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  accessToken?: string;
  linkedinToken?: string
 // for LinkedIn/Meta later
}
export interface UserDocument extends IUser, Document {}
// export type UserDocument = IUser & Document;

const userSchema = new Schema<IUser>({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  avatar: String,
  accessToken: String,
  linkedinToken: String
});
// export type IUser = InferSchemaType<typeof userSchema> & Document;

export const User = model<IUser>("User", userSchema);
