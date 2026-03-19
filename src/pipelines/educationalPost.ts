import { buildEducationalPostTemplate } from "../lib/promptFactory";
import { lcFineTuned } from "../services/langchainOpenAI";


// Single-step educational post generation using the fine-tuned model
export async function generateEducationalPost({
    contentPillar,
    subtopic,
    angle,
    goal,
}: {
    contentPillar: string;
    subtopic: string;
    angle: string;
    goal: string;
}) {
    const promptTemplate = await buildEducationalPostTemplate(
        ["content_pillar", "subtopic", "angle", "goal"]
    );
    const promptText = await promptTemplate.format({
        content_pillar: contentPillar,
        subtopic,
        angle,
        goal,
    });

    const result = await lcFineTuned.invoke(promptText);
    const post = typeof result.content === "string"
        ? result.content.trim()
        : String(result.content);

    return { post };
}
