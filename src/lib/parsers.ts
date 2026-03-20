import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PainCategoriesSchema } from "../schemas/painCategories.schema";
import { QuestionTypesSchema } from "../schemas/questionsTypes.schema";
import { SaasProfileSchema } from "../schemas/SaasProfile.schema";
import { contentStrategySchema } from "../schemas/subtopic.schema";
import { FocusAreasSchema } from "../schemas/focusAreas.schema";

export const PainCategoriesParser = StructuredOutputParser.fromZodSchema(PainCategoriesSchema);
export const PainCategoriesformatInstructions = PainCategoriesParser.getFormatInstructions();

export const questionTypesParser = StructuredOutputParser.fromZodSchema(QuestionTypesSchema);
export const QuestionTypesformatInstructions = questionTypesParser.getFormatInstructions();

export const saasProfileParser = StructuredOutputParser.fromZodSchema(SaasProfileSchema);
export const SaasProfileFormatInstructions = saasProfileParser.getFormatInstructions();

export const contentStrategyParser = StructuredOutputParser.fromZodSchema(contentStrategySchema);
export const ContentStrategyFormatInstructions = contentStrategyParser.getFormatInstructions();

export const focusAreasParser = StructuredOutputParser.fromZodSchema(FocusAreasSchema);
export const FocusAreasFormatInstructions = focusAreasParser.getFormatInstructions();
