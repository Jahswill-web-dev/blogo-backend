import { z } from "zod";

export const subtopicPostSchema = z.object({
    post: z.string().min(5, "post must not be empty").max(280, "Post cannot exceed 280 characters"),
});

export const subtopicSkeletonSchema = z.object({
    skeleton: z.string(),
});


export type SubtopicPost = z.infer<typeof subtopicPostSchema>;