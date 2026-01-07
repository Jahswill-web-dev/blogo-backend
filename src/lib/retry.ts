export async function runWithRetry<T>(
  invokeFn: () => Promise<{ content: string | any[] }>,
  parser: { parse: (text: string) => Promise<T> },
  maxRetries = 2
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const rawOutput = await invokeFn();

      // Extract content string
      const contentString =
        typeof rawOutput.content === "string"
          ? rawOutput.content
          : Array.isArray(rawOutput.content)
            ? rawOutput.content
              .map((b) => (typeof b === "string" ? b : b.text))
              .join("\n")
            : "";

      // Clean JSON
      const cleaned = cleanLLMJson(contentString);

      // Check completion
      if (!isCompleteJsonObject(cleaned)) {
        throw new Error(`LLM output is incomplete or truncated.\nRaw Output:\n${contentString}`);
      }

      // Parse
      return await parser.parse(cleaned);
    } catch (err) {
      console.warn(
        `Attempt ${attempt + 1} failed: ${(err as Error).message}`
      );

      if (attempt === maxRetries) throw err;

      // wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }


  throw new Error("Unexpected failure in runWithRetry");
}

// utility functions for pipelines
function cleanLLMJson(text: string): string {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, " ") // remove newlines inside strings
    .trim();
}
function isCompleteJsonObject(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith("{") && trimmed.endsWith("}");
}