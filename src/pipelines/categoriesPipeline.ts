// import { lcGemini } from "../services/langchainGemini";
import {lcOpenAI} from "../services/langchainOpenAI";
import {
  buildPainCategoriesPromptTemplate,
  buildCategoriesPromptTemplate,
  buildQuestionTypesPromptTemplate,
  buildSubtopicsPromptTemplate,
  buildPillarsPromptTemplate,
  buildSinglePillarSubtopicsPromptTemplate,
} from "../lib/promptFactory";
import {
  PainCategoriesParser,
  PainCategoriesformatInstructions,
  questionTypesParser,
  QuestionTypesformatInstructions,
  ContentStrategyFormatInstructions,
  contentStrategyParser,
  pillarsOnlyParser,
  PillarsOnlyFormatInstructions,
  singlePillarSubtopicsParser,
  SinglePillarSubtopicsFormatInstructions,
} from "../lib/parsers";
import {
  storeCategories,
  storeSubtopics,
  storePillarsOnly,
  updatePillarSubtopics,
} from "../repositories/category.repository";
import { runWithRetry }  from "../lib/retry";
import { PillarItem } from "../schemas/subtopic.schema";


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
  const { userId, saasContext } = inputVars; 
  // console.log("saascontext:", saasContext) 
  if (!userId) {
    throw new Error("userId is required to Create and store categories");
  }
  const promptTemplate = await buildSubtopicsPromptTemplate(Object.keys(saasContext));
  const promptText = await promptTemplate.format({
    ...saasContext,
    format_instructions: ContentStrategyFormatInstructions,
  });
  const parsed = await runWithRetry(
    () => lcOpenAI.invoke(promptText), // LLM call
    contentStrategyParser,               // Zod parser
    2                                  // maxRetries (optional)
  );

  // store subtopics in DB
  await storeSubtopics({
    userId,
    parsedPillars: parsed.pillars,
  });
  // console.log("parsed subtopics:", parsed);
  return parsed;
}



// Phase 1 — generate 5 pillars only, store without subtopics
export async function generatePillarsOnly(inputVars: { userId: string; saasContext: Record<string, any> }) {
  const { userId, saasContext } = inputVars;
  if (!userId) {
    throw new Error("userId is required to generate pillars");
  }
  const promptTemplate = await buildPillarsPromptTemplate(Object.keys(saasContext));
  const promptText = await promptTemplate.format({
    ...saasContext,
    format_instructions: PillarsOnlyFormatInstructions,
  });
  const parsed = await runWithRetry(
    () => lcOpenAI.invoke(promptText),
    pillarsOnlyParser,
    2
  );
  await storePillarsOnly({ userId, pillars: parsed.pillars });
  return parsed.pillars; // PillarItem[]
}

// Phase 2 — generate 6 subtopics for ONE pillar, update that pillar's subtopics in DB
export async function generateSubtopicsForOnePillar(inputVars: {
  userId: string;
  pillarIndex: number;
  pillar: PillarItem;
  saasContext: Record<string, any>;
}) {
  const { userId, pillarIndex, pillar, saasContext } = inputVars;
  const vars = {
    pillarName:        pillar.contentPillar,
    pillarDescription: pillar.description,
    ...saasContext,
  };
  const promptTemplate = await buildSinglePillarSubtopicsPromptTemplate(Object.keys(vars));
  const promptText = await promptTemplate.format({
    ...vars,
    format_instructions: SinglePillarSubtopicsFormatInstructions,
  });
  const parsed = await runWithRetry(
    () => lcOpenAI.invoke(promptText),
    singlePillarSubtopicsParser,
    2
  );
  await updatePillarSubtopics({ userId, pillarIndex, subtopics: parsed.subtopics });
  return parsed.subtopics;
}

// Orchestrator — Phase 1 then Phase 2 × 5 (one pillar at a time)
export async function generateContentStrategy(inputVars: { userId: string; saasContext: Record<string, any> }) {
  const { userId, saasContext } = inputVars;
  if (!userId) {
    throw new Error("userId is required to generate content strategy");
  }

  // Phase 1: get pillars
  const pillars = await generatePillarsOnly({ userId, saasContext });

  // Phase 2: generate subtopics for each pillar sequentially
  const fullPillars = [];
  for (let i = 0; i < pillars.length; i++) {
    console.log(`Generating subtopics for pillar ${i + 1}/${pillars.length}: ${pillars[i].contentPillar}`);
    const subtopics = await generateSubtopicsForOnePillar({
      userId,
      pillarIndex: i,
      pillar: pillars[i],
      saasContext,
    });
    fullPillars.push({ ...pillars[i], subtopics });
  }

  return { pillars: fullPillars };
}

//Last step store in DB