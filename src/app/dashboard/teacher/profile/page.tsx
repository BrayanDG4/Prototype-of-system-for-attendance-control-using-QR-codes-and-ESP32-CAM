"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherProfile() {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Perfil del Profesor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Nombre completo" />
          <Input placeholder="Correo electrónico" type="email" />
          <Input placeholder="Teléfono de contacto" type="tel" />
          <Button onClick={() => setIsComplete(true)}>Guardar Perfil</Button>
        </CardContent>
      </Card>
      {isComplete && (
        <Card>
          <CardHeader>
            <CardTitle>¡Perfil Completado!</CardTitle>
          </CardHeader>
          <CardContent>
            Ahora puedes crear grupos de clase y gestionar asistencias.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
