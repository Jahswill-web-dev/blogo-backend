// src/lib/educationalParser.ts
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { HowToSchema } from "../schemas/educational/howTo.schema";

export const howToParser = StructuredOutputParser.fromZodSchema(HowToSchema);
