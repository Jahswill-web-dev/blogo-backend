import { Router } from "express";
import axios from "axios";
import jwtAuth from "../middleware/jwtAuth";
import { User } from "../models/User";

const router = Router();

// POST /publish/linkedin
router.post("/publish/linkedin", jwtAuth, async (req, res) => {
    try {
        const { post } = req.body;
        if (!post) return res.status(400).json({ error: "Post text required" });
        // Get user LinkedIn token
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const user = await User.findById((req.user as any)._id);
        if (!user?.linkedinToken) {
            return res.status(400).json({ error: "LinkedIn not connected" });
        }

        // Get LinkedIn profile ID
        const meRes = await axios.get("https://api.linkedin.com/v2/me", {
            headers: { Authorization: `Bearer ${user.linkedinToken}` },
        });
        const author = `urn:li:person:${meRes.data.id}`;

        // Publish post
        await axios.post(
            "https://api.linkedin.com/v2/ugcPosts",
            {
                author,
                lifecycleState: "PUBLISHED",
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: { text: post },
                        shareMediaCategory: "NONE",
                    },
                },
                visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
            },
            { headers: { Authorization: `Bearer ${user.linkedinToken}` } }
        );

        res.json({ success: true, platform: "linkedin", post });
    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.error(err.response?.data || err.message);
        } else if (err instanceof Error) {
            console.error(err.message);
        } else {
            console.error("Unknown error", err);
        }
        res.status(500).json({ error: "Failed to publish LinkedIn post" });
    }
});

export default router;
