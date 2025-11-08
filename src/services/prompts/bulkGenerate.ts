// routes/bulkGenerate.ts
import { Router, Request, Response } from "express";
import crypto from "crypto";
import ContentPost from "../../models/ContentPost";
import jwtAuth from "../../middleware/jwtAuth";
import { runGemini } from "../../services/geminiClient";
import { bulkPrompts } from "./bulkPrompts";
import UserProfile from "../../models/UserProfile";

const router = Router();

router.post("/bulk-generate", jwtAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { platform } = req.body;
    const batchId = crypto.randomUUID();

    // 1️⃣ Fetch user profile
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Build prompt data object
    const promptData = {
      startup_name: userProfile.companyName,
      industry: userProfile.industry,
      description: userProfile.description,
      audience: userProfile.audience?.join(", ") || "",
      platform,
      tone: userProfile.tone || "friendly",
      product_description: userProfile.description || "",
      pain_points: userProfile.painPoints?.join(", ") || "",
      benefits: userProfile.benefits?.join(", ") || "",
    };

    // 2️⃣ Storage for all categories
    const allResults: Record<string, any[]> = {};

    // 3️⃣ Loop through each category
    for (const [category, promptFn] of Object.entries(bulkPrompts)) {
      const generatedPosts: { content: string }[] = [];
       const promptsArray = promptFn(promptData);
      for (const promptText of promptsArray) {
        try {
          
          const output = await runGemini(promptText);
          if (!output) continue;

          // Parse AI output safely
          let posts: { content: string }[] = [];
          try {
            const parsed = JSON.parse(output);
            if (Array.isArray(parsed.posts)) {
              posts = parsed.posts;
            } else if (Array.isArray(parsed)) {
              posts = parsed.map((p) => ({ content: p }));
            } else if (typeof parsed === "string") {
              posts = [{ content: parsed }];
            }
          } catch {
            // fallback if output isn't JSON
            posts = [{ content: output }];
          }

          generatedPosts.push(...posts);
        } catch (err) {
          console.error(`❌ Error generating posts for category "${category}":`, err);
        }
      }

      // 4️⃣ Save generated posts to DB
      if (generatedPosts.length > 0) {
        await ContentPost.create({
          userId,
          batchId,
          platform,
          category,
          posts: generatedPosts,
          generatedCount: generatedPosts.length,
        });
      }

      allResults[category] = generatedPosts;
    }

    // 5️⃣ Return all results
    res.status(200).json({
      success: true,
      batchId,
      data: allResults,
    });
  } catch (err) {
    console.error("❌ Bulk generation error:", err);
    res.status(500).json({ error: "Failed to generate bulk content" });
  }
});

export default router;
