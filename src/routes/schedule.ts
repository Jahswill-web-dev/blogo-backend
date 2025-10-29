import ContentSchedule from "../models/ContentSchedule";
import ContentPost from "../models/ContentPost";

import { Router } from "express";
import jwtAuth from "../middleware/jwtAuth";
const router = Router();




router.post("/schedule", jwtAuth, async (req, res) => {
    try {
        const user = req.user;
        const { postId, platform, scheduledFor } = req.body;

        if (!postId || !platform || !scheduledFor) {
            return res.status(400).json({ error: "postId, platform, and scheduledFor are required" });
        }

        
        const contentPost = await ContentPost.findById(postId);
        if (!contentPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        
        const postText = contentPost.posts[0].postText; 

        //  Save the schedule
        const schedule = await ContentSchedule.create({
            userId: (user as any)._id,
            platform,
            postText,
            scheduledFor: new Date(scheduledFor),
            status: "scheduled",
        });

        res.json({ message: "Post scheduled successfully", schedule });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to schedule post" });
    }
});