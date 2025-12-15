import { z } from "zod";

export const DataBackedInsightSchema = z.object({
  statistic: z.string(),
  interpretation: z.string(),
  implication: z.string(),
  cta: z.string(),
});

export type DataBackedInsight = z.infer<typeof DataBackedInsightSchema>;
