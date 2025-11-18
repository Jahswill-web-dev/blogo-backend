import { loadPrompt } from "./promptLoader";
import { PromptTemplate } from "@langchain/core/prompts";// import { PromptTemplate } from "langchain/prompts";
export async function buildEducationalPromptTemplate(subtype: string, inputVars: string[]) {
  const base = await loadPrompt("educational/basePrompt.txt");
  const subtypeTxt = await loadPrompt(`educational/subtypes/${subtype}.txt`);

  const template = `${base}\n\n${subtypeTxt}\n\nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;

  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}
