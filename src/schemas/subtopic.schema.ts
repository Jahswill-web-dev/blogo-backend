import { z } from "zod";

export const contentPillarSchema = z.object({
  contentPillar: z.string(),
  pain: z.string(),
  subtopics: z.array(z.string()).min(1).max(5),
});

export const contentStrategySchema = z.object({
  pillars: z
    .array(contentPillarSchema)
    .length(7),
});

export type ContentPillar = z.infer<typeof contentPillarSchema>;
export type ContentStrategy = z.infer<typeof contentStrategySchema>;