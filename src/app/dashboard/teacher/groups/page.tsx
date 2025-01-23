"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CreateGroupDialog from "@/components/dashboard/teacher/CreateGroupDialog";
import EnableAttendanceDialog from "@/components/dashboard/teacher/EnableAttendanceDialog";
import { Badge } from "@/components/ui/badge"; // Para mostrar el estado de la asistencia

// Define el tipo para los grupos
type Schedule = { day: string; startTime: string; endTime: string };
type Group = {
  id: string;
  name: string;
  room: string;
  accessCode: string;
  schedule: Schedule[] | string; // Puede ser un array de Schedule o una string JSON
  attendanceEnabled: boolean;
  attendanceEndsAt?: string; // Puede estar presente solo cuando la asistencia está habilitada
};

const itemsPerPage = 5;

export default function TeacherGroups() {
  const [groups, setGroups] = useState<Group[]>([]); // Estado con tipo Group[]
  const [totalGroups, setTotalGroups] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast(); // Hook para manejar las notificaciones

  // Fetch groups from backend with pagination
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_NEST_BACKEND_URL;
        const skip = (currentPage - 1) * itemsPerPage;

        if (!backendUrl) {
          throw new Error(
            "No se encontró la URL del backend en las variables de entorno."
          );
        }

        const response = await fetch(
          `${backendUrl}/class-group?skip=${skip}&take=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los grupos desde el backend");
        }

        const { groups, total } = await response.json();
        setGroups(groups);
        setTotalGroups(total);
      } catch (error) {
        console.error("Error al cargar los grupos:", error);
      }
    };

    fetchGroups();
  }, [currentPage]);

  const totalPages = Math.ceil(totalGroups / itemsPerPage);

  // Handle creation of new groups
  const handleCreateGroup = async (data: Omit<Group, "id">) => {
    const serializedData = {
      ...data,
      schedule: JSON.stringify(data.schedule),
    };

    try {
      const backendUrl = process.env.NEXT_PUBLIC_NEST_BACKEND_URL;
      const response = await fetch(`${backendUrl}/class-group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serializedData),
      });

      if (!response.ok) {
        throw new Error("Error al crear el grupo en el backend");
      }

      const newGroup: Group = await response.json();
      setGroups((prev) => [...prev, { ...newGroup, schedule: data.schedule }]);
    } catch (error) {
      console.error("Error al crear el grupo:", error);
    }
  };

  // Handle enabling attendance for a class group
  const handleEnableAttendance = async (
    groupIndex: number,
    duration: string
  ) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_NEST_BACKEND_URL;
      const groupId = groups[groupIndex]?.id;

      if (!groupId) {
        throw new Error("ID del grupo no encontrado.");
      }

      if (!backendUrl) {
        throw new Error(
          "No se encontró la URL del backend en las variables de entorno."
        );
      }

      const response = await fetch(
        `${backendUrl}/class-group/${groupId}/attendance`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ duration: parseInt(duration, 10) }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al habilitar la asistencia");
      }

      const updatedGroup: Group = await response.json();

      // Actualiza el estado del grupo con la asistencia habilitada
      setGroups((prev) =>
        prev.map((group, index) =>
          index === groupIndex
            ? {
                ...group,
                attendanceEnabled: true,
                attendanceEndsAt: updatedGroup.attendanceEndsAt,
              }
            : group
        )
      );

      // Mostrar notificación de éxito
      toast({
        title: "Asistencia habilitada",
        description: `La asistencia para el grupo "${updatedGroup.name}" ha sido habilitada por ${duration} minutos.`,
      });
    } catch (error) {
      console.error("Error al habilitar la asistencia:", error);
      toast({
        title: "Error al habilitar la asistencia",
        description:
          "No se pudo habilitar la asistencia. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Grupos de Clase</h2>
        <CreateGroupDialog onCreate={handleCreateGroup} />
      </div>
      <Input
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Salón</TableHead>
              <TableHead>Código de Acceso</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group, index) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.room}</TableCell>
                  <TableCell>{group.accessCode}</TableCell>
                  <TableCell>
                    <ul>
                      {Array.isArray(group.schedule)
                        ? group.schedule.map((sch, i) => (
                            <li key={i}>
                              {sch.day}: {sch.startTime} - {sch.endTime}
                            </li>
                          ))
                        : "Horario no disponible"}
                    </ul>
                  </TableCell>
                  <TableCell>
                    {group.attendanceEnabled ? (
                      <Badge variant="success">Activo</Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <EnableAttendanceDialog
                      groupIndex={index}
                      onEnable={handleEnableAttendance}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No hay grupos creados o no coinciden con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination className="flex justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={
                currentPage === 1 ? "pointer-events-none text-gray-400" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              }}
            >
              Anterior
            </PaginationPrevious>
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                className={currentPage === i + 1 ? "font-bold" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              className={
                currentPage === totalPages
                  ? "pointer-events-none text-gray-400"
                  : ""
              }
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              }}
            >
              Siguiente
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
