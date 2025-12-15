import { lcGemini } from "../services/langchainGemini";
import { buildPainCategoriesPromptTemplate, buildCategoriesPromptTemplate } from "../lib/promptFactory";
import { PainCategoriesParser, formatInstructions } from "../lib/parsers";

//Category generation pipeline
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


