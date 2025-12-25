// models/UserProfile.types.ts
export interface UserProfileDoc {
  userId: string;
  industry: string;
  companyName: string;
  description?: string;
  audience?: string[];
  painPoints?: string[];
  benefits?: string[];
  tone?: string;
}
