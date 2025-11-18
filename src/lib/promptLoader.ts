import fs from "fs/promises";
import path from "path";

const cache = new Map<string, string>();

export async function loadPrompt(relativePath: string) {
  if (cache.has(relativePath)) return cache.get(relativePath)!;
  const full = path.join(process.cwd(), "src", "prompts", relativePath);
  const content = await fs.readFile(full, "utf8");
  cache.set(relativePath, content);
  return content;
}
