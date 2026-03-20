import { buildFocusAreasPromptTemplate } from "../lib/promptFactory";
import { focusAreasParser, FocusAreasFormatInstructions } from "../lib/parsers";
import { lcOpenAI } from "../services/langchainOpenAI";
import { runWithRetry } from "../lib/retry";

export async function suggestFocusAreas(niche: string, audience: string) {
  const promptTemplate = await buildFocusAreasPromptTemplate(["niche", "audience"]);
  const promptText = await promptTemplate.format({
    niche,
    audience,
    format_instructions: FocusAreasFormatInstructions,
  });

  const parsed = await runWithRetry(() => lcOpenAI.invoke(promptText), focusAreasParser, 2);

  // trim whitespace, remove duplicates, limit to 8
  const focusAreas = [...new Set(parsed.focusAreas.map((s) => s.trim()))].slice(0, 8);
  return { focusAreas };
}
