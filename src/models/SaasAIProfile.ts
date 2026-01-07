// models/SaasAIProfile.ts
import { Schema, model, models, Document } from "mongoose";


const SaasAIProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    content: { type: String, required: true },
//   saasName: String,
//   productDescription: String,
//   niche: String,
//   targetAudience: String,
//   audiencePainPoints: String,
}, { timestamps: true });

export const SaasAIProfile = model("SaasAIProfile", SaasAIProfileSchema);
