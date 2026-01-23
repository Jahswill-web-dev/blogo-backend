import jwtAuth from "../../middleware/jwtAuth";
import { Router } from "express";
import { generateFinalSubtopicPost } from "../../pipelines/educationalPost";


const router = Router();

router.post("/generate-subtopic-post", jwtAuth, async (req, res) => {
    try {
        const userId = (req.user as any)._id;
        const subtopicPost = generateFinalSubtopicPost(userId);
        res.json({ success: true, post: null });
    } catch (error) {
        console.error("Error generating subtopic post:", error);
        res.status(500).json({ error: "Failed to generate subtopic post" });
    }
});
export default router;

