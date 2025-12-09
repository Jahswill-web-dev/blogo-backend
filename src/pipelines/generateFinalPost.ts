// src/pipeline/generateFinalPost.ts
import { generateInitialPost } from "./generateInitialPost";
import { generatePipeline } from "../pipelines/howtoPipelines";

export async function generateEducationalPost(inputVars: Record<string, any>) {
  // 1. Generate initial structured post
  const initial = await generateInitialPost(inputVars);
    // console.log("Initial Structured Post:", initial);
  // 2. Run through 6-pass pipeline
  const finalPostText = await generatePipeline(initial.post);
        console.log("Final Post Text:", finalPostText);
  // 3. Wrap for DB storage
  return {
    platform: initial.platform,
    post: finalPostText,
  };
}
