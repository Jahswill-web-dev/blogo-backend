import { Schema, model, models, Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: Schema.Types.ObjectId;
  companyName: string;
  industry: string;
  stage: "idea" | "mvp" | "seed" | "growth" | "scaling";
  description: string;
  audience: string[];
  goals: string[];
  tonePreference: string[];
  contentExamples?: string[];
  createdAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  stage: { type: String, enum: ["idea", "mvp", "seed", "growth", "scaling"], required: true },
  description: { type: String, required: true },
  audience: [{ type: String }],
  goals: [{ type: String }],
  tonePreference: [{ type: String }],
  contentExamples: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default models.UserProfile || model<IUserProfile>("UserProfile", userProfileSchema);
