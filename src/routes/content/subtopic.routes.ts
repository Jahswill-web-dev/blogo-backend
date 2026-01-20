import { Router } from "express";
import jwtAuth from "../../middleware/jwtAuth";
import { generateSubtopicsForUser } from "../../services/domain/generateCategories.service";
import { getAIimpovedSaasContext  } from "../../services/domain/getSaasContext";


const router = Router();

router.post("/generate-subtopics", jwtAuth, async (req, res) => {
    try {
        const userId = (req.user as any)._id;
        const saasContext = await getAIimpovedSaasContext(userId);
        const subtopics = await generateSubtopicsForUser({ userId, saasContext });
        res.json(subtopics);
    } catch (error) {
        console.error("Error generating subtopics:", error);
        res.status(500).json({ error: "Failed to generate subtopics" });
    };
});

export default router;