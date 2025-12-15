// src/schemas/educational/howTo.schema.ts
import { z } from "zod";

export const PainCategoriesSchema = z.object({
  category: z.string(),
  items: z.array(z.string()).length(20),
});

export type PainCategories = z.infer<typeof PainCategoriesSchema>;