import { Router, Request, Response, RequestHandler } from "express";
import axios from "axios";
import jwtAuth from "../middleware/jwtAuth";
import { User, IUser, UserDocument } from "../models/User";
import { Document } from "mongoose";

// interface AuthenticatedRequest extends Request {
//     user?: IUser & Document;
// }
const router = Router();

// Step 1: Redirect user to LinkedIn consent page
router.get("/auth/linkedin", jwtAuth, (req, res) => {
    const scope = encodeURIComponent("openid profile");
    const redirectUri = encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI!);
    const state = "someRandomString123"; 
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    res.redirect(url);
});

// Step 2: LinkedIn callback → exchange code for access token
const handler: RequestHandler = async (req, res) => {
    const { code } = req.query;
    console.log("LinkedIn callback query:", req.query);

    if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    try {
        const tokenRes = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type: "authorization_code",
                code: code as string,
                redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
                client_id: process.env.LINKEDIN_CLIENT_ID!,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
            }),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            }
        );
        // console.log("LinkedIn token response:", tokenRes.data);
        const accessToken = tokenRes.data.access_token;

        // Save token to user record
        await User.findByIdAndUpdate((req.user as any)._id, {
            linkedinToken: accessToken,
        });

        res.json({ success: true });
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "LinkedIn auth failed" });
    }
}

router.get("/auth/linkedin/callback", jwtAuth, handler);

export default router;
