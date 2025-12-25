import { getCategoriesByUser } from "../../repositories/category.repository";

export async function fetchUserCategories({
  userId,
  type,
}: {
  userId: string;
  type: string;
}): Promise<string[]> {
  if (!userId) {
    throw new Error("fetchUserCategories: userId is required");
  }

  const categoryDoc = await getCategoriesByUser(userId, type);

  if (!categoryDoc || !Array.isArray(categoryDoc.items)) {
    throw new Error(
      `No ${type} categories found for user ${userId}`
    );
  }

  if (categoryDoc.items.length === 0) {
    throw new Error(
      `${type} categories exist but are empty for user ${userId}`
    );
  }

  return categoryDoc.items;
}
