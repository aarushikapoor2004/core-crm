import { z } from "zod";

export const segmentSchema = z.object({
  name: z.string(),
  rules: z.record(z.any()).nullable(),
  userId: z.string(),
});

export const defaultValues: z.infer<typeof segmentSchema> = {
  name: "",
  userId: "",
  rules: null
}
