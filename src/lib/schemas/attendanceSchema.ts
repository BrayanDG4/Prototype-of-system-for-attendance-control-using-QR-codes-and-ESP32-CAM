import { z } from "zod";

export const attendanceSchema = z.object({
  duration: z.enum(["10", "15", "30", "60"], {
    required_error: "Seleccione una duración.",
  }),
});
