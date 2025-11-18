import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runGemini = async (prompt: string) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      attempts++;

      // only retry on overload (503)
      if (err.status === 503 && attempts < maxAttempts) {
        const wait = 300 * attempts; // exponential backoff
        console.log(`⚠️ Gemini overloaded. Retrying in ${wait}ms...`);
        await new Promise(res => setTimeout(res, wait));
        continue;
      }

      // other errors → throw immediately
      throw err;
    }
  }
};
