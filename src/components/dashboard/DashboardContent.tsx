"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { GenderStatistics } from "@/components/dashboard/gender-statistics";
import { AnnouncementsPanel } from "@/components/dashboard/announcements-panel";
import { ReportsSection } from "@/components/dashboard/reports-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Configuración de permisos para roles
const rolePermissions = {
  admin: {
    canViewReports: true,
    canViewAnalytics: true,
    canViewNotifications: true,
  },
  teacher: {
    canViewReports: true,
    canViewAnalytics: true,
    canViewNotifications: true,
  },
  student: {
    canViewReports: false,
    canViewAnalytics: false,
    canViewNotifications: true,
  },
  guest: {
    canViewReports: false,
    canViewAnalytics: false,
    canViewNotifications: false,
  },
};

export function DashboardContent({ role }: { role: string }) {
  const router = useRouter();

  // Simulación de estado del perfil del usuario
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const { canViewReports, canViewAnalytics, canViewNotifications } =
    rolePermissions[role] || rolePermissions["guest"]; // Fallback para evitar errores

  return (
    <div className="space-y-4 px-1">
      {/* Alerta si el perfil no está completo */}
      {!isProfileComplete && (
        <Alert className="bg-yellow-100 text-yellow-800 border-yellow-300 flex justify-between items-center">
          <div>
            <AlertTitle>Completa tu perfil</AlertTitle>
            <AlertDescription>
              Para acceder a todas las funciones, completa tu perfil ahora.
            </AlertDescription>
          </div>
          <Button
            onClick={() => router.push("/profile")}
            className="ml-4"
            variant="secondary"
          >
            Completar Perfil
          </Button>
        </Alert>
      )}

      {/* Header con selector de fecha y botón */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Descargar</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        {/* Tabs */}
        <TabsList>
          <TabsTrigger value="overview">General</TabsTrigger>
          {canViewAnalytics && (
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          )}
          {canViewReports && (
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          )}
          {canViewNotifications && (
            <TabsTrigger value="notifications">Anuncios</TabsTrigger>
          )}
        </TabsList>

        {/* Contenido del tab General */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total de Asistencias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,345</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% desde el último mes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asistencias Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% desde ayer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fallas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  -8% desde el último mes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tasa de Asistencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">95.5%</div>
                <p className="text-xs text-muted-foreground">
                  +5.1% desde el último mes
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Asistencias Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Otros tabs */}
        {canViewAnalytics && (
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas por Género</CardTitle>
                </CardHeader>
                <CardContent>
                  <GenderStatistics />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
        {canViewReports && (
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reportes</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportsSection />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {canViewNotifications && (
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Anuncios</CardTitle>
              </CardHeader>
              <CardContent>
                <AnnouncementsPanel />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
