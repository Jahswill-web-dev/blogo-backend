export const CATEGORY_TYPES = {
  PAIN: "pain",
  GENERAL: "general",
  QUESTIONS: "questions",
  HOOKS: "hooks",
} as const;

export type KnownCategoryType =
  typeof CATEGORY_TYPES[keyof typeof CATEGORY_TYPES];
