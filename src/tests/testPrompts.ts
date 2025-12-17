// import "dotenv/config";
// import { howToParser } from "../lib/educationalParser";
// import { buildEducationalPromptTemplate } from "../lib/promptFactory";
// import { runGemini } from "../services/geminiClient";
// async function testHowToPrompt() {
//   const inputVars = {
//     industry: "SaaS / Marketing Tech",
//     product: "AI Content Engine for Startups",
//     target_market: ["startup founders", "early-stage startups", "small startup teams"],
//     pain_points: "inconsistent posting and lack of time to create content",
//     content_goal: "help startups stay visible and build credibility",
//     description: "generate and schedule weeks of startup-focused content automatically",
//     tone: "friendly",
//     creativity: "medium",
//     platform: "X",
//   };

//   const promptTemplate = await buildEducationalPromptTemplate("howTo", Object.keys(inputVars));

//   const promptText = await promptTemplate.format({
//     ...inputVars,
//     format_instructions: howToParser.getFormatInstructions()
//   });

//   const rawOutput = await runGemini(promptText);
//   if (!rawOutput) {
//     throw new Error("Gemini returned empty output");
//   }
//   const parsed = await howToParser.parse(rawOutput);

//   if (parsed) {

//     console.log("Parsed Output:", parsed);
//   }
//   // console.log(promptText);
// }

// testHowToPrompt();

import { generateCategories, generatePainCategories, generateQuestionTypes } from "../pipelines/Pipelines";
import { generateEducationalPost } from "../pipelines/generateFinalPost";
import { generateInitialPost } from "../pipelines/generateInitialPost";

async function run() {
  const inputVars = {
    industry: "SaaS / Marketing Tech",
    product: "AI Content Engine for Solo SaaS Builders/indie hackers",
    target_audience: "Solo saas founders, Solo founders, Indie hackers/devs",
    pain_points: "inconsistent posting, lack of time, not getting users",
    content_goal: "help Solo saas builders publish consistently",
    description: "A tool that generate and schedule X posts for indie hackers and solo builders",
    tone: "friendly",
    creativity: "medium",
    platform: "X",
      // industry: "DevTools / Monitoring",
      // product: "Real-Time Bug & Error Tracker",
      // target_audience: "software engineers, solo devs, CTOs, early engineering teams",
      // pain_points: "missed bugs, user frustration, lack of visibility into failures",
      // content_goal: "help teams catch issues before users do",
      // description: "automatically identifies, logs, and alerts teams about app errors",
      // tone: "technical but approachable",
      // creativity: "medium",
      // platform: "X"
  };
  // const result = await generateInitialPost(inputVars);
  // const result = await generatePainCategories(inputVars);
  const result = await generateCategories(inputVars);  
  // const result = await generateEducationalPost(inputVars);
    //  const result = await generateQuestionTypes(inputVars);

  console.log("POST JSON:", result);
}

run();
