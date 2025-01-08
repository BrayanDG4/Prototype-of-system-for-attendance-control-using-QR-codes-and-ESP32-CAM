import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const anuncios = [
  {
    id: 1,
    titulo: "Mantenimiento programado",
    descripcion: "El sistema estará en mantenimiento el próximo sábado de 22:00 a 23:00 hrs.",
    fecha: "2023-07-15",
  },
  {
    id: 2,
    titulo: "Nuevo módulo de reportes",
    descripcion: "Se ha añadido un nuevo módulo de reportes avanzados. Explora las nuevas funcionalidades en la sección de Reportes.",
    fecha: "2023-07-10",
  },
  {
    id: 3,
    titulo: "Actualización de política de asistencia",
    descripcion: "A partir del próximo mes, se implementará una nueva política de asistencia. Por favor, revisa el documento adjunto para más detalles.",
    fecha: "2023-07-05",
  },
]

export function AnnouncementsPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {anuncios.map((anuncio) => (
        <Card key={anuncio.id}>
          <CardHeader>
            <CardTitle>{anuncio.titulo}</CardTitle>
            <CardDescription>{anuncio.fecha}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{anuncio.descripcion}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

