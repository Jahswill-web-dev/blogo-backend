import {
    generateGeneralCategories,
    generatePainCategories,
    generateQuestionTypes
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
