// src/schemas/educational/howTo.schema.ts
import { z } from "zod";

export const HowToSchema = z.object({
    platform: z.string(),
    post: z.string()
  });

export type HowTo = z.infer<typeof HowToSchema>;
