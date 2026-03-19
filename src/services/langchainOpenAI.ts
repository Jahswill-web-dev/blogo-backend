import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

export const lcOpenAI = new ChatOpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
  model: "gpt-5.1",
  temperature: 1,
  maxTokens: 4096,
});

export const lcFineTuned = new ChatOpenAI({
  model: "ft:gpt-4.1-2025-04-14:hackrpost:hacker-post-v2:DKWIZmzy",
  temperature: 1,
  maxTokens: 1024,
});
