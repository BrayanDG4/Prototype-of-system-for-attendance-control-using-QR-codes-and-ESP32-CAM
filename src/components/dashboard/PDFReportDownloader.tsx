"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react"; // Spinner opcional

export function PDFReportDownloader() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(false); // ⏳ Estado de carga

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEST_BACKEND_URL}/class-group?skip=0&take=100`
        );
        const data = await res.json();
        setGroups(data.groups || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron obtener los grupos.",
          variant: "destructive",
        });
      }
    };

    fetchGroups();
  }, [toast]);

  const handleDownload = async () => {
    const fromDate = dateRange?.from;
    const toDate = dateRange?.to;
    const hasValidDates = fromDate instanceof Date && toDate instanceof Date;

    if (!selectedGroup || !hasValidDates) {
      toast({
        title: "Campos requeridos",
        description: "Selecciona un grupo y un rango de fechas válidas.",
        variant: "destructive",
      });
      return;
    }

    const startDate = format(fromDate!, "yyyy-MM-dd");
    const endDate = format(toDate!, "yyyy-MM-dd");

    try {
      setIsLoading(true); // 🔄 Inicia la carga
      const url = `${process.env.NEXT_PUBLIC_NEST_BACKEND_URL}/class-group/${selectedGroup}/report?startDate=${startDate}&endDate=${endDate}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("No se pudo generar el reporte.");
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `reporte-${startDate}-a-${endDate}.pdf`;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast({
        title: "Error al descargar",
        description: "No se pudo generar el PDF del reporte.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // ✅ Termina la carga
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Selecciona Grupo
        </label>
        <Select onValueChange={setSelectedGroup}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un grupo" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Rango de Fechas
        </label>
        <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
      </div>

      <Button onClick={handleDownload} className="mt-2" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Generando...
          </>
        ) : (
          "Generar PDF"
        )}
      </Button>
    </div>
  );
}
