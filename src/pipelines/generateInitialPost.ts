// src/pipeline/generateInitialPost.ts
import { lcGemini } from "../services/langchainGemini";
import { buildPainSolutionPromptTemplate } from "../lib/promptFactory";
import { painSolutionParser, PainSolutionformatInstructions } from "../lib/parsers";

export async function generateInitialPost(inputVars: Record<string, any>) {
  // Add format instructions for JSON output
  const promptTemplate = await buildPainSolutionPromptTemplate(Object.keys(inputVars));
  const promptText = await promptTemplate.format({
    ...inputVars,
    format_instructions: PainSolutionformatInstructions,
  });

  const rawOutput = await lcGemini.invoke(promptText);

  // Parse JSON output to { platform, post }
  const contentString =
  typeof rawOutput.content === "string"
    ? rawOutput.content
    : Array.isArray(rawOutput.content)
    ? rawOutput.content.map(b => (typeof b === "string" ? b : b.text)).join("\n")
    : "";
  const parsed = await painSolutionParser.parse(contentString);

  return parsed;
}
