import { Router } from "express";
import { runGemini } from "../services/geminiClient";
import ContentIdea from "../models/ContentIdea";
import ContentPrompt from "../models/ContentPrompt";
import UserProfile from "../models/UserProfile"; // assuming you already created this
import generateIdeasPrompt from "../services/prompts/generateIdeasPrompt";
import { v4 as uuidv4 } from "uuid";
import jwtAuth from "../middleware/jwtAuth";

const router = Router();
// first get the type of user(founder or startup account)
// then get the type of content
// then prompt AI
router.post("/generate-ideas", jwtAuth, async (req, res) => {
    try {
        const user = req.user;
        const { contentType } = req.body;
        if (!contentType) {
            return res.status(400).json({ error: "contentType is required" });
        }

        // 1️⃣ Fetch user profile and content prompt details
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const userProfile = await UserProfile.findOne({ userId: (user as any)._id });
        if (!userProfile) return res.status(404).json({ error: "User profile not found" });

        const contentPrompt = await ContentPrompt.findOne({ type });
        if (!contentPrompt) return res.status(404).json({ error: "Prompt type not found" });

        // // 2️⃣ Choose which prompt function to use
        // if(voice === "founder"){}
        // else{}
        // let promptText: string;
        // if (contentType === "general") {
        //     promptText = generalIdeas(profile);
        // } else if (contentType === "story") {
        //     promptText = storyBasedIdeas(profile);
        // } else {
        //     return res.status(400).json({ error: "Invalid content type" });
        // }

        // // 3️⃣ Generate ideas using Gemini
        // const aiResponse = await runGemini(promptText);
        // const generatedIdeas = aiResponse.split("\n").filter(Boolean); // clean list

        // // 4️⃣ Save ideas to database
        // const newContentIdea = await ContentIdea.create({
        //     userId,
        //     promptId: contentPrompt._id,
        //     batchId: uuidv4(),
        //     ideas: generatedIdeas,
        //     generatedCount: generatedIdeas.length,
        //     totalCount: 30,
        // });

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
