// src/lib/educationalParser.ts
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PainSolutionSchema } from "../schemas/painSolution.schema";
import { PainCategoriesSchema } from "../schemas/painCategories.schema";
import { QuestionTypesSchema } from "../schemas/questionsTypes.schema";
import { SaasProfileSchema } from "../schemas/SaasProfile.schema";
import { contentStrategySchema } from "../schemas/subtopic.schema";
import { subtopicPostSchema, subtopicSkeletonSchema } from "../schemas/subtopicPost.schema";

export const painSolutionParser = StructuredOutputParser.fromZodSchema(PainSolutionSchema);
export const PainSolutionformatInstructions = painSolutionParser.getFormatInstructions();

export const PainCategoriesParser = StructuredOutputParser.fromZodSchema(PainCategoriesSchema);
export const PainCategoriesformatInstructions = PainCategoriesParser.getFormatInstructions();

export const questionTypesParser = StructuredOutputParser.fromZodSchema(QuestionTypesSchema);
export const QuestionTypesformatInstructions = questionTypesParser.getFormatInstructions();

export const saasProfileParser = StructuredOutputParser.fromZodSchema(SaasProfileSchema);
export const SaasProfileFormatInstructions = saasProfileParser.getFormatInstructions();

export const contentStrategyParser = StructuredOutputParser.fromZodSchema(contentStrategySchema);
export const ContentStrategyFormatInstructions = contentStrategyParser.getFormatInstructions();

export const subtopicPostParser = StructuredOutputParser.fromZodSchema(subtopicPostSchema);    
export const subtopicPostFormatInstructions = subtopicPostParser.getFormatInstructions();

export const SubtopicSkeletonParser = StructuredOutputParser.fromZodSchema(subtopicSkeletonSchema);
export const subtopicSkeletonFormatInstructions = SubtopicSkeletonParser.getFormatInstructions();