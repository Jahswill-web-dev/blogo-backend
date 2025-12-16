import { z } from "zod";

export const QuestionTypesSchema = z.object({
 items: z.array(z.string().min(1)).length(20),
});

export type QuestionTypes = z.infer<typeof QuestionTypesSchema>;
