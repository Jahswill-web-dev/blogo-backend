import {
    subtopicPostFormatInstructions,
    subtopicPostParser, subtopicSkeletonFormatInstructions,
    SubtopicSkeletonParser,
    subtopicToneFormatInstructions,
    subtopicToneParser
} from "../lib/parsers";
import {
    buildSubtopicPostRewriteTemplate,
    buildSubtopicPostSkeletonPromptTemplate,
    buildSubtopicToneTemplate
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

export async function generateSkeletonTone(
    skeletonPost: string,
    pain: string,
    subtopic: string,
    contentPillar: string
) {
    const promptTemplate = await buildSubtopicToneTemplate(Object.keys({
        skeleton_post: skeletonPost,
        content_pillar: contentPillar,
        pain,
        subtopic
    }
    ));
    const promptText = await promptTemplate.format({
        skeleton_post: skeletonPost,
        content_pillar: contentPillar,
        pain,
        subtopic,
        format_instructions: subtopicToneFormatInstructions,
    });
    const parsed = await runWithRetry(
        () => lcOpenAI.invoke(promptText), // LLM call
        subtopicToneParser,               // Zod parser
        2                                  // maxRetries (optional) 
    );
    // console.log("Generated subtopic post:", parsed);
    return parsed;


}

export async function rewriteSubtopicPost(
    skeletonPost: string,
    contentPillar: string,
    pain: string,
    subtopic: string,
    tone: string

) {
    const promptTemplate = await buildSubtopicPostRewriteTemplate(Object.keys({
        skeleton_post: skeletonPost,
        content_pillar: contentPillar,
        subtopic,
        pain,
        tone
    }));
    const promptText = await promptTemplate.format({
        skeleton_post: skeletonPost,
        content_pillar: contentPillar,
        subtopic,
        pain,
        tone,
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

