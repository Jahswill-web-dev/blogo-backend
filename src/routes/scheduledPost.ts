import { Router, Request, Response } from "express";
import jwtAuth from "../middleware/jwtAuth";
import agenda from "../services/agenda";
import ContentPost from "../models/ContentPost";
import { ObjectId, Types } from "mongoose";
const router = Router();

/**
 * Schedule a post to be published later
 */
router.post("/schedule-post", jwtAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { batchId, postId, platform, scheduledFor } = req.body;

    if (!batchId || !postId || !platform || !scheduledFor) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const scheduleTime = new Date(scheduledFor);
    if (isNaN(scheduleTime.getTime())) {
      return res.status(400).json({ error: "Invalid date format for scheduledFor" });
    }

    // Make sure post exists before scheduling
    const batch = await ContentPost.findOne({ userId, batchId });
    if (!batch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    const postExists = batch.posts.some((p: { _id: Types.ObjectId }) => p._id.toString() === postId.toString());
    if (!postExists) {
      return res.status(404).json({ error: "Post not found in this batch" });
    }

    // Schedule the job in Agenda
    await agenda.schedule(scheduleTime, "publish scheduled post", {
      userId,
      batchId,
      postId,
      platform,
    });

    res.json({
      success: true,
      message: `Post scheduled for ${scheduleTime.toISOString()}`,
    });
  } catch (err: any) {
    console.error("Schedule error:", err);
    res.status(500).json({ error: "Failed to schedule post" });
  }
});

export default router;
