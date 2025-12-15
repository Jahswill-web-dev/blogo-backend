import { z } from "zod";

export const QuestionTypesSchema = z.object({
 items: z.array(z.string()).length(10),
});

export type QuestionTypes = z.infer<typeof QuestionTypesSchema>;
