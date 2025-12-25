// src/routes/categories.ts
import { Router } from "express";
import jwtAuth from "../middleware/jwtAuth";
import {
    generatePainCategories,
    generateCategories,
    generateQuestionTypes,
} from "../pipelines/categoriesPipeline";
import { getSaasContext } from "../services/domain/getSaasContext";

const router = Router();

router.post("/generate-categories", jwtAuth, async (req, res) => {
    // const { industry, product, target_audience, pain_points, description } = req.body;
    try {
        const userId = (req.user as any)._id;
        const saasContext = await getSaasContext(userId);

        const inputVars = {
            ...saasContext,
            userId,
        };

        const pain = await generatePainCategories(inputVars);
        const general = await generateCategories(inputVars);
        const questions = await generateQuestionTypes(inputVars);

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
