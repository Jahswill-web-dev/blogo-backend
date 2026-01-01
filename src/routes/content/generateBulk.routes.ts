import { Router } from "express";
import jwtAuth from "../../middleware/jwtAuth";
import { getSaasContext } from "../../services/domain/getSaasContext";
import { createBulkPosts } from "../../services/domain/bulkGeneration.service";

const router = Router();

router.post("/generate-bulk-posts", jwtAuth, async (req, res) => {
  try {
    const userId = (req.user as any)._id;
    const count = Number(req.body.count) || 5;

    const saasContext = await getSaasContext(userId);

    const posts = await createBulkPosts({
      userId,
      saasContext,
      count,
    });

    res.json({ success: true, posts });
  } catch (err) {
    console.error("❌ Bulk post generation error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
