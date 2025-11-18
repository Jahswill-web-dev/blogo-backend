import { z } from "zod";

export const BestPracticesSchema = z.object({
  topic: z.string(),
  dos: z.array(z.string()).min(1).max(5),
  donts: z.array(z.string()).min(1).max(5),
  cta: z.string(),
});

export type BestPractices = z.infer<typeof BestPracticesSchema>;
