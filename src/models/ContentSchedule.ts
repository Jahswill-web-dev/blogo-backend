import { Schema, model, models, Document } from "mongoose";

export interface IContentSchedule extends Document {
  userId: Schema.Types.ObjectId;
  platform: "linkedin" | "x";
  postText: string;
  scheduledFor: Date;         // When to post
  status: "scheduled" | "posted" | "failed";
  postedAt?: Date;
  error?: string;
}

const contentScheduleSchema = new Schema<IContentSchedule>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  platform: { type: String, enum: ["linkedin", "x"], required: true },
  postText: { type: String, required: true },
  scheduledFor: { type: Date, required: true },
  status: { type: String, enum: ["scheduled", "posted", "failed"], default: "scheduled" },
  postedAt: { type: Date },
  error: { type: String },
});

export default models.ContentSchedule || model<IContentSchedule>("ContentSchedule", contentScheduleSchema);
