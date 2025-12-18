import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

export const lcGemini = new ChatGoogleGenerativeAI({
  // apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.5-flash",
  maxOutputTokens: 2048,
  maxRetries: 2,
  temperature: 0.3,
});
