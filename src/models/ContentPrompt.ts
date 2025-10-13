import { Schema, model, models, Document } from "mongoose";

export interface IContentPrompt extends Document {
  userId: Schema.Types.ObjectId;
  contentType: "conceptual" | "personal";
  mainGoal: string;
  topics: string[];
  audienceTraits: string[];
  toneStyle: string[];
  avoidTopics?: string[];
  contextPromptTemplate?: string;
  batchId?: string;
  createdAt: Date;
}

const contentPromptSchema = new Schema<IContentPrompt>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  contentType: { type: String, enum: ["conceptual", "personal"], required: true },
  mainGoal: { type: String, required: true },
  topics: [{ type: String }],
  audienceTraits: [{ type: String }],
  toneStyle: [{ type: String }],
  avoidTopics: [{ type: String }],
  contextPromptTemplate: { type: String },
  batchId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default models.ContentPrompt || model<IContentPrompt>("ContentPrompt", contentPromptSchema);
