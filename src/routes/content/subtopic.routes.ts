import { Router } from "express";
import jwtAuth from "../../middleware/jwtAuth";
import { generateContentStrategyForUser } from "../../services/domain/generateCategories.service";
import { getSaasContext } from "../../services/domain/getSaasContext";

const router = Router();

router.post("/generate-content-strategy", jwtAuth, async (req, res) => {
    try {
        const userId = (req.user as any)._id;
        const fullContext = await getSaasContext(userId);
        const saasContext = {
            userNiche:      fullContext.userNiche,
            targetAudience: fullContext.targetAudience,
            focusArea:      fullContext.focusArea ?? '',
        };
        const result = await generateContentStrategyForUser({ userId, saasContext });
        res.json(result);
    } catch (error) {
        console.error("Error generating content strategy:", error);
        res.status(500).json({ error: "Failed to generate content strategy" });
    }
});

export default router;
