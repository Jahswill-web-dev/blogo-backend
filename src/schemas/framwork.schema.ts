import { z } from "zod";

export const FrameworkSchema = z.object({
  framework_name: z.string(),
  components: z.array(z.string()).min(1),
  application: z.string(),
  cta: z.string(),
});

export type Framework = z.infer<typeof FrameworkSchema>;
