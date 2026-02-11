
//---pipeline to generate final educational subtopic post--

import { generateSubtopicPost, generateSubtopicSkeletonPost, rewriteSubtopicPost } from "../../pipelines/educationalPost";
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

    // Generate full post
    const postResult = await generateSubtopicPost(skeletonPost);
    const post = postResult.post;

    // Rewrite post
    const finalResult = await rewriteSubtopicPost(post);

    // Store in DB
    const storedPost = await storeSubtopicPost({
        userId,
        contentPillar,
        pain,
        subtopic,
        post,
        skeleton: skeletonPost,
        finalPost: finalResult.post,
    });

    return {
        id: storedPost._id,
        post,
        skeleton: skeletonPost,
        finalPost: finalResult.post,
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