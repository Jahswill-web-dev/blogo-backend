import express, { Request, Response } from "express";
// import { IUserProfile } from "../models/UserProfile"
import jwtAuth from "../../middleware/jwtAuth";
import UserProfile from "../../models/UserProfile";
const router = express.Router();

// Create or update user profile
router.post("/", jwtAuth, async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { saasName, productDescription, productPromise, targetAudience, painPoints } = req.body;
        const userId = (req.user as any)._id;

        const existingProfile = await UserProfile.findOne({ userId });
        let profile;

        if (existingProfile) {
            existingProfile.set({
                saasName, 
                productDescription,
                productPromise, 
                targetAudience, 
                painPoints
            });
            profile = await existingProfile.save();
        } else {
            profile = await UserProfile.create({
                userId,
                saasName, productDescription,
                productPromise, 
                targetAudience, 
                painPoints
            });
        }

        res.json({ success: true, profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error saving user profile" });
    }
});

router.get("/", jwtAuth, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)._id;

        const profile = await UserProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ success: true, profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching profile" });
    }
});

export default router;
