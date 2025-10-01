// src/routes/linkedinPost.ts
import { Router, Request, Response } from "express";
import jwtAuth from "../middleware/jwtAuth";
import { getValidLinkedInAccessToken } from "../services/linkedinTokenService";
import axios from "axios";
import { User } from "../models/User";

const router = Router();

router.post("/linkedin/post", jwtAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const user = await User.findById(userId);

    if (!user?.linkedinUrn) {
      return res.status(400).json({ error: "No LinkedIn profile URN stored" });
    }

    const accessToken = await getValidLinkedInAccessToken(userId);

    const postBody = {
      author: user.linkedinUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: req.body.text },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    const resp = await axios.post("https://api.linkedin.com/v2/ugcPosts", postBody, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "LinkedIn-Version": "202501", // adjust version
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
    });

    res.json(resp.data);
  } catch (err: any) {
    console.error("LinkedIn post error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to post on LinkedIn" });
  }
});

export default router;
