// src/routes/categories.ts
import { Router } from "express";
import jwtAuth from "../../middleware/jwtAuth";

import { getSaasContext } from "../../services/domain/getSaasContext";
import { generateCategories } from "../../services/domain/generateCategories.service";

const router = Router();

router.post("/generate-categories", jwtAuth, async (req, res) => {
    // const { industry, product, target_audience, pain_points, description } = req.body;
    try {
        const userId = (req.user as any)._id;
        const saasContext = await getSaasContext(userId);

        const { pain, general, questions } = await generateCategories({
            userId,
            saasContext,
        });
        res.json({
            pain,
            general,
            questions,
        });
    } catch (err) {
        console.error("❌ Category generation error:", err);
        res.status(500).json({ error: "Failed to generate categories" });
    }
});

export default router;
