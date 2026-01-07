// import UserProfile, { IUserProfile } from "../../models/UserProfile";
import { SaasAIProfile } from "../../models/SaasAIProfile";
import UserProfile, { IUserProfile } from "../../models/UserProfile";


export async function getSaasContext(userId: string) {
  const originalProfile = await UserProfile.findOne({ userId }).lean<IUserProfile>();
  
  if (!originalProfile) {
    throw new Error("User SaaS profile not found");
  }

  return {
    saasName: originalProfile.saasName,
    productPromise: originalProfile.productPromise,
    productDescription: originalProfile.productDescription,
    target_audience: originalProfile.targetAudience,
    painPoints: originalProfile.painPoints,
    // benefits: profile.benefits?.join(", "),
    // tone: profile.tone ?? "neutral",
  };
}




export async function getAIimpovedSaasContext(userId: string) {
const profile = await SaasAIProfile.findOne({ userId }).lean();
if(!profile){
    throw new Error("User SaaS profile not found");
}
return {
    content: profile.content,
};
}
