"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ManualAttendanceDialog from "@/components/dashboard/teacher/ManualAttendanceDialog";
import { useUser } from "@clerk/nextjs";

type StudentAttendance = {
  studentName: string;
  studentEmail: string;
  attendedAt: string;
  status: "Present" | "Absent";
};

type Group = {
  id: string;
  name: string;
  attendance: StudentAttendance[];
  students: { id: string; name: string; email: string }[];
};

export default function AttendanceByGroup() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [filterDate, setFilterDate] = useState("");
  const { toast } = useToast();
  const { user } = useUser(); // Obtener datos del usuario autenticado

  // Fetch groups from backend
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?.id) return;
      try {
        const backendUrl = process.env.NEXT_PUBLIC_NEST_BACKEND_URL;
        const response = await fetch(
          `${backendUrl}/class-group/teacher/${user.id}/attendance`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos de los grupos.");
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de los grupos.",
          variant: "destructive",
        });
      }
    };

    fetchGroups();
  }, [user?.id, toast]);

  const handleManualAttendance = async (
    groupId: string,
    studentId: string,
    date: string
  ) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_NEST_BACKEND_URL;
      const response = await fetch(`${backendUrl}/attendance/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classGroupId: groupId, studentId, date }),
      });

      if (!response.ok) {
        // Extraer el mensaje de error del cuerpo de la respuesta
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al registrar la asistencia manual."
        );
      }

      const updatedAttendance = await response.json();

      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                attendance: [...group.attendance, updatedAttendance],
              }
            : group
        )
      );

      toast({
        title: "Asistencia Registrada",
        description: "La asistencia fue registrada correctamente.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error.message || "No se pudo registrar la asistencia manual.",
        variant: "destructive",
      });
    }
  };

  const filteredAttendance = selectedGroup?.attendance.filter((record) =>
    filterDate
      ? new Date(record.attendedAt).toISOString().split("T")[0] === filterDate
      : true
  );

  return (
    <div className="px-1 space-y-4">
      <h2 className="text-2xl font-bold">Asistencia por Grupo</h2>
      {!selectedGroup ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grupo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => setSelectedGroup(group)}>
                      Ver Asistencia
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setSelectedGroup(null)}>
            Volver a Grupos
          </Button>
          <h3 className="text-xl font-bold">
            Asistencia del Grupo: {selectedGroup.name}
          </h3>
          <div className="flex items-center space-x-4">
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Filtrar por fecha"
            />
            <ManualAttendanceDialog
              group={selectedGroup}
              onManualAttendance={handleManualAttendance}
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance?.length > 0 ? (
                  filteredAttendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.studentName}</TableCell>
                      <TableCell>{record.studentEmail}</TableCell>
                      <TableCell>
                        {
                          new Date(record.attendedAt)
                            .toISOString()
                            .split("T")[0]
                        }
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "Present"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No hay registros de asistencia.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
