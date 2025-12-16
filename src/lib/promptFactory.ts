import { loadPrompt } from "./promptLoader";
import { PromptTemplate } from "@langchain/core/prompts";
// import { PromptTemplate } from "langchain/prompts";

// Pain-Solution Prompt Template Builder
export async function buildPainSolutionPromptTemplate(inputVars: string[]) {
  const base = await loadPrompt("educational/basePrompt.txt");
  const problemawareness = await loadPrompt("/problem-awareness-post/base.txt");
  const painSolutionPost = await loadPrompt("/pain-solution-post/base.txt");
  const painCategories = await loadPrompt("/categories/painCategories.txt");
  const template = `${painCategories} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;

  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}

//Pain categories prompt builder
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