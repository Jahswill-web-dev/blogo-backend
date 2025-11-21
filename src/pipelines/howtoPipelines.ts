import fs from "fs";
import path from "path";
import { PromptTemplate } from "@langchain/core/prompts";
import { lcGemini } from "../services/langchainGemini";

// Load prompt text safely
const read = (p: string) =>
  fs.readFileSync(path.join(process.cwd(), p), "utf8");

// Base prompts
const basePrompt = read("prompts/educational/basePrompt.txt");
const howToPrompt = read("prompts/educational/subtypes/base.txt");

// Pass templates
const pass1 = new PromptTemplate({
  template: read("prompts/educational/subtypes/howto/pass1.txt"),
  inputVariables: ["user_post"],
});

const pass2 = new PromptTemplate({
  template: read("prompts/educational/subtypes/howto/pass2.txt"),
  inputVariables: ["user_post", "critique"],
});

const pass3 = new PromptTemplate({
  template: read("prompts/educational/subtypes/howto/pass3.txt"),
  inputVariables: ["rewrite1"],
});

const pass4 = new PromptTemplate({
  template: read("prompts/educational/subtypes/howto/pass4.txt"),
  inputVariables: ["rewrite2", "critique"],
});

const pass5 = new PromptTemplate({
  template: read("prompts/educational/subtypes/howto/pass5.txt"),
  inputVariables: ["rewrite3", "critique"],
});

export async function generatePipeline(user_post, platform = "linkedin") {
  // PASS 1 — critique
  const p1prompt = await pass1.format({
    base_prompt: basePrompt,
    subtype_prompt: howToPrompt,
    user_post,
  });

  const p1 = await lcGemini.invoke(p1prompt);
  const critique = p1.text();

  // PASS 2 — rewrite using critique
  const p2prompt = await pass2.format({
    user_post,
    critique,
  });

  const p2 = await lcGemini.invoke(p2prompt);
  const rewrite1 = p2.text();

  // PASS 3 — refine structure
  const p3prompt = await pass3.format({ rewrite1 });
  const p3 = await lcGemini.invoke(p3prompt);
  const rewrite2 = p3.text();

  // PASS 4 — optimize for platform
  const p4prompt = await pass4.format({ rewrite2, platform });
  const p4 = await lcGemini.invoke(p4prompt);
  const rewrite3 = p4.text();

  // PASS 5 — final polish
  const p5prompt = await pass5.format({ rewrite3 });
  const p5 = await lcGemini.invoke(p5prompt);
  const finalPost = p5.text();

  return {
    critique,
    rewrite1,
    rewrite2,
    rewrite3,
    final: finalPost,
  };
}
