import UserProfile, { IUserProfile } from "../../models/UserProfile";


export async function getSaasContext(userId: string) {
  const originalProfile = await UserProfile.findOne({ userId }).lean<IUserProfile>();

  if (!originalProfile) {
    throw new Error("User SaaS profile not found");
  }

  return {
    userNiche:          originalProfile.userNiche,
    targetAudience:     originalProfile.targetAudience,
    productName:        originalProfile.productName,
    productDescription: originalProfile.productDescription,
    // key kept as target_audience — category/subtopic prompt templates depend on this name
    target_audience:    originalProfile.productAudience,
    productSolution:    originalProfile.productSolution,
    focusArea:          originalProfile.focusArea,
  };
}


