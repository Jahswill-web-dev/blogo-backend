import { CategoryModel, CategoryDocument } from "../models/Categories";

export async function storeCategories({userId, type, items, meta,}: {
  userId: string;
  type: string;
  items: string[];
  meta?: Record<string, any>;
}) {
    if (!userId) {
    throw new Error("storeCategories: userId is required");
  }
  return CategoryModel.create({
    userId,
    type,
    items,
    meta,
  });
}

export async function getCategoriesByUser(
  userId: string,
  type: string
) {
  return CategoryModel.findOne({ userId, type }).lean();
}