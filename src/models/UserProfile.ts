import { Schema, model, models, Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: Schema.Types.ObjectId;
  companyName: string;
  industry: string;
  description: string;
  audience: string[];
  painPoints?: string[];
  benefits?: string[];
  // goals: string[];
  tone: string[];
  contentExamples?: string[];
  createdAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  description: { type: String, required: true },
  audience: [{ type: String }],
  painPoints: [{ type: String }],
  benefits: [{ type: String }],
  // goals: [{ type: String }],
  tone: [{ type: String }],
  contentExamples: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default models.UserProfile || model<IUserProfile>("UserProfile", userProfileSchema);
