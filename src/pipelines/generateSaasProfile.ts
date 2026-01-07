// src/pipelines/generateSaasProfile.ts
// import { lcGemini } from "../services/langchainGemini";
import { SaasProfileSchema } from "../schemas/SaasProfile.schema";
import { buildSaasProfilePromptTemplate } from "../lib/promptFactory";
import { SaasProfileFormatInstructions, saasProfileParser } from "../lib/parsers";
import { lcOpenAI } from "../services/langchainOpenai";
import { runWithRetry } from "../lib/retry";
import { storeAISaasProfile } from "../repositories/saasProfile.repository";


export async function generateSaasProfile(inputVars: Record<string, any>) {
    const promptTemplate = await buildSaasProfilePromptTemplate(
        Object.keys(inputVars)
    );
    // console.log("Prompt expects:", promptTemplate.inputVariables);
    // console.log("Provided:", Object.keys({
    //     ...inputVars,
    //     format_instructions: SaasProfileFormatInstructions,
    // }));
    const promptText = await promptTemplate.format({
        ...inputVars,
        format_instructions: SaasProfileFormatInstructions, // or structured instructions
    });
    const parsed = await runWithRetry(
        () => lcOpenAI.invoke(promptText), // LLM call
        saasProfileParser,               // Zod parser
        2                                  // maxRetries (optional)
    );
    console.log("Generated SaaS Profile:", parsed.content);
    await storeAISaasProfile({
        userId: inputVars.userId,
        content: parsed.content,
        // saasName: parsed.saasName,
        // productDescription: parsed.productDescription,
        // niche: parsed.niche,
        // targetAudience: parsed.targetAudience,
        // audiencePainPoints: parsed.audiencePainPoints,
    });
    return parsed;
}
