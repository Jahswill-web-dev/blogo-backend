import "dotenv/config";
import { howToParser } from "../lib/educationalParser";
import { buildEducationalPromptTemplate } from "../lib/promptFactory";
import { runGemini } from "../services/geminiClient";
async function testHowToPrompt() {
  const inputVars = {
    industry: "PropTech",
    product: "AI Home Valuation Tool",
    target_market: "Real estate agents",
    pain_points: "slow manual pricing",
    content_goal: "educate agents",
    topic: "price properties faster",
    tone: "expert but friendly",
    creativity: "medium"
  };

  const promptTemplate = await buildEducationalPromptTemplate("howTo", Object.keys(inputVars));

  const promptText = await promptTemplate.format({
    ...inputVars,
    format_instructions: howToParser.getFormatInstructions()
  });

  const rawOutput = await runGemini(promptText);
  if (!rawOutput) {
    throw new Error("Gemini returned empty output");
  }
  const parsed = await howToParser.parse(rawOutput);

  if (parsed) {

    console.log("Parsed Output:", parsed);
  }
  // console.log(promptText);
}

testHowToPrompt();
