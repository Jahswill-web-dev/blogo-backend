import { Router } from "express";
import jwtAuth from "../../middleware/jwtAuth";
import { suggestFocusAreas } from "../../pipelines/focusAreasPipeline";

const router = Router();

router.post("/suggest-focus-areas", jwtAuth, async (req, res) => {
  const { niche, audience } = req.body;
  try {
    const result = await suggestFocusAreas(niche, audience);
    res.json(result);
  } catch (err) {
    console.error("❌ Focus area suggestion error:", err);
    res.json({ focusAreas: [] });
  }
});

export default router;
