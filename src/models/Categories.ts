import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
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

export const CategoryModel = model("Category", CategorySchema);
