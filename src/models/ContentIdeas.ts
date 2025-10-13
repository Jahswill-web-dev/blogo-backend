import { Schema, model, models, Document } from "mongoose";

export interface IContentIdea extends Document {
  userId: Schema.Types.ObjectId;
  promptId: Schema.Types.ObjectId;
  batchId: string;
  ideas: string[];
  generatedCount: number;
  totalCount: number;
  createdAt: Date;
}

const contentIdeaSchema = new Schema<IContentIdea>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  promptId: { type: Schema.Types.ObjectId, ref: "ContentPrompt", required: true },
  batchId: { type: String, required: true },
  ideas: [{ type: String, required: true }],
  generatedCount: { type: Number, default: 5 },
  totalCount: { type: Number, default: 30 },
  createdAt: { type: Date, default: Date.now },
});

export default models.ContentIdea || model<IContentIdea>("ContentIdea", contentIdeaSchema);
