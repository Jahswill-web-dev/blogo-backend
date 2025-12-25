import UserProfile, { IUserProfile } from "../../models/UserProfile";

export async function getSaasContext(userId: string) {
  const profile = await UserProfile.findOne({ userId }).lean<IUserProfile>();

  if (!profile) {
    throw new Error("User SaaS profile not found");
  }

  return {
    industry: profile.industry,
    product: profile.companyName,
    description: profile.description,
    target_audience: profile.audience?.join(", "),
    pain_points: profile.painPoints?.join(", "),
    benefits: profile.benefits?.join(", "),
    tone: profile.tone ?? "neutral",
  };
}
