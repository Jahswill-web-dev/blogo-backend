// src/lib/educationalParser.ts
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PainSolutionSchema } from "../schemas/educational/painSolution.schema";
import { PainCategoriesSchema } from "../schemas/educational/painCategories.schema";
import { QuestionTypesSchema } from "../schemas/educational/questionsTypes.schema";
export const painSolutionParser = StructuredOutputParser.fromZodSchema(PainSolutionSchema);
export const PainCategoriesParser = StructuredOutputParser.fromZodSchema(PainCategoriesSchema);
export const formatInstructions = painSolutionParser.getFormatInstructions();
export const questionTypesParser = StructuredOutputParser.fromZodSchema(QuestionTypesSchema)