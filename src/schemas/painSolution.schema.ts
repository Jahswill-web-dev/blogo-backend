// src/schemas/educational/howTo.schema.ts
import { z } from "zod";

export const PainSolutionSchema = z.object({
  content: z.string(),
  category: z.string(), 
});

export type PainSolution = z.infer<typeof PainSolutionSchema>;