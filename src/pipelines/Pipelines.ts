import { lcGemini } from "../services/langchainGemini";
import {
  buildPainCategoriesPromptTemplate,
  buildCategoriesPromptTemplate,
  buildQuestionTypesPromptTemplate
} from "../lib/promptFactory";
import {
  PainCategoriesParser,
  PainSolutionformatInstructions,
  PainCategoriesformatInstructions,
  questionTypesParser,
  QuestionTypesformatInstructions
} from "../lib/parsers";



/**
 * Generic LLM pipeline runner with automatic retry for structured outputs.
 *
 * @param invokeFn - async function that returns raw LLM output (e.g., lcGemini.invoke)
 * @param parser - StructuredOutputParser to parse the cleaned JSON
 * @param maxRetries - number of retries if output is incomplete or parsing fails
 */

async function runWithRetry<T>(
  invokeFn: () => Promise<{ content: string | any[] }>,
  parser: { parse: (text: string) => Promise<T> },
  maxRetries = 2
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const rawOutput = await invokeFn();

      // Extract content string
      const contentString =
        typeof rawOutput.content === "string"
          ? rawOutput.content
          : Array.isArray(rawOutput.content)
            ? rawOutput.content
              .map((b) => (typeof b === "string" ? b : b.text))
              .join("\n")
            : "";

      // Clean JSON
      const cleaned = cleanLLMJson(contentString);

      // Check completion
      if (!isCompleteJsonObject(cleaned)) {
        throw new Error(`LLM output is incomplete or truncated.\nRaw Output:\n${contentString}`);
      }

      // Parse
      return await parser.parse(cleaned);
    } catch (err) {
      console.warn(
        `Attempt ${attempt + 1} failed: ${(err as Error).message}`
      );

      if (attempt === maxRetries) throw err;

      // wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }


  throw new Error("Unexpected failure in runWithRetry");
}

// utility functions for pipelines
function cleanLLMJson(text: string): string {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, " ") // remove newlines inside strings
    .trim();
}
function isCompleteJsonObject(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith("{") && trimmed.endsWith("}");
}


//Pain Category generation pipeline
export async function generatePainCategories(inputVars: Record<string, any>) {

  const promptTemplate = await buildPainCategoriesPromptTemplate(Object.keys(inputVars));
  const promptText = await promptTemplate.format({
    ...inputVars,
    format_instructions: PainCategoriesformatInstructions,
  });
  const parsed = await runWithRetry(
    () => lcGemini.invoke(promptText), // LLM call
    PainCategoriesParser,               // Zod parser
    2                                  // maxRetries (optional)
  );

  return {
    items: parsed.items,
  };
}
//General Categories generation pipeline
export async function generateCategories(inputVars: Record<string, any>) {

  const promptTemplate = await buildCategoriesPromptTemplate(Object.keys(inputVars));
  const promptText = await promptTemplate.format({
    ...inputVars,
    format_instructions: PainCategoriesformatInstructions,
  });

  const parsed = await runWithRetry(
    () => lcGemini.invoke(promptText),
    PainCategoriesParser
  );
  return {
    items: parsed.items,
  };
}


//question types generation pipeline
export async function generateQuestionTypes(inputVars: Record<string, any>) {
  const promptTemplate = await buildQuestionTypesPromptTemplate(Object.keys(inputVars));
  const promptText = await promptTemplate.format({
    ...inputVars,
    format_instructions: QuestionTypesformatInstructions,
  });
  const parsed = await runWithRetry(
    () => lcGemini.invoke(promptText), // LLM call
    questionTypesParser,               // Zod parser
    2                                  // maxRetries (optional)
  );

  return {
    items: parsed.items,
  };
}
//Last step store in DB