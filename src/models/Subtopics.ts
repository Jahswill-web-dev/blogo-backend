// models/SaasContentStrategy.ts
import { Schema, model, models } from "mongoose";

// TypeScript interfaces
export interface ISubtopic {
  type:     string;
  subtopic: string;
  angle:    string;
  goal:     string;
}

export interface IPillar {
  pillar: string;
  description?: string;
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
        type:     { type: String, required: true },
        subtopic: { type: String, required: true },
        angle:    { type: String, required: true },
        goal:     { type: String, required: true },
    },
    { _id: false }
);

const PillarSchema = new Schema(
    {
        pillar:      { type: String, required: true },
        description: String,
        subtopics:   { type: [SubtopicSchema], required: true },
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
        pillars: { type: [PillarSchema], required: true },
    },
    { timestamps: true }
);

AISaasContentPillars.index({ userId: 1 }, { unique: true });

export const AISaasContentPillarsModel =
    models.AISaasContentPillars ||
    model("AISaasContentPillars", AISaasContentPillars);
