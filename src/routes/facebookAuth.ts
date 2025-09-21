// routes/facebookAuth.ts

import { Router, Request, Response } from "express";
import jwtAuth from "../middleware/jwtAuth"; // require user to be logged in
import crypto from "crypto";
import { User } from "../models/User";
import axios from "axios";

// Encryption helpers
const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY!;
const IV_LENGTH = 16;

function encryptToken(token: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

const router = Router();

router.get("/auth/facebook", jwtAuth, (req, res) => {
  const appId = process.env.FACEBOOK_APP_ID!;
  const redirectUri = encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI!);
  const scope = "pages_manage_posts,pages_read_engagement,pages_show_list";
  const state = "fb_conn_" + (req.user as any)._id; // optional, track which user
  const url = `https://www.facebook.com/v23.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`;
  res.redirect(url);
});



// routes/facebookAuth.ts (continued)

router.get("/auth/facebook/callback", jwtAuth, async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: "Missing code from Facebook callback" });
  }

  try {
    // Exchange code for user access token
    const tokenRes = await axios.get(`https://graph.facebook.com/v17.0/oauth/access_token`, {
      params: {
        client_id: process.env.FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
        code,
      }
    });

    const userAccessToken = tokenRes.data.access_token;

    // Use user token to fetch Pages managed by this user (and page access tokens)
    const pagesRes = await axios.get(`https://graph.facebook.com/v17.0/me/accounts`, {
      params: {
        access_token: userAccessToken,
      }
    });

    // pagesRes.data.data is array of pages: { id, name, access_token, ... }
    const pages = pagesRes.data.data;

    if (!pages || pages.length === 0) {
      return res.status(400).json({ error: "No Facebook Pages found for this user" });
    }

    // Choose one Page to save (or let user pick). For MVP, pick the first:
    const page = pages[0];
    const pageToken = page.access_token;
    const encryptedPageToken = encryptToken(pageToken);

    await User.findByIdAndUpdate((req.user as any)._id, {
      facebookPageId: page.id,
      facebookPageToken: encryptedPageToken,
    });

    res.json({ success: true, pageId: page.id, pageName: page.name });

  } catch (err: any) {
    console.error("FB callback error:", err.response?.data || err.message);
    res.status(500).json({ error: "Facebook auth callback failed" });
  }
});


export default router;
