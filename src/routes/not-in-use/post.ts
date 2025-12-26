import { Router, Request, Response } from "express";
import jwtAuth from "../../middleware/jwtAuth";
import ContentPost from "../../models/ContentPost";
import { publishToSocial } from "../../services/socialPublisher";
import { Types } from "mongoose";

const router = Router();

/**
 * Immediately publish a selected post from the database
 */
router.post("/post", jwtAuth, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const { postId, batchId, platform } = req.body;

        if (!postId || !batchId || !platform) {
            return res.status(400).json({ error: "Missing required fields: postId, batchId, platform" });
        }

        // Find the batch document that contains the post
        const batch = await ContentPost.findOne({ userId, batchId });
        if (!batch) {
            return res.status(404).json({ error: "Batch not found" });
        }

        // Find the specific post by its _id inside the posts array
        const selectedPost = batch.posts.find(
            (p: { _id: Types.ObjectId }) => p._id.toString() === postId.toString()
        );

        if (!selectedPost) {
            return res.status(404).json({ error: "Post not found in this batch" });
        }

        // Get the post text and publish to the chosen platform
        const result = await publishToSocial(userId, platform, selectedPost.postText);

        // You could log or update database here (optional)
        // e.g. mark as published
        // await ContentPost.updateOne(
        //   { _id: batch._id, "posts._id": postId },
        //   { $set: { "posts.$.publishedAt": new Date() } }
        // );

        res.json({ success: true, platform, postId, result });
    } catch (err: any) {
        console.error("Post-now error:", err);
        res.status(500).json({ error: "Failed to publish post" });
    }
});

export default router;
