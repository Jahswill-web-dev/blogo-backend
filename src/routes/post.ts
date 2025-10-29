import { Router } from "express";
import jwtAuth from "../middleware/jwtAuth";

const router = Router();

router.post("/post-now", jwtAuth, async (req, res) => {
  try {
    const { postId, platform } = req.body;
    const user = req.user;

    const result = await publishToPlatform(user, platform, postText);

    res.json({ message: "Post published successfully", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to publish post" });
  }
});