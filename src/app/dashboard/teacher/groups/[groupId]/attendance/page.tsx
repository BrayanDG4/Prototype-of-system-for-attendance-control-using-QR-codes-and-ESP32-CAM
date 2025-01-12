"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AttendanceActivation() {
  const handleActivate = (duration) => {
    console.log(`Toma de asistencia activada por ${duration} minutos`);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Habilitar Asistencia</h2>
      <RadioGroup>
        {[10, 15, 30, 60].map((duration) => (
          <RadioGroupItem key={duration} value={duration}>
            {duration} minutos
          </RadioGroupItem>
        ))}
      </RadioGroup>
      <Button onClick={() => handleActivate(15)}>Activar</Button>
    </div>
  );
}
