import { SaasAIProfile } from "../models/SaasAIProfile";

export async function storeAISaasProfile({
    userId,
    // saasName,
    // productDescription,
    // niche,
    // targetAudience,
    // audiencePainPoints,
    content,
    meta, }: {
        userId: string;
        // saasName: string;
        // productDescription: string;
        // niche: string;
        // targetAudience: string;
        // audiencePainPoints: string;
        content: string;
        meta?: Record<string, any>;
    }) {
    if (!userId) {
        throw new Error("storeAISaasProfile: userId is required");
    }
    return SaasAIProfile.create({
        userId,
        // saasName,
        // productDescription,
        // niche,
        // targetAudience,
        // audiencePainPoints,
        content,
        meta,
    });
}



export async function getAISaasProfileByUser(
    userId: string,
) {
    return SaasAIProfile.findOne({ userId }).lean();
}