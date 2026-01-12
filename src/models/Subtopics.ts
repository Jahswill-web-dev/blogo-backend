// models/SaasContentStrategy.ts
import { Schema, model, models } from "mongoose";

const SubtopicSchema = new Schema(
    {
        subtopic: { type: String, required: true },
    },
    { _id: false }
);

const PillarSchema = new Schema(
    {
        pillar: { type: String, required: true },
        pain: String,
        subtopics: { type: [SubtopicSchema], required: true },
    },
    { _id: false }
);

const AISaasContentPillars = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
            required: true,
        },

        // contextVersion: String,
        pillars: { type: [PillarSchema], required: true },
    },
    { timestamps: true }
);

AISaasContentPillars.index({ userId: 1 }, { unique: true });

export const AISaasContentPillarsModel =
    models.AISaasContentPillars ||
    model("AISaasContentPillars", AISaasContentPillars);