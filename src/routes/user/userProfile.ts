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
        const { userType, name, companyName, stage, industry, description, audience, contentGoals, tonePreference } = req.body;
        const userId = (req.user as any)._id;

        const existingProfile = await UserProfile.findOne({ userId });
        let profile;

        if (existingProfile) {
            existingProfile.set({
                userType,
                name,
                companyName,
                stage,
                industry,
                description,
                audience,
                contentGoals,
                tonePreference,
            });
            profile = await existingProfile.save();
        } else {
            profile = await UserProfile.create({
                userId,
                userType,
                name,
                companyName,
                stage,
                industry,
                description,
                audience,
                contentGoals,
                tonePreference,
            });
        }

        res.json({ success: true, profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error saving user profile" });
    }
});

export default router;
