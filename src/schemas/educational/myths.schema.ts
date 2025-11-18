import { z } from "zod";

export const MythsSchema = z.object({
  hook: z.string(),
  myth: z.string(),
  truth: z.string(),
  why_it_matters: z.string(),
  fix: z.string(),
  cta: z.string(),
});

export type Myths = z.infer<typeof MythsSchema>;
