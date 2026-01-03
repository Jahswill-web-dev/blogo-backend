import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

export const lcOpenAI = new ChatOpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
  model: "gpt-5-mini",
  temperature: 0.3,
  maxTokens: 2048,
});
