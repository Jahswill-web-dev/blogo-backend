import { z } from "zod";

export const FoundationalConceptSchema = z.object({
  principle: z.string(),
  importance: z.string(),
  example: z.string(),
  cta: z.string(),
});

export type FoundationalConcept = z.infer<typeof FoundationalConceptSchema>;
