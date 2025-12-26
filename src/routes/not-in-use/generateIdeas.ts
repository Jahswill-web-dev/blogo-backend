import { Router } from "express";
import { runGemini } from "../../services/geminiClient";
import ContentIdea from "../../models/ContentIdeas";
import ContentPrompt from "../../models/ContentPrompt";
import UserProfile from "../../models/UserProfile";
import { generateIdeasPrompt } from "../../services/prompts/generateIdeas";
import crypto from "crypto";
import jwtAuth from "../../middleware/jwtAuth";

const router = Router();
// first get the type of user(founder or startup account)
// then get the type of content
// then prompt AI
router.post("/generate-ideas", jwtAuth, async (req, res) => {
    try {
        const user = req.user;
        const { contentType, voice, platform } = req.body;
        if (!voice || !contentType) {
            return res.status(400).json({
                error: "Both 'voice' and 'contentType' are required.",
            });
        }

        // 1️⃣ Fetch user profile and content prompt details
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const userProfile = await UserProfile.findOne({ userId: (user as any)._id });
        if (!userProfile) return res.status(404).json({ error: "User profile not found" });

        // Fetch Content prompt details for better context (if needed)
        // const contentPrompt = await ContentPrompt.findOne({ type });
        // if (!contentPrompt) return res.status(404).json({ error: "Prompt type not found" });

        const promptData = {
            startup_name: userProfile.companyName,
            industry: userProfile.industry,
            description: userProfile.description,
            // product_overview: userProfile.productOverview,
            audience: userProfile.audience.join(", "),
            platform: platform,
        };


        // 2️⃣ Choose which prompt function to use
        let promptText = "";

        if (voice === "founder") {
            if (contentType === "conceptual") {
                promptText = generateIdeasPrompt.generalIdeas(promptData);
            } else if (contentType === "personal") {
                promptText = generateIdeasPrompt.storyBasedideas(promptData);
            } else {
                return res.status(400).json({ error: "Invalid contentType" });
            }
        } else if (voice === "startup") {
            if (contentType === "conceptual") {
                promptText = generateIdeasPrompt.startupgeneralIdeas(promptData);
            } else if (contentType === "personal") {
                promptText = generateIdeasPrompt.startupstoryBasedIdeas(promptData);
            } else {
                return res.status(400).json({ error: "Invalid contentType" });
            }
        } else {
            return res.status(400).json({ error: "Invalid voice type" });
        }


        // 3️⃣ Generate ideas using Gemini
        const aiResponse = await runGemini(promptText);
        if (!aiResponse) {
            return res.status(500).json({ error: "AI generation failed" });
        }
        console.log("AI Response:", aiResponse);
        let generatedIdeas: string[] = [];
        try {
            // parse it as JSON first
            const parsed = JSON.parse(aiResponse);
            if (Array.isArray(parsed)) {
                generatedIdeas = parsed;
            } else {
                throw new Error("Not an array");
            }
        } catch {
            // Fallback: handle as text if it's not valid JSON
            generatedIdeas = aiResponse
                .split("\n")
                .map((line) => line.trim().replace(/^"|"$/g, ""))
                .filter(Boolean);
        }


        // if (typeof generatedIdeas === "string") {
        //     try {
        //         generatedIdeas = JSON.parse(generatedIdeas);
        //     } catch {
        //         generatedIdeas = generatedIdeas
        //             .replace(/^\[|\]$/g, "") // remove outer brackets
        //             .split("\n")
        //             .map((i: string) => i.trim().replace(/^"|"$/g, "")) // clean quotes
        //             .filter(Boolean);
        //     }
        // } else if (Array.isArray(generatedIdeas)) {
        //     // It’s already an array, so let’s make sure each element is a clean string
        //     generatedIdeas = generatedIdeas.map((i: string) =>
        //         i.trim().replace(/^"|"$/g, "")
        //     );
        // }
        // console.log("Parsed Ideas:", generatedIdeas);

        // 4️⃣ Save ideas to database

        const newContentIdea = await ContentIdea.create({
            userId: (user as any)._id,
            // promptId: ContentPrompt.batchId,
            batchId: crypto.randomUUID(),
            ideas: generatedIdeas,
            generatedCount: generatedIdeas.length,
            totalCount: 5,
        });

        res.json({
            message: "Ideas generated successfully",
            ideas: generatedIdeas,
            record: newContentIdea,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate content ideas" });
    }
});

export default router;
