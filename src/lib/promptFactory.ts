import { loadPrompt } from "./promptLoader";
import { PromptTemplate } from "@langchain/core/prompts";// import { PromptTemplate } from "langchain/prompts";
export async function buildPainSolutionPromptTemplate(inputVars: string[]) {
  const base = await loadPrompt("educational/basePrompt.txt");
  const problemawareness = await loadPrompt("/problem-awareness-post/base.txt");
  const painSolutionPost = await loadPrompt("/pain-solution-post/base.txt");
  const painCategories = await loadPrompt("/pain-solution-post/painCategories.txt");
  const template = `${painCategories} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;

  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}
