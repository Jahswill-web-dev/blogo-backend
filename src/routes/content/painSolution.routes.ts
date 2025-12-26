import { Router } from "express";
import jwtAuth from "../../middleware/jwtAuth";

import { getSaasContext } from "../../services/domain/getSaasContext";
import { createPainSolutionPost } from "../../services/domain/painSolution.service";

const router = Router();

router.post("/generate-pain-post", jwtAuth, async (req, res) => {
  try {
    const userId = (req.user as any)._id;

    const saasContext = await getSaasContext(userId); // profile, audience, etc.

    const post = await createPainSolutionPost({
      userId,
      saasContext,
    });

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
