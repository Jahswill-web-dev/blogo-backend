import {
    subtopicPostFormatInstructions,
    subtopicPostParser, subtopicSkeletonFormatInstructions,
    SubtopicSkeletonParser
} from "../lib/parsers";
import {
    buildSubtopicPostPromptTemplate,
    buildSubtopicPostRewriteTemplate,
    buildSubtopicPostSkeletonPromptTemplate
} from "../lib/promptFactory";
import { runWithRetry } from "../lib/retry";
import { lcOpenAI } from "../services/langchainOpenAI";



async function generateSubtopicSkeletonPost(
    contentPillar: string,
    pain: string,
    subtopic: string,
    userId: string,
) {
    if (!userId) {
        throw new Error("userId is required to Create and store categories");
    }

    const promptTemplate = await buildSubtopicPostSkeletonPromptTemplate(Object.keys({
        content_pillar: contentPillar,
        pain,
        subtopic,
    }
    ));

    const promptText = await promptTemplate.format({
        content_pillar: contentPillar,
        pain,
        subtopic,
        format_instructions: subtopicSkeletonFormatInstructions,
    });

    const parsed = await runWithRetry(
        () => lcOpenAI.invoke(promptText), // LLM call
        SubtopicSkeletonParser,               // Zod parser
        2                                  // maxRetries (optional)
    );

    console.log("Generated subtopic skeleton post:", parsed);
    return parsed;

}



async function generateSubtopicPost(skeletonPost: string) {
    const promptTemplate = await buildSubtopicPostPromptTemplate(Object.keys({
        skeleton_post: skeletonPost,
    }
    ));
    const promptText = await promptTemplate.format({
        skeleton_post: skeletonPost,
        format_instructions: subtopicPostFormatInstructions,
    });
    const parsed = await runWithRetry(
        () => lcOpenAI.invoke(promptText), // LLM call
        subtopicPostParser,               // Zod parser
        2                                  // maxRetries (optional) 
    );
    console.log("Generated subtopic post:", parsed);
    return parsed;


}

async function rewriteSubtopicPost(post: string) {
    const promptTemplate = await buildSubtopicPostRewriteTemplate(Object.keys({
        original_post: post,
    }));
    const promptText = await promptTemplate.format({
        original_post: post,
        format_instructions: subtopicPostFormatInstructions,
    });
    const parsed = await runWithRetry(
        () => lcOpenAI.invoke(promptText), // LLM call
        subtopicPostParser,               // Zod parser
        2                                  // maxRetries (optional)
    );
    console.log("Generated rewritten subtopic post:", parsed);
    return parsed;
}



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
    const skeletonResult = await generateSubtopicSkeletonPost(
        contentPillar,
        pain,
        subtopic,
        userId
    );

    
    const skeletonPost = skeletonResult;

    // Generate full post
    const postResult = await generateSubtopicPost(skeletonPost);
    const post = postResult.post;

    //    rewrite post
    const finalResult = await rewriteSubtopicPost(post);

    return {
        skeleton: skeletonPost,
        post,
        finalPost: finalResult.post,
    };
}
