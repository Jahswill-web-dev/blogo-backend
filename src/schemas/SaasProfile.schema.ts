import { z } from "zod";

export const SaasProfileSchema = z.object({
    content: z.string(),
    // saasName: z.string(),
    // productDescription: z.string(),
    // niche: z.string(),
    // targetAudience: z.string(),
    // audiencePainPoints: z.string(),
});

export type SaasProfile = z.infer<typeof SaasProfileSchema>;