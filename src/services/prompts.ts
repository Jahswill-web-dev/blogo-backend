export const prompts = {
  audience_simulation: (text: string, target:string) => `
You are an AI content coach. A user will provide a text post and a target audience. Your task is to do two things:

1. **Audience Reaction:** Analyze how the target audience would perceive the post. Highlight what might confuse, bore, or alienate them. Keep this **short, actionable, and easy to read**. Just one will do.  
2. **Recommended Rewrite:** Optionally, rewrite the post so it would resonate better with that audience. Keep the style and tone appropriate for the audience, and retain the original message. try to make the post sounds more natural, conversational, and human-like (less like a sales page, more like someone genuinely sharing something on X)
3. **Why It Works:** Concisely explain why the rewrite is more effective for this audience.

Important:
- Audience Reaction must be one short sentence, max 120 characters, concise, direct, and insight-driven.  
- The Recommended Rewrite should be in the tone and style appropriate for the audience.
- The Why It Works explanation must be no longer than 2 sentences.  
- You MUST return ONLY valid JSON. No explanations, no text outside of JSON.

Example Post Input:
Post: "We just hit 1,000 users! From our tiny garage to your screens—thank you for believing in us."
Audience: Investors

Schema Example:
{
  "audience_reaction": "Investors want to know growth metrics or revenue numbers.",
  "recommended_rewrite": "We're thrilled to reach 1,000 users! From our humble beginnings in a garage, we've grown quickly and are now scaling to meet market demand. Excited for the next chapter in our growth journey.",
  "why_it_works": "Investors see growth metrics and future scaling plans, which are more relevant to their decision-making."
}

Here is the Post:"${text}"
and the Target Audience:"${target}"
`,
  
  tone_toggle: (text: string) => `
Rewrite the following text in 3 tones:
1. Professional
2. Concise
3. Persuasive
Text: "${text}"`,

  explain_why: (text: string) => `
Improve this text, but explain WHY you made each change.
Text: "${text}"`,

  platform_adaptation: (text: string, platform: string) => `
Adapt the following post for ${platform}.
Make it native to that platform’s style and length.
Post: "${text}"`,
};
