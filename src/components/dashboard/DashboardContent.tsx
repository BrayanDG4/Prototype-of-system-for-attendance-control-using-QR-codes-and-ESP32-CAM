"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Button } from "@/components/ui/button";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { GenderStatistics } from "@/components/dashboard/gender-statistics";
import { AttendanceStatistics } from "@/components/dashboard/attendance-statistics";
import { FailureStatistics } from "@/components/dashboard/failure-statistics";
import { AnnouncementsPanel } from "@/components/dashboard/announcements-panel";
import { ReportsSection } from "@/components/dashboard/reports-section";

// Configuración de permisos para roles
const rolePermissions = {
  admin: {
    canViewReports: true,
    canViewAnalytics: true,
    canViewNotifications: true,
  },
  teacher: {
    canViewReports: false,
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
  const { canViewReports, canViewAnalytics, canViewNotifications } =
    rolePermissions[role] || rolePermissions["guest"]; // Fallback para evitar errores

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">General</TabsTrigger>
        {canViewAnalytics && (
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        )}
        {canViewReports && <TabsTrigger value="reports">Reportes</TabsTrigger>}
        {canViewNotifications && (
          <TabsTrigger value="notifications">Anuncios</TabsTrigger>
        )}
      </TabsList>
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
      {canViewAnalytics && (
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Género</CardTitle>
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
  );
}
