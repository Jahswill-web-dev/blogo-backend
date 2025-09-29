// routes/xAuth.ts
import { Router, Request, Response } from "express";
import jwtAuth from "../middleware/jwtAuth";
import crypto from "crypto";
import axios from "axios";
import { User } from "../models/User";
import { decryptToken } from "../services/tokendecrypt";
const router = Router();
const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY!;
const IV_LENGTH = 16;

// Encrypt helper
function encryptToken(token: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const ENCRYPTION = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY!, "hex");
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION, iv);
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

function generateCodeVerifier() {
    return crypto.randomBytes(64).toString("hex");
}

function generateCodeChallenge(verifier: string) {
    return crypto.createHash("sha256")
        .update(verifier)
        .digest()
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}




router.get("/auth/x", jwtAuth, (req, res) => {
    const state = "x_conn_" + (req.user as any)._id;
    const scope = "tweet.read tweet.write users.read offline.access";
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    (req.session as any).xCodeVerifier = codeVerifier;
    const url = `https://x.com/i/oauth2/authorize?response_type=code&client_id=${process.env.X_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.X_REDIRECT_URI!)}&scope=${encodeURIComponent(scope)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    res.redirect(url);
});

//  Handle callback
router.get("/auth/x/callback", jwtAuth, async (req: Request, res: Response) => {
    const { code } = req.query;
    // console.log("X Auth callback:", req.user);
    // console.log("DEBUG session verifier:", (req.session as any).xCodeVerifier);
    if (!code) return res.status(400).json({ error: "Missing code" });
    const clientId = process.env.X_CLIENT_ID!;
    const clientSecret = process.env.X_CLIENT_SECRET!;

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    try {
        const tokenRes = await axios.post(
            "https://api.x.com/2/oauth2/token",
            new URLSearchParams({
                code: code as string,
                grant_type: "authorization_code",
                redirect_uri: process.env.X_REDIRECT_URI!,
                client_id: process.env.X_CLIENT_ID!,
                code_verifier: (req.session as any).xCodeVerifier,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${basicAuth}`
                }
            }
        );
        // console.log("DEBUG token response:", tokenRes.data);
        const { access_token, refresh_token, expires_in } = tokenRes.data;
        const encryptedAccess = encryptToken(access_token);
        const encryptedRefresh = encryptToken(refresh_token);

        await User.findByIdAndUpdate((req.user as any)._id, {
            xAccessToken: encryptedAccess,
            xRefreshToken: encryptedRefresh,
            xTokenExpiry: new Date(Date.now() + expires_in * 1000),
        });

        res.json({ success: true, message: "X account connected" });

    } catch (err: any) {
        console.error("X auth callback error:", err.response?.data || err.message);
        res.status(500).json({ error: "X auth failed" });
    }
});

// posting a tweet
router.post("/x/tweet", jwtAuth, async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req.user as any)._id);
        if (!user?.xAccessToken) {
            return res.status(400).json({ error: "No X account connected" });
        }


        const decryptedAccess = decryptToken(user.xAccessToken);

        const tweetRes = await axios.post(
            "https://api.x.com/2/tweets",
            { text: req.body.text },
            {
                headers: {
                    "Authorization": `Bearer ${decryptedAccess}`,
                    "Content-Type": "application/json",
                }
            }
        );

        res.json(tweetRes.data);
    } catch (err: any) {
        console.error("Tweet post error:", err.response?.data || err.message);
        res.status(500).json({ error: "Tweet failed" });
    }
});

export default router;
