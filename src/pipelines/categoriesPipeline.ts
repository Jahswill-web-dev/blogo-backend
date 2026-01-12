// import { lcGemini } from "../services/langchainGemini";
import {lcOpenAI} from "../services/langchainOpenAI";
import {
  buildPainCategoriesPromptTemplate,
  buildCategoriesPromptTemplate,
  buildQuestionTypesPromptTemplate,
  buildSubtopicsPromptTemplate
} from "../lib/promptFactory";
import {
  PainCategoriesParser,
  PainSolutionformatInstructions,
  PainCategoriesformatInstructions,
  questionTypesParser,
  QuestionTypesformatInstructions,
  ContentStrategyFormatInstructions,
  contentStrategyParser
} from "../lib/parsers";
import { storeCategories } from "../repositories/category.repository";
import { runWithRetry }  from "../lib/retry";


/**
 * Generic LLM pipeline runner with automatic retry for structured outputs.
 *
 * @param invokeFn - async function that returns raw LLM output (e.g., lcGemini.invoke)
 * @param parser - StructuredOutputParser to parse the cleaned JSON
 * @param maxRetries - number of retries if output is incomplete or parsing fails
 */

//Pain Category generation pipeline
export async function generatePainCategories(inputVars: Record<string, any>) {

  const { userId, ...promptVars } = inputVars;
  if (!userId) {
    throw new Error("userId is required to Create and store categories");
  }
  const promptTemplate = await buildPainCategoriesPromptTemplate(Object.keys(promptVars));
  const promptText = await promptTemplate.format({
    ...promptVars,
    format_instructions: PainCategoriesformatInstructions,
  });
  const parsed = await runWithRetry(
    () => lcOpenAI.invoke(promptText), // LLM call
    PainCategoriesParser,               // Zod parser
    2                                  // maxRetries (optional)
  );
  await storeCategories({
    userId,
    type: "pain",
    items: parsed.items,
    meta: { promptVars },
  });

  return {
    items: parsed.items,
  };
}

//General Categories generation pipeline
export async function generateGeneralCategories(inputVars: Record<string, any>) {
  const { userId, ...promptVars } = inputVars;
  if (!userId) {
    throw new Error("userId is required to Create and store categories");
  }
  const promptTemplate = await buildCategoriesPromptTemplate(Object.keys(promptVars));
  const promptText = await promptTemplate.format({
    ...promptVars,
    format_instructions: PainCategoriesformatInstructions,
  });

  const parsed = await runWithRetry(
    () => lcOpenAI.invoke(promptText),
    PainCategoriesParser
  );
  await storeCategories({
    userId,
    type: "general",
    items: parsed.items,
    meta: { promptVars },
  });
  return {
    items: parsed.items,
  };
}


//question types generation pipeline
export async function generateQuestionTypes(inputVars: Record<string, any>) {
  const { userId, ...promptVars } = inputVars;
  if (!userId) {
    throw new Error("userId is required to Create and store categories");
  }
  const promptTemplate = await buildQuestionTypesPromptTemplate(Object.keys(promptVars));
  const promptText = await promptTemplate.format({
    ...promptVars,
    format_instructions: QuestionTypesformatInstructions,
  });
  
  const parsed = await runWithRetry(
    () => lcOpenAI.invoke(promptText), // LLM call
    questionTypesParser,               // Zod parser
    2                                  // maxRetries (optional)
  );
  await storeCategories({
    userId,
    type: "questions",
    items: parsed.items,
    meta: { promptVars },
  });
  return {
    items: parsed.items,
  };
}


//Subtopics generation pipeline
export async function generateSubtopics(inputVars: Record<string, any>) {
  const { userId, ...promptVars } = inputVars;  
  if (!userId) {
    throw new Error("userId is required to Create and store categories");
  }
  const promptTemplate = await buildSubtopicsPromptTemplate(Object.keys(promptVars));
  const promptText = await promptTemplate.format({
    ...promptVars,
    format_instructions: ContentStrategyFormatInstructions,
  });
  const parsed = await runWithRetry(
    () => lcOpenAI.invoke(promptText), // LLM call
    contentStrategyParser,               // Zod parser
    2                                  // maxRetries (optional)
  );
  //store subtopics in DB
  // await storeCategories({
  //   userId,
  //   type: "subtopics",
  //   items: parsed.items,
  //   meta: { promptVars },
  // });   

}



//Last step store in DB