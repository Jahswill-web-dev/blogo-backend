import { Router } from "express";
import { runGemini } from "../services/geminiClient";
import { prompts } from "../services/prompts";

const router = Router();

// POST /content/generate
router.post("/generate", async (req, res) => {
  try {
    const { mode, text, platform, target } = req.body;

    if (!mode || !text) {
      return res.status(400).json({ error: "mode and text are required" });
    }

    let prompt: string;
    if (mode === "platform_adaptation" && platform) {
      prompt = prompts.platform_adaptation(text, platform);
    } else if(mode === "audience_simulation" && target) {
        prompt = prompts.audience_simulation(text, target);
    }
    else {
      prompt = (prompts as any)[mode](text);
    }

    const output = await runGemini(prompt);
    res.json({ mode, output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

export default router;
