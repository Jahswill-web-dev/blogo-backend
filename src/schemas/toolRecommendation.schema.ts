import { z } from "zod";

export const ToolRecommendationSchema = z.object({
  pain_point: z.string(),
  tool: z.string(),
  how_it_helps: z.string(),
  use_case: z.string(),
  cta: z.string(),
});

export type ToolRecommendation = z.infer<typeof ToolRecommendationSchema>;
