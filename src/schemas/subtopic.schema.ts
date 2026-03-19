import { z } from "zod";

const subtopicItemSchema = z.object({
  subtopic: z.string(),
  angle:    z.string(),
  goal:     z.string(),
});

export const contentPillarSchema = z.object({
  contentPillar: z.string(),
  pain:          z.string(),
  subtopics:     z.array(subtopicItemSchema).min(1).max(5),
});

export const contentStrategySchema = z.object({
  pillars: z.array(contentPillarSchema).min(3).max(5),
});

export type SubtopicItem = z.infer<typeof subtopicItemSchema>;
export type ContentPillar = z.infer<typeof contentPillarSchema>;
export type ContentStrategy = z.infer<typeof contentStrategySchema>;
