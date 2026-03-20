import { z } from "zod";

export const FocusAreasSchema = z.object({
  focusAreas: z.array(z.string()),
});
