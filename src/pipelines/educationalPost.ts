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


//---Fuunctions to generate skeleton, full post, and rewrite post--
export async function generateSubtopicSkeletonPost(
    contentPillar: string,
    pain: string,
    subtopic: string,
    userId: string,
) {
    if (!userId) {
        throw new Error("userId is required to Create subtopic skeleton post");
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

    // console.log("Generated subtopic skeleton post:", parsed);
    return parsed;

}

export async function generateSubtopicPost(skeletonPost: string) {
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
    // console.log("Generated subtopic post:", parsed);
    return parsed;


}

export async function rewriteSubtopicPost(post: string) {
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

