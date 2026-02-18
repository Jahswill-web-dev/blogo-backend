
//---pipeline to generate final educational subtopic post--

import { generateSkeletonTone, generateSubtopicSkeletonPost, rewriteSubtopicPost } from "../../pipelines/educationalPost";
import { getRandomSubtopicForUser, storeSubtopicPost } from "../../repositories/subtopicPosts.repository";


export async function generateFinalSubtopicPost({
    contentPillar,
    pain,
    subtopic,
    userId,
}: {
    contentPillar: string;
    pain: string;
    subtopic: string;
    userId: string;
}) {
    // Generate skeleton
    // console.log("Generating post for:", { userId, contentPillar, pain, subtopic });
    const skeletonResult = await generateSubtopicSkeletonPost(
        contentPillar,
        pain,
        subtopic,
        userId
    );

    const skeletonPost = skeletonResult.skeleton;

    // Generate tone
    const toneResult = await generateSkeletonTone(skeletonPost, contentPillar,
        pain,
        subtopic,);
    const tone = toneResult.tone;

    // Rewrite post
    const finalResult = await rewriteSubtopicPost(skeletonPost, contentPillar, subtopic, pain, tone);

    // Store in DB
    const storedPost = await storeSubtopicPost({
        userId,
        contentPillar,
        pain,
        subtopic,
        tone,
        skeleton: skeletonPost,
        finalPost: finalResult.post,
    });

    return {
        id: storedPost._id,
        tone,
        skeleton: skeletonPost,
        finalPost: finalResult.post,
        contentPillar,
        subtopic,
        pain,
    };
}


// New function that randomly selects subtopic and generates post
export async function generateRandomSubtopicPost(userId: string) {
    if (!userId) {
        throw new Error("userId is required");
    }

    // Get random content pillar and subtopic
    const randomSelection = await getRandomSubtopicForUser(userId);

    // console.log("Random selection:", randomSelection);

    // Generate post with the random selection
    return generateFinalSubtopicPost({
        userId,
        contentPillar: randomSelection.contentPillar,
        pain: randomSelection.pain,
        subtopic: randomSelection.subtopic,
    });
}