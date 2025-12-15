import { z } from "zod";

export const ChecklistSchema = z.object({
  title: z.string(),
  items: z.array(z.string()).min(3).max(7),
  cta: z.string(),
});

export type Checklist = z.infer<typeof ChecklistSchema>;
