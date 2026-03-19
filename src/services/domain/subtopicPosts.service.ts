
//---pipeline to generate final educational subtopic post--

import { generateEducationalPost } from "../../pipelines/educationalPost";
import { getRandomSubtopicForUser, storeSubtopicPost } from "../../repositories/subtopicPosts.repository";


export async function generateFinalSubtopicPost({
    contentPillar,
    pain,
    subtopic,
    angle,
    goal,
    userId,
}: {
    contentPillar: string;
    pain: string;
    subtopic: string;
    angle: string;
    goal: string;
    userId: string;
}) {
    const { post } = await generateEducationalPost({ contentPillar, subtopic, angle, goal });

    const storedPost = await storeSubtopicPost({
        userId,
        contentPillar,
        pain,
        subtopic,
        finalPost: post,
    });

    return {
        id: storedPost._id,
        finalPost: post,
        contentPillar,
        subtopic,
        angle,
        goal,
        pain,
    };
}


// Randomly selects a subtopic and generates a post
export async function generateRandomSubtopicPost(userId: string) {
    if (!userId) {
        throw new Error("userId is required");
    }

    const randomSelection = await getRandomSubtopicForUser(userId);

    return generateFinalSubtopicPost({
        userId,
        contentPillar: randomSelection.contentPillar,
        pain:          randomSelection.pain,
        subtopic:      randomSelection.subtopic,
        angle:         randomSelection.angle,
        goal:          randomSelection.goal,
    });
}
