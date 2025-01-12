// app/dashboard/student/reports/page.tsx

"use client";

import { Button } from "@/components/ui/button";

const studentReports = [
  { id: 1, name: "Reporte de Asistencias Mensual", format: "PDF" },
  { id: 2, name: "Resumen de Asistencias Semanal", format: "PDF" },
];

export default function StudentReports() {
  return (
    <div className="px-4 py-6 space-y-4">
      <h2 className="text-2xl font-bold">Mis Reportes</h2>
      <div className="space-y-4">
        {studentReports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between border-b pb-2"
          >
            <div>
              <h3 className="text-lg font-medium">{report.name}</h3>
              <p className="text-sm text-gray-500">Formato: {report.format}</p>
            </div>
            <Button>Descargar</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
