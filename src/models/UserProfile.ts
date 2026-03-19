import { Schema, model, models, Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: Schema.Types.ObjectId;
  userNiche: string;           // "What Niche Content do you want to be known for?"
  targetAudience: string;      // "Who struggles with this problem?"
  productName?: string;        // "Do you have a product related to this problem?" (optional)
  productDescription?: string; // "What does your product do?" (optional)
  productAudience?: string;    // "Who is it for?" (optional)
  productSolution?: string;    // "How does it help with this problem?" (optional)
  focusArea: string;           // "What specific area of your niche do you want to focus on?"
  createdAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>({
  userId:             { type: Schema.Types.ObjectId, ref: "User", required: true },
  userNiche:          { type: String, required: true },
  targetAudience:     { type: String, required: true },
  productName:        { type: String },
  productDescription: { type: String },
  productAudience:    { type: String },
  productSolution:    { type: String },
  focusArea:          { type: String, required: true },
  createdAt:          { type: Date, default: Date.now },
});

export default models.UserProfile || model<IUserProfile>("UserProfile", userProfileSchema);
