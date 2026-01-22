import { CategoryModel, CategoryDocument } from "../models/Categories";
import { AISaasContentPillarsModel } from "../models/Subtopics";

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

export async function storeSubtopics({
  userId,
  parsedPillars,
  }:{
    userId: string;
    parsedPillars:{
      contentPillar: string;
      pain: string;
      subtopics: string[];
    }[];
  }) {

    if (!userId) {
    throw new Error("storeSubtopics: userId is required");
  } 
   const pillars = parsedPillars.map(p => ({
    pillar: p.contentPillar,
    pain: p.pain,
    subtopics: p.subtopics.map(sub => ({ subtopic: sub })),
  }));

  return AISaasContentPillarsModel.create({
    userId, 
    pillars,
  });
}