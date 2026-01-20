import {
    generateGeneralCategories,
    generatePainCategories,
    generateQuestionTypes,
    generateSubtopics
} from "../../pipelines/categoriesPipeline";

export async function generateCategories({
    userId,
    saasContext,
}: {
    userId: string;
    saasContext: Record<string, any>;
}) {
    const inputVars = {
        ...saasContext,
        userId,

    };
    const pain = await generatePainCategories(inputVars);
    const general = await generateGeneralCategories(inputVars);
    const questions = await generateQuestionTypes(inputVars);
    return {
        pain,
        general,
        questions,
    };

}
export async function generateSubtopicsForUser({
    userId,
    saasContext,
}: {
    userId: string;
    saasContext: Record<string, any>;
}) {
    const inputVars = {
        saasContext,
        userId,
    };
    const subtopics = await generateSubtopics(inputVars);
    console.log("Generated subtopics:", subtopics);
    return subtopics;
}   