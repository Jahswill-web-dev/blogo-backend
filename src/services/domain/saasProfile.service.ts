import UserProfile from "../../models/UserProfile";
import { generateSaasProfile } from "../../pipelines/generateSaasProfile";
import { SaasAIProfile } from "../../models/SaasAIProfile";

export async function createSaasAIProfile(userId: string) {
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) throw new Error("User profile not found");

    const aiProfile = await generateSaasProfile({ //generates and stores AI saas profile
        userId,
        saasName: userProfile.SaasName,
        productDescription: userProfile.productDescription,
        productPromise: userProfile.productPromise,
        targetAudience: userProfile.targetAudience,
        audiencePainPoints: userProfile.audiencePainPoints
    });
    return SaasAIProfile.findOne({ userId });
}