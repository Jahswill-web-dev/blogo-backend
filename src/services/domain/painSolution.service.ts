// src/services/domain/painSolution.service.ts
import { fetchUserCategories } from "./category.service";
import { selectRandomItem } from "../../utils/selectRandomItem";
import { generatePainSolutionPost } from "../../pipelines/painSolution.pipeline";

export async function createPainSolutionPost({
  userId,
  saasContext,
}: {
  userId: string;
  saasContext: Record<string, any>;
}) {
  const painCategories = await fetchUserCategories({
    userId,
    type: "pain",
  });

  if (!painCategories.length) {
    throw new Error("No pain categories found for user");
  }

  const selectedPain = selectRandomItem(painCategories);

  return generatePainSolutionPost({
    ...saasContext,
    selected_pain: selectedPain,
  });
}
