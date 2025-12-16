import { lcGemini } from "../services/langchainGemini";
import {
  buildPainCategoriesPromptTemplate,
  buildCategoriesPromptTemplate,
  buildQuestionTypesPromptTemplate
} from "../lib/promptFactory";
import {
  PainCategoriesParser,
  formatInstructions,
  questionTypesParser,
  QuestionTypesformatInstructions
} from "../lib/parsers";


// utility functions for pipelines
function cleanLLMJson(text: string): string {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, " ") // remove newlines inside strings
    .trim();
}



//Pain Category generation pipeline
export async function generatePainCategories(inputVars: Record<string, any>) {

  const promptTemplate = await buildPainCategoriesPromptTemplate(Object.keys(inputVars));
  const promptText = await promptTemplate.format({
    ...inputVars,
    format_instructions: formatInstructions,
  });
  const rawOutput = await lcGemini.invoke(promptText);
  const contentString =
    typeof rawOutput.content === "string"
      ? rawOutput.content
      : Array.isArray(rawOutput.content)
        ? rawOutput.content.map(b => (typeof b === "string" ? b : b.text)).join("\n")
        : "";
  const parsed = await PainCategoriesParser.parse(contentString);

  return {
    painCategories: parsed.category,
    items: parsed.items,
  };
}
//General Categories generation pipeline
export async function generateCategories(inputVars: Record<string, any>) {

  const promptTemplate = await buildCategoriesPromptTemplate(Object.keys(inputVars));
  const promptText = await promptTemplate.format({
    ...inputVars,
    format_instructions: formatInstructions,
  });
  const rawOutput = await lcGemini.invoke(promptText);
  const contentString =
    typeof rawOutput.content === "string"
      ? rawOutput.content
      : Array.isArray(rawOutput.content)
        ? rawOutput.content.map(b => (typeof b === "string" ? b : b.text)).join("\n")
        : "";
  const parsed = await PainCategoriesParser.parse(contentString);

  return {
    categories: parsed.category,
    items: parsed.items,
  };
}


//question types generation pipeline
export async function generateQuestionTypes(inputVars: Record<string, any>) {
  const promptTemplate = await buildQuestionTypesPromptTemplate(Object.keys(inputVars));
  const promptText = await promptTemplate.format({
    ...inputVars,
    format_instructions: QuestionTypesformatInstructions,
  });
  const rawOutput = await lcGemini.invoke(promptText);
  const contentString =
    typeof rawOutput.content === "string"
      ? rawOutput.content
      : Array.isArray(rawOutput.content)
        ? rawOutput.content.map(b => (typeof b === "string" ? b : b.text)).join("\n")
        : "";
  const cleaned = cleanLLMJson(contentString);
  const parsed = await questionTypesParser.parse(cleaned);

  return {
    items: parsed.items,
  };
}
//Last step store in DB