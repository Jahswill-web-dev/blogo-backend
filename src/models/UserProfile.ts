import { Schema, model, models, Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: Schema.Types.ObjectId;
  saasName: string;
  productDescription: string;
  productPromise: string;
  targetAudience: string[];
  painPoints?: string[];
  // benefits?: string[];
  // goals: string[];
  // tone: string[];
  // contentExamples?: string[];
  createdAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  saasName: { type: String, required: true },
  productDescription: { type: String, required: true },
  productPromise: { type: String, required: true },
  targetAudience: [{ type: String }],
  painPoints: [{ type: String }],
  // benefits: [{ type: String }],
  // goals: [{ type: String }],
  // tone: [{ type: String }],
  // contentExamples: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default models.UserProfile || model<IUserProfile>("UserProfile", userProfileSchema);
