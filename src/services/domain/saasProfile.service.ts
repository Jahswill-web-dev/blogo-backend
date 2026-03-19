import UserProfile from "../../models/UserProfile";
import { generateSaasProfile } from "../../pipelines/generateSaasProfile";
import { SaasAIProfile } from "../../models/SaasAIProfile";

export async function createSaasAIProfile(userId: string) {
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) throw new Error("User profile not found");

    await generateSaasProfile({ // generates and stores AI profile
        userId,
        userNiche:          userProfile.userNiche,
        targetAudience:     userProfile.targetAudience,
        productName:        userProfile.productName,
        productDescription: userProfile.productDescription,
        productAudience:    userProfile.productAudience,
        productSolution:    userProfile.productSolution,
    });

    return SaasAIProfile.findOne({ userId });
}
