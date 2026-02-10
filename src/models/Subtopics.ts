// models/SaasContentStrategy.ts
import { Schema, model, models } from "mongoose";

// TypeScript interfaces
export interface ISubtopic {
  subtopic: string;
}

export interface IPillar {
  pillar: string;
  pain?: string;
  subtopics: ISubtopic[];
}

export interface IAISaasContentPillars {
  userId: Schema.Types.ObjectId;
  pillars: IPillar[];
}

export interface AISaasContentPillarsDocument extends IAISaasContentPillars, Document {
  createdAt: Date;
  updatedAt: Date;
}

//Schemas

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