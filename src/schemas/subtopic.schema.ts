import { z } from "zod";

const subtopicItemSchema = z.object({
  type:     z.string(),
  subtopic: z.string(),
  angle:    z.string(),
  goal:     z.string(),
});

export const contentPillarSchema = z.object({
  contentPillar: z.string(),
  description:   z.string(),
  subtopics:     z.array(subtopicItemSchema).min(1).max(6),
});

export const contentStrategySchema = z.object({
  pillars: z.array(contentPillarSchema).min(3).max(5),
});

// Phase 1 — pillars only (no subtopics yet)
export const pillarItemSchema = z.object({
  contentPillar: z.string(),
  description:   z.string(),
});

export const pillarsOnlySchema = z.object({
  pillars: z.array(pillarItemSchema).min(5).max(5),
});

// Phase 2 — subtopics for a single pillar
export const singlePillarSubtopicsSchema = z.object({
  subtopics: z.array(subtopicItemSchema).min(6).max(6),
});

export type SubtopicItem = z.infer<typeof subtopicItemSchema>;
export type ContentPillar = z.infer<typeof contentPillarSchema>;
export type ContentStrategy = z.infer<typeof contentStrategySchema>;
export type PillarItem = z.infer<typeof pillarItemSchema>;
export type PillarsOnly = z.infer<typeof pillarsOnlySchema>;
export type SinglePillarSubtopics = z.infer<typeof singlePillarSubtopicsSchema>;
