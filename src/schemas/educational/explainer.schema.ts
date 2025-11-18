import { z } from "zod";

export const ExplainerSchema = z.object({
  term: z.string(),
  definition: z.string(),
  analogy: z.string(),
  example: z.string(),
  cta: z.string(),
});

export type Explainer = z.infer<typeof ExplainerSchema>;
