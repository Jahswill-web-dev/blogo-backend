import { Router } from "express";
import jwtAuth from "../../middleware/jwtAuth";
import { createSaasAIProfile } from "../../services/domain/saasProfile.service";
import { getAISaasProfileByUser } from "../../repositories/saasProfile.repository";

const router = Router();

router.post("/generate-saas-profile", jwtAuth, async (req, res) => {
  try {
    const userId = (req.user as any)._id;
    const profile = await createSaasAIProfile(userId);
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/saas-profile", jwtAuth, async (req, res) => {
  try {
    const userId = (req.user as any)._id;
    const profile = await getAISaasProfileByUser(userId);
    if (!profile) {
      return res.status(404).json({ error: "No AI profile found. Run POST /generate-saas-profile first." });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve AI profile" });
  }
});

export default router;
