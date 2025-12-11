// src/lib/educationalParser.ts
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PainSolutionSchema } from "../schemas/educational/painSolution.schema";

export const painSolutionParser = StructuredOutputParser.fromZodSchema(PainSolutionSchema);
export const formatInstructions = painSolutionParser.getFormatInstructions();