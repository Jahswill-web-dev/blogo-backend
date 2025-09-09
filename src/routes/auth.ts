import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req: any, res) => {
    const user = req.user as any;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true, secure: false });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not logged in" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);
    res.json(user);
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
