// src/pipeline/generateInitialPost.ts
import { lcGemini } from "../services/langchainGemini";
import { fetchUserCategories } from "../services/domain/category.service";
import { buildPainSolutionPromptTemplate } from "../lib/promptFactory";
import { painSolutionParser, PainSolutionformatInstructions } from "../lib/parsers";
import { selectRandomItem } from "../utils/selectRandomItem";

export async function PainSolutionPost(inputVars: Record<string, any>) {
  const painCategories = await fetchUserCategories({
    userId: inputVars.userId,
    type: "pain",
  });
  const selectedPain = selectRandomItem(painCategories);
  // Add format instructions for JSON output
  const promptTemplate = await buildPainSolutionPromptTemplate(Object.keys(inputVars));
  const promptText = await promptTemplate.format({
    ...inputVars,
    selected_pain: selectedPain,
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
