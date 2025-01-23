"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { AnnouncementsPanel } from "@/components/dashboard/announcements-panel";
import { ReportsSection } from "@/components/dashboard/reports-section";
import { AttendanceStatistics } from "@/components/dashboard/attendance-statistics";
import { FailureStatistics } from "@/components/dashboard/failure-statistics";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GenderStatistics } from "@/components/dashboard/gender-statistics";

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
  const { user } = useUser();
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      // Verificar si el usuario está autenticado y tiene un ID válido
      if (!user?.id) {
        console.error("No se encontró el ID del usuario en Clerk.");
        return;
      }

      try {
        // Construir la URL correcta
        const apiUrl = `http://localhost:4000/user/${user.id}/is-profile-complete`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(
            `Error en la solicitud: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        setIsProfileComplete(data.isProfileComplete);
      } catch (error) {
        console.error(
          "Error al verificar si el perfil está completo:",
          (error as Error).message
        );
      }
    };

    checkProfileCompletion();
  }, [user]);

  const { canViewReports, canViewAnalytics, canViewNotifications } =
    rolePermissions[role] || rolePermissions["guest"];

  const renderOverviewContent = () => {
    if (role === "student") {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Asistencias Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-muted-foreground">
                  +5 desde el último mes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Faltas Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  -1 desde el último mes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Promedio de Asistencias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  +2% desde el último mes
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Estadísticas de Asistencias</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <AttendanceStatistics />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Estadísticas de Fallas</CardTitle>
              </CardHeader>
              <CardContent>
                <FailureStatistics />
              </CardContent>
            </Card>
          </div>
        </>
      );
    }

    return (
      <>
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
              <p className="text-xs text-muted-foreground">+20.1% desde ayer</p>
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
              <Overview data={{ /* your data here */ }} />
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
      </>
    );
  };

  const renderAnalyticsContent = () => (
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
  );

  return (
    <div className="space-y-4 px-1">
      {!isProfileComplete && (
        <Alert className="bg-yellow-100 text-yellow-800 border-yellow-300 flex justify-between items-center">
          <div>
            <AlertTitle>Completa tu perfil</AlertTitle>
            <AlertDescription>
              Para acceder a todas las funciones, completa tu perfil ahora.
            </AlertDescription>
          </div>
          <Button
            onClick={() => router.push(`/dashboard/${role}/profile`)}
            className="ml-4"
            variant="secondary"
          >
            Completar Perfil
          </Button>
        </Alert>
      )}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Descargar</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
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
        <TabsContent value="overview" className="space-y-4">
          {renderOverviewContent()}
        </TabsContent>
        {canViewAnalytics && renderAnalyticsContent()}
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
