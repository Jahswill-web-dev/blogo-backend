import jwtAuth from "../../middleware/jwtAuth";
import { Router } from "express";
import { generateRandomSubtopicPost } from "../../services/domain/subtopicPosts.service";
import { generateMultipleSubtopicPosts } from "../../services/domain/multipleSubtopicPosts.service";
import { getSubtopicPostsByUser, getSubtopicPostById } from "../../repositories/subtopicPosts.repository";


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

router.get("/posts", jwtAuth, async (req, res) => {
    try {
        const userId = (req.user as any)._id;
        const { contentPillar, subtopic } = req.query as Record<string, string>;
        const posts = await getSubtopicPostsByUser(userId, { contentPillar, subtopic });
        res.json({ success: true, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

router.get("/posts/:id", jwtAuth, async (req, res) => {
    try {
        const post = await getSubtopicPostById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.json({ success: true, post });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Failed to fetch post" });
    }
});

export default router;

