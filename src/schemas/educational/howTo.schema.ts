// src/schemas/educational/howTo.schema.ts
import { z } from "zod";

export const HowToSchema = z.object({
  hook: z.string(),
  problem: z.string(),
  steps: z.array(z.string()).min(1).max(10),
  example: z.string(),
  cta: z.string(),
});

export type HowTo = z.infer<typeof HowToSchema>;
