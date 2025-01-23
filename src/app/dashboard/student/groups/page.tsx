"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";

type Group = {
  id: string;
  name: string;
  room: string;
  schedule: { day: string; startTime: string; endTime: string }[] | null;
};

export default function StudentGroups() {
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [enrolledGroups, setEnrolledGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_NEST_BACKEND_URL;
        const allGroupsResponse = await fetch(`${backendUrl}/class-group`);
        if (!allGroupsResponse.ok) {
          throw new Error("Error al obtener todos los grupos.");
        }
        const allGroupsData = await allGroupsResponse.json();
        setAllGroups(allGroupsData.groups || []);

        if (user?.id) {
          const enrolledResponse = await fetch(
            `${backendUrl}/class-group/enrolled/${user.id}`
          );
          if (!enrolledResponse.ok) {
            throw new Error("Error al obtener los grupos inscritos.");
          }
          const enrolledData = await enrolledResponse.json();
          setEnrolledGroups(Array.isArray(enrolledData) ? enrolledData : []);
        }
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error",
          description: error.message || "Ocurrió un error al cargar los datos.",
          variant: "destructive",
        });
      }
    };

    fetchGroups();
  }, [toast, user?.id]);

  const handleEnroll = async () => {
    if (!selectedGroupId || !accessCode || !user?.id) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_NEST_BACKEND_URL;
      const response = await fetch(`${backendUrl}/class-group/enroll`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessCode,
          studentId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al matricularse al grupo.");
      }

      const enrolledGroup = allGroups.find(
        (group) => group.id === selectedGroupId
      );
      if (enrolledGroup) {
        setEnrolledGroups((prev) => [...prev, enrolledGroup]);
        setAllGroups((prev) =>
          prev.filter((group) => group.id !== selectedGroupId)
        );
      }

      toast({
        title: "Éxito",
        description: "Te has matriculado correctamente al grupo.",
      });

      setSelectedGroupId(null);
      setAccessCode("");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "No se pudo completar la matrícula.",
        variant: "destructive",
      });
    }
  };

  const availableGroups = Array.isArray(allGroups)
    ? allGroups.filter(
        (group) => !enrolledGroups.some((enrolled) => enrolled.id === group.id)
      )
    : [];

  return (
    <div className="px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold">Mis Grupos</h2>

      {/* Tabla de grupos inscritos */}
      <div>
        <h3 className="text-xl font-bold mb-4">Grupos Inscritos</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Salón</TableHead>
                <TableHead>Horario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrolledGroups.length > 0 ? (
                enrolledGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.room}</TableCell>
                    <TableCell>
                      {Array.isArray(group.schedule)
                        ? group.schedule
                            .map(
                              (schedule) =>
                                `${schedule.day}: ${schedule.startTime} - ${schedule.endTime}`
                            )
                            .join(", ")
                        : "Horario no disponible"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No estás inscrito en ningún grupo.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Tabla de grupos disponibles */}
      <div>
        <h3 className="text-xl font-bold mb-4">Grupos Disponibles</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Salón</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableGroups.length > 0 ? (
                availableGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.room}</TableCell>
                    <TableCell>
                      {Array.isArray(group.schedule)
                        ? group.schedule
                            .map(
                              (schedule) =>
                                `${schedule.day}: ${schedule.startTime} - ${schedule.endTime}`
                            )
                            .join(", ")
                        : "Horario no disponible"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => setSelectedGroupId(group.id)}
                      >
                        Matricularse
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No hay grupos disponibles.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Formulario de matrícula */}
      {selectedGroupId && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Matricularse en el Grupo</h3>
          <Input
            placeholder="Clave de acceso"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />
          <Button onClick={handleEnroll}>Confirmar Matrícula</Button>
        </div>
      )}
    </div>
  );
}
