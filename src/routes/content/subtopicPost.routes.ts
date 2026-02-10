import jwtAuth from "../../middleware/jwtAuth";
import { Router } from "express";
import { generateFinalSubtopicPost } from "../../services/domain/subtopicPosts.service";


const router = Router();

router.post("/generate-subtopic-post", jwtAuth, async (req, res) => {
    try {
        const userId = (req.user as any)._id;
        // console.log("Generating subtopic post for user:", userId);
        const subtopicPost = generateFinalSubtopicPost(userId);
        
        res.json({ success: true, post: subtopicPost });
    } catch (error) {
        console.error("Error generating subtopic post:", error);
        res.status(500).json({ error: "Failed to generate subtopic post" });
    }
});
export default router;

