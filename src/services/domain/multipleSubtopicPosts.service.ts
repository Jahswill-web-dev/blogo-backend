import { generateRandomSubtopicPost } from "./subtopicPosts.service";

export async function generateMultipleSubtopicPosts(
    userId: string,
    count: number
) {
    if (!userId) {
        throw new Error("userId is required");
    }

    if (!count || count < 1) {
        throw new Error("Count must be at least 1");
    }

    if (count > 20) {
        throw new Error("Maximum 20 posts allowed per request");
    }

    const posts = await Promise.all(
        Array.from({ length: count }).map(() =>
            generateRandomSubtopicPost(userId)
        )
    );

    return posts;
}
