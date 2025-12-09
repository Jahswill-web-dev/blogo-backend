import fs from "fs";
import path from "path";
import { PromptTemplate } from "@langchain/core/prompts";
import { lcGemini } from "../services/langchainGemini";

// safe file reader
const read = (p: string) => fs.readFileSync(path.join(__dirname, "..", p), "utf8");
// ---- Load templates (ensure the prompt files contain the exact placeholders listed earlier) ----
const pass1 = new PromptTemplate({
  template: read("prompts/educational/subtypes/howto/pass1.txt"),
  inputVariables: ["user_post"],
});

const pass2 = new PromptTemplate({
  template: read("prompts/educational/subtypes/howto/pass2.txt"),
  inputVariables: ["user_post", "critique1"],
});

const pass3 = new PromptTemplate({
  template: read("prompts/educational/subtypes/howto/pass3.txt"),
  inputVariables: ["rewrite1"],
});

const pass4 = new PromptTemplate({
  template: read("prompts/educational/subtypes/howto/pass4.txt"),
  inputVariables: ["rewrite1", "critique2"],
});

const pass5 = new PromptTemplate({
  template: read("prompts/educational/subtypes/howto/pass5.txt"),
  inputVariables: ["rewrite2"],
});

const pass6 = new PromptTemplate({
  template: read("prompts/educational/subtypes/howto/pass6.txt"),
  inputVariables: ["rewrite2", "critique3"],
});

// ---- Pipeline ----
export async function generatePipeline(user_post: string, platform = "linkedin") {
  // PASS 1 — critique original post
  const p1prompt = await pass1.format({ user_post });
  const p1 = await lcGemini.invoke(p1prompt);
  const critique1 = p1.text;

  // PASS 2 — rewrite using critique1
  const p2prompt = await pass2.format({ user_post, critique1 });
  const p2 = await lcGemini.invoke(p2prompt);
  const rewrite1 = p2.text;

  // PASS 3 — critique rewrite1
  const p3prompt = await pass3.format({ rewrite1 });
  const p3 = await lcGemini.invoke(p3prompt);
  const critique2 = p3.text;

  // PASS 4 — rewrite using critique2 (platform-aware)
  const p4prompt = await pass4.format({ rewrite1, critique2 });
  const p4 = await lcGemini.invoke(p4prompt);
  const rewrite2 = p4.text;

  // PASS 5 — critique rewrite2 (human/emotional)
  const p5prompt = await pass5.format({ rewrite2 });
  const p5 = await lcGemini.invoke(p5prompt);
  const critique3 = p5.text;

  // PASS 6 — final rewrite using critique3
  const p6prompt = await pass6.format({ rewrite2, critique3 });
  const p6 = await lcGemini.invoke(p6prompt);
  const rewrite3 = p6.text;

  return {
    critique1,
    rewrite1,
    critique2,
    rewrite2,
    critique3,
    final: rewrite3,
  };
}
