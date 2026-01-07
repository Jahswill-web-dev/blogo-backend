import { Router } from "express";
import jwtAuth from "../../middleware/jwtAuth";
import { createSaasAIProfile } from "../../services/domain/saasProfile.service";




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

export default router;
