import express from "express";
import ContentPrompt from "../../models/ContentPrompt";
import jwtAuth from "../../middleware/jwtAuth";

const router = express.Router();

router.post("/", jwtAuth, async (req, res) => {
    try {
        const { contentType, mainGoal, topics, audienceTraits, toneStyle, batchId } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = (req.user as any)._id;

        const prompt = await ContentPrompt.create({
            userId,
            contentType,
            mainGoal,
            topics,
            audienceTraits,
            toneStyle,
            batchId,
        });

        res.json({ success: true, prompt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error saving content plan" });
    }
});

export default router;
