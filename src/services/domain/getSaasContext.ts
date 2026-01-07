// import UserProfile, { IUserProfile } from "../../models/UserProfile";
import { SaasAIProfile } from "../../models/SaasAIProfile";
export async function getSaasContext(userId: string) {
  const profile = await SaasAIProfile.findOne({ userId }).lean();

  
  if (!profile) {
    throw new Error("User SaaS profile not found");
  }

  return {
    saasName: profile.saasName,
    niche: profile.niche,
    description: profile.productDescription,
    target_audience: profile.targetAudience,
    pain_points: profile.audiencePainPoints,
    // benefits: profile.benefits?.join(", "),
    // tone: profile.tone ?? "neutral",
  };
}
