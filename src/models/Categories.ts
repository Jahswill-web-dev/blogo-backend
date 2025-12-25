import { Schema, model, Types, Document } from "mongoose";

export interface CategoryDocument extends Document {
  userId: Types.ObjectId;
  type: "pain" | "general" | "questions";
  items: string[];
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<CategoryDocument>(
    {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    items: {
      type: [String],
      required: true,
    },
    meta: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export const CategoryModel = model<CategoryDocument>("Category", CategorySchema);
