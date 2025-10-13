import { Schema, model, models, Document } from "mongoose";

export interface IContentPost extends Document {
  userId: Schema.Types.ObjectId;
  ideaId: Schema.Types.ObjectId;
  rawIdea: string;
  refinedIdea: string;
  postText: string;
  platformVersions: {
    linkedin?: { text: string; hashtags?: string[] };
    x?: { text: string };
    blog?: { text: string };
  };
  userActions?: {
    refined?: boolean;
    regenerated?: boolean;
    scheduled?: boolean;
  };
  engagementPrediction?: number;
  createdAt: Date;
}

const contentPostSchema = new Schema<IContentPost>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ideaId: { type: Schema.Types.ObjectId, ref: "ContentIdea", required: true },
  rawIdea: { type: String, required: true },
  refinedIdea: { type: String },
  postText: { type: String },
  platformVersions: {
    linkedin: {
      text: String,
      hashtags: [String],
    },
    x: {
      text: String,
    },
    blog: {
      text: String,
    },
  },
  userActions: {
    refined: { type: Boolean, default: false },
    regenerated: { type: Boolean, default: false },
    scheduled: { type: Boolean, default: false },
  },
  engagementPrediction: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default models.ContentPost || model<IContentPost>("ContentPost", contentPostSchema);
