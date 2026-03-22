import { loadPrompt } from "./promptLoader";
import { PromptTemplate } from "@langchain/core/prompts";

// Pain categories prompt builder
export async function buildPainCategoriesPromptTemplate(inputVars: string[]) {
  const categoriesPrompt = await loadPrompt("/categories/painCategories.txt");
  const template = `${categoriesPrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}

export async function buildCategoriesPromptTemplate(inputVars: string[]) {
  const categoriesPrompt = await loadPrompt("/categories/categories.txt");
  const template = `${categoriesPrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}

export async function buildQuestionTypesPromptTemplate(inputVars: string[]) {
  const questionTypesPrompt = await loadPrompt("/questions-post/questionTypes.txt");
  const template = `${questionTypesPrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}

// SaaS Profile Prompt Template Builder
export async function buildSaasProfilePromptTemplate(inputVars: string[]) {
  const saasProfilePrompt = await loadPrompt("/saasProfile/base.txt");
  const template = `${saasProfilePrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}

// Subtopics Prompt Template Builder
export async function buildSubtopicsPromptTemplate(inputVars: string[]) {
  const subtopicsPrompt = await loadPrompt("/categories/subtopics.txt");
  const template = `${subtopicsPrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}

// Focus Areas Prompt Template Builder
export async function buildFocusAreasPromptTemplate(inputVars: string[]) {
  const prompt = await loadPrompt("/focus-areas/focusAreas.txt");
  const template = `${prompt}\nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}

// Build educational post prompt template (fine-tuned model — no JSON format instructions)
export async function buildEducationalPostTemplate(inputVars: string[]) {
  const educationPrompt = await loadPrompt("/educational-post/education.txt");
  return new PromptTemplate({
    template: educationPrompt,
    inputVariables: inputVars,
  });
}

// Phase 1 — pillars only (no subtopics)
export async function buildPillarsPromptTemplate(inputVars: string[]) {
  const prompt = await loadPrompt("/categories/pillars.txt");
  const template = `${prompt}\nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}

// Phase 2 — subtopics for a single pillar
export async function buildSinglePillarSubtopicsPromptTemplate(inputVars: string[]) {
  const prompt = await loadPrompt("/categories/subtopics.txt");
  const template = `${prompt}\nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}
