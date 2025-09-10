export const prompts = {
  audience_simulation: (text: string, target:string) => `
Act as the target audience which are ${target} reading this post.
Post: "${text}"
Give feedback on how this audience might react. 
Provide 3 points: (1) Concerns, (2) Tone/style suggestions, (3) Summary reaction.`,
  
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
