// repositories/subtopicPosts.ts
import { SubtopicPostModel, SubtopicPostDocument } from "../models/SubtopicPosts";
import {  AISaasContentPillarsModel } from "../models/Subtopics" 

export async function storeSubtopicPost({
  userId,
  contentPillar,
  pain,
  subtopic,
  post,
  skeleton,
  finalPost,
  meta,
}: {
  userId: string;
  contentPillar: string;
  pain: string;
  subtopic: string;
  post: string;
  skeleton?: string;
  finalPost?: string;
  meta?: Record<string, any>;
}) {
  if (!userId) {
    throw new Error("storeSubtopicPost: userId is required");
  }

  return SubtopicPostModel.create({
    userId,
    contentPillar,
    pain,
    subtopic,
    post,
    skeleton,
    finalPost,
    meta,
  });
}

export async function getSubtopicPostsByUser(
  userId: string,
  filters?: {
    contentPillar?: string;
    subtopic?: string;
  }
) {
  const query: any = { userId };
  
  if (filters?.contentPillar) {
    query.contentPillar = filters.contentPillar;
  }
  
  if (filters?.subtopic) {
    query.subtopic = filters.subtopic;
  }

  return SubtopicPostModel.find(query).lean();
}

export async function getSubtopicPostById(postId: string) {
  return SubtopicPostModel.findById(postId).lean();
}

export async function updateSubtopicPost(
  postId: string,
  updates: Partial<{
    post: string;
    skeleton: string;
    finalPost: string;
    meta: Record<string, any>;
  }>
) {
  return SubtopicPostModel.findByIdAndUpdate(
    postId,
    { $set: updates },
    { new: true }
  ).lean();
}

export async function deleteSubtopicPost(postId: string) {
  return SubtopicPostModel.findByIdAndDelete(postId);
}




// ... random subtopic selection....

export async function getRandomSubtopicForUser(userId: string) {
  const contentStrategy = await AISaasContentPillarsModel.findOne({ userId }).lean();
  
  if (!contentStrategy || !contentStrategy.pillars || contentStrategy.pillars.length === 0) {
    throw new Error("No content pillars found for user");
  }

  // Randomly select a pillar
  const randomPillarIndex = Math.floor(Math.random() * contentStrategy.pillars.length);
  const selectedPillar = contentStrategy.pillars[randomPillarIndex];

  if (!selectedPillar.subtopics || selectedPillar.subtopics.length === 0) {
    throw new Error("No subtopics found for selected pillar");
  }

  // Randomly select a subtopic from the pillar
  const randomSubtopicIndex = Math.floor(Math.random() * selectedPillar.subtopics.length);
  const selectedSubtopic = selectedPillar.subtopics[randomSubtopicIndex];

  return {
    contentPillar: selectedPillar.pillar,
    pain: selectedPillar.pain || "",
    subtopic: selectedSubtopic.subtopic,
  };
}