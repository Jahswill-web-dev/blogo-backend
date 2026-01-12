import { AISaasContentPillarsModel } from "../models/Subtopics";

export async function storeContentPillars({
  userId,
  pillars,
  meta,
}: {
  userId: string;
  pillars: {
    pillar: string;
    pain?: string;
    subtopics: { subtopic: string }[];
  }[];
  meta?: Record<string, any>;
}) {
  if (!userId) {
    throw new Error("storeSubtopics: userId is required");
  }

  return await AISaasContentPillarsModel.findOneAndUpdate(
    { userId },
    { pillars, meta },
    { upsert: true, new: true }
  );
}

export async function getContentPillarsByUser(userId: string) {
  return AISaasContentPillarsModel.findOne({ userId }).lean();
}

// export async function getUsableSubtopics(userId: string) {
//   const doc = await AISaasContentPillarsModel.findOne({ userId }).lean();
//   if (!doc) return null;

//   return doc.pillars.flatMap(pillar =>
//     pillar.subtopics.map(s => s.subtopic)
//   );
// }

