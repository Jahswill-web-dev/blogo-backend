// src/pipeline/generateFinalPost.ts
import { PainSolutionPost } from "./painSolution.pipeline";
import { generatePipeline } from "../pipelines/howtoPipelines";

export async function generateEducationalPost(inputVars: Record<string, any>) {
  // 1. Generate initial structured post
  const initial = await PainSolutionPost(inputVars);
    // console.log("Initial Structured Post:", initial);
  // 2. Run through 6-pass pipeline
  const finalPostText = await generatePipeline(initial.category);
        console.log("Final Post Text:", finalPostText);
  // 3. Wrap for DB storage
  return {
    platform: initial,
    post: finalPostText,
  };
}
