import { Schema, model, models, Document } from "mongoose";

export interface IContentPost extends Document {
  userId: Schema.Types.ObjectId;
  batchId: string;  // unique ID for this generation batch
  platform: string; // e.g., "linkedin", "x", "blog"
  posts: {
    idea: string;      // idea used for the post
    postText: string;
    isPublished:Boolean;
    publishedAt:Date;
    scheduledFor:Date;  
  }[];// generated post text
  generatedCount: number;
  createdAt: Date;
}

const contentPostSchema = new Schema<IContentPost>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  batchId: { type: String, required: true },
  platform: { type: String, enum: ["Linkedin", "X", "Blog"], default: "Linkedin" },
  posts: [
    {
      idea: { type: String },
      postText: { type: String, required: true },
      isPublished: { type: Boolean, default: false },
      publishedAt: { type: Date },
      scheduledFor: { type: Date },
    },
  ],
  generatedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default models.ContentPost || model<IContentPost>("ContentPost", contentPostSchema);
