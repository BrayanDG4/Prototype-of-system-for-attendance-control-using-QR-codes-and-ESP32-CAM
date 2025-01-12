import { z } from "zod";

export const groupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  room: z.string().min(2, { message: "El salón es obligatorio." }),
  schedule: z
    .array(
      z.object({
        day: z.string().min(1, { message: "Seleccione un día." }),
        startTime: z
          .string()
          .min(1, { message: "Seleccione una hora de inicio." }),
        endTime: z.string().min(1, { message: "Seleccione una hora de fin." }),
      })
    )
    .min(1, { message: "Debe agregar al menos un horario." }),
  accessCode: z.string().min(6, {
    message: "El código de acceso debe tener al menos 6 caracteres.",
  }),
});
