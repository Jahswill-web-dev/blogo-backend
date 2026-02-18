// models/SubtopicPosts.ts
import { Schema, model, models, Document } from "mongoose";

export interface ISubtopicPost {
  userId: Schema.Types.ObjectId;
  contentPillar: string;
  pain: string;
  subtopic: string;
  post: string;
  skeleton?: string;
  finalPost?: string;
  meta?: Record<string, any>;
}

export interface SubtopicPostDocument extends ISubtopicPost, Document {
  createdAt: Date;
  updatedAt: Date;
}

const SubtopicPostSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentPillar: {
      type: String,
      required: true,
    },
    pain: {
      type: String,
      required: true,
    },
    subtopic: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      required: true,
    },
    skeleton: {
      type: String,
    },
    finalPost: {
      type: String,
    },
    meta: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
SubtopicPostSchema.index({ userId: 1, contentPillar: 1 });
SubtopicPostSchema.index({ userId: 1, subtopic: 1 });

export const SubtopicPostModel =
  models.SubtopicPost || model<SubtopicPostDocument>("SubtopicPost", SubtopicPostSchema);