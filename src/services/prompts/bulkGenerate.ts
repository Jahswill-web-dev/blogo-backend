export interface PostIdea {
  title_hook: string;
  topic: string;
}

export interface BulkGeneratePromptInput {
  startup_name: string;
  industry: string;
  description: string;
  // product_overview: string;
  audience: string;
  platform: string;
  voice: "Founder" | "Startup Account";
  ideas: PostIdea[];
}


export const bulkGeneratePrompt = {
  developPosts: (input: BulkGeneratePromptInput) => {
    const { startup_name, industry, description, audience, platform, voice, ideas } = input
    const ideasJson = JSON.stringify(ideas, null, 2);
    return `You are an experienced Content Strategist and Social Media Copywriter who creates engaging, platform-tailored posts for startups.
Your task: Using the provided startup information and list of post ideas, develop a full, ready-to-publish post for each idea. Each post must match the platform’s tone, style, and audience. The posts should reflect the voice of the founder or the startup account (as specified) and be actionable, informative, and engaging.

---

INPUT INFORMATION

Startup Name: ${startup_name}
Industry / Sector: ${industry}
Description: ${description}
Audience: ${audience}
Platform Preference: ${platform}
Voice: ${voice} // "Founder" or "Startup Account"

Post Ideas: ${ideasJson}

---

INSTRUCTIONS:
1. Analyze the startup’s focus, industry, audience, and tone before writing.
2. Treat each idea independently — as if you were crafting a standalone post from scratch.
3. Maintain consistent tone, structure, and quality across all posts.
4. Adjust tone, length, and style according to the platform:
   - **LinkedIn** → professional storytelling (150–200 words), 1–2 short paragraphs, optional bullets, 1 relevant hashtag.
   - **X (Twitter)** → concise, bold (<280 characters), may include emojis or 1–2 hashtags.
   - **Blog** → detailed, educational (400–800 words), structured with headings/subheadings if applicable.
5. Ensure every post:
   - Is highly relevant to the startup’s product, audience, and mission.
   - Aligns with the provided topic or title_hook.
   - Provides value or insight — educate, inspire, or inform.
   - Uses curiosity, emotion, or authority to make the hook engaging.
   - Optionally ends with a short CTA or engagement prompt.
6. Do not merge or blend ideas — each must stand on its own.
7. Output strictly in valid JSON format, with no explanations, commentary, or text outside the JSON. Do not include markdown formatting or backticks.

{
  "posts": [
    { "content": "" },
    { "content": "" }
  ]
}
---

QUALITY CONTROL GUIDELINES:
- Treat each idea with equal creative effort and attention to detail.
- Maintain consistent tone and structure across all posts.
- Prioritize clarity, originality, and alignment with the startup’s brand.
- Ensure each post meets the appropriate length and engagement style for its platform.
- If multiple posts are generated, review them internally to confirm they meet professional quality standards before final output.

---

GOAL:
Produce 5–10 polished, platform-optimized posts — each one unique, relevant, and ready to publish — ensuring consistent quality, brand alignment, and audience engagement across all outputs.`


  }
} 