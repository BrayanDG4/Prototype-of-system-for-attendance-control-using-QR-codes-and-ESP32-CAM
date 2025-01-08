import { Button } from "@/components/ui/button"

const reportes = [
  { id: 1, nombre: "Reporte de Asistencia Mensual", formato: "PDF" },
  { id: 2, nombre: "Análisis de Fallas", formato: "PDF" },
  { id: 3, nombre: "Estadísticas por Género", formato: "PDF" },
  { id: 4, nombre: "Resumen Anual", formato: "PDF" },
]

export function ReportsSection() {
  return (
    <div className="space-y-4">
      {reportes.map((reporte) => (
        <div key={reporte.id} className="flex items-center justify-between border-b pb-2">
          <div>
            <h3 className="text-lg font-medium">{reporte.nombre}</h3>
            <p className="text-sm text-gray-500">Formato: {reporte.formato}</p>
          </div>
          <Button>Descargar</Button>
        </div>
      ))}
    </div>
  )
}

