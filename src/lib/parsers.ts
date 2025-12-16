// src/lib/educationalParser.ts
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PainSolutionSchema } from "../schemas/painSolution.schema";
import { PainCategoriesSchema } from "../schemas/painCategories.schema";
import { QuestionTypesSchema } from "../schemas/questionsTypes.schema";
export const painSolutionParser = StructuredOutputParser.fromZodSchema(PainSolutionSchema);
export const formatInstructions = painSolutionParser.getFormatInstructions();

export const PainCategoriesParser = StructuredOutputParser.fromZodSchema(PainCategoriesSchema);
export const PainCategoriesformatInstructions = PainCategoriesParser.getFormatInstructions();

export const questionTypesParser = StructuredOutputParser.fromZodSchema(QuestionTypesSchema);
export const QuestionTypesformatInstructions = questionTypesParser.getFormatInstructions();
