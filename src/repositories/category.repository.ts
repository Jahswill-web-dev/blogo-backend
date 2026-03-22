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
}: {
  userId: string;
  parsedPillars: {
    contentPillar: string;
    description: string;
    subtopics: { type: string; subtopic: string; angle: string; goal: string }[];
  }[];
}) {
  if (!userId) {
    throw new Error("storeSubtopics: userId is required");
  }

  const pillars = parsedPillars.map(p => ({
    pillar:      p.contentPillar,
    description: p.description,
    subtopics:   p.subtopics,
  }));

  return AISaasContentPillarsModel.findOneAndUpdate(
    { userId },
    { $set: { pillars } },
    { upsert: true, new: true }
  );
}

// Phase 1 — store 5 pillars with empty subtopics
export async function storePillarsOnly({
  userId,
  pillars,
}: {
  userId: string;
  pillars: { contentPillar: string; description: string }[];
}) {
  if (!userId) {
    throw new Error("storePillarsOnly: userId is required");
  }

  const mapped = pillars.map(p => ({
    pillar:      p.contentPillar,
    description: p.description,
    subtopics:   [],
  }));

  return AISaasContentPillarsModel.findOneAndUpdate(
    { userId },
    { $set: { pillars: mapped } },
    { upsert: true, new: true }
  );
}

// Phase 2 — update one pillar's subtopics by array index
export async function updatePillarSubtopics({
  userId,
  pillarIndex,
  subtopics,
}: {
  userId: string;
  pillarIndex: number;
  subtopics: { type: string; subtopic: string; angle: string; goal: string }[];
}) {
  if (!userId) {
    throw new Error("updatePillarSubtopics: userId is required");
  }

  return AISaasContentPillarsModel.findOneAndUpdate(
    { userId },
    { $set: { [`pillars.${pillarIndex}.subtopics`]: subtopics } },
    { new: true }
  );
}