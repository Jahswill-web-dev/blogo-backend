// src/schemas/educational/howTo.schema.ts
import { z } from "zod";

export const PainSolutionSchema = z.object({
  category: z.string(),
  items: z.array(z.string()).length(20),
});

export type PainSolution = z.infer<typeof PainSolutionSchema>;