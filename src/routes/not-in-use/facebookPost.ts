// routes/facebookPost.ts

import { Router, Request, Response } from "express";
import jwtAuth from "../../middleware/jwtAuth";
import axios from "axios";
import { User } from "../../models/User";
import { decryptToken } from "../../services/tokendecrypt";

const router = Router();

router.post("/post/facebook/page", jwtAuth, async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const user = await User.findById((req.user as any)._id);
    if (!user || !user.facebookPageId || !user.facebookPageToken) {
      return res.status(400).json({ error: "Facebook Page not connected" });
    }

    const pageId = user.facebookPageId;
    const encryptedToken = user.facebookPageToken;
    const pageToken = decryptToken(encryptedToken);

    // Make post request
    const graphRes = await axios.post(
      `https://graph.facebook.com/v17.0/${pageId}/feed`,
      null,
      {
        params: {
          message,
          access_token: pageToken,
        }
      }
    );

    res.json({ success: true, postId: graphRes.data.id });

  } catch (err: any) {
    console.error("Facebook post error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to post to Facebook Page" });
  }
});

export default router;
