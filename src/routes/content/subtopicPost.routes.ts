import jwtAuth from "../../middleware/jwtAuth";
import { Router } from "express";
import { generateRandomSubtopicPost } from "../../services/domain/subtopicPosts.service";
import { generateMultipleSubtopicPosts } from "../../services/domain/multipleSubtopicPosts.service";


const router = Router();

router.post("/generate-subtopic-post", jwtAuth, async (req, res) => {
    try {
        const userId = (req.user as any)._id;
        const { count = 3 } = req.body;

        const posts = await generateMultipleSubtopicPosts(userId, count);

        res.json({ success: true, posts });

    } catch (error) {
        console.error("Error generating posts:", error);
        res.status(500).json({ error: "Failed to generate post" });
    }
});

export default router;

