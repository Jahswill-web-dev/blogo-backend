import { Router } from "express";
import jwtAuth from "../../middleware/jwtAuth";
import { generateSubtopicsForUser } from "../../services/domain/generateCategories.service";
import { getSaasContext } from "../../services/domain/getSaasContext";

const router = Router();

router.post("/generate-subtopics", jwtAuth, async (req, res) => {
    try {
        const userId = (req.user as any)._id;
        const fullContext = await getSaasContext(userId);
        // Only pass the three variables the subtopics prompt template uses.
        // LangChain validates that inputVariables match {placeholders} in the template.
        const saasContext = {
            userNiche:      fullContext.userNiche,
            targetAudience: fullContext.targetAudience,
            focusArea:      fullContext.focusArea ?? '',
        };
        const subtopics = await generateSubtopicsForUser({ userId, saasContext });
        res.json({ pillars: subtopics.pillars });
    } catch (error) {
        console.error("Error generating subtopics:", error);
        res.status(500).json({ error: "Failed to generate subtopics" });
    }
});

export default router;
