import "dotenv/config";
import { howToParser } from "../lib/educationalParser";
import { buildEducationalPromptTemplate } from "../lib/promptFactory";
import { runGemini } from "../services/geminiClient";
import { platform } from "os";
async function testHowToPrompt() {
  const inputVars = {
    industry: "SaaS / Marketing Tech",
    product: "AI Content Engine for Startups",
    target_market: ["startup founders", "early-stage startups", "small startup teams"],
    pain_points: "inconsistent posting and lack of time to create content",
    content_goal: "help startups stay visible and build credibility",
    description: "generate and schedule weeks of startup-focused content automatically",
    tone: "friendly",
    creativity: "medium",
    platform: "X",
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
