"use client";

import { useState } from "react";
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

type Attendance = {
  date: string;
  status: "Present" | "Absent";
};

type Group = {
  id: string;
  name: string;
  room: string;
  schedule: { day: string; startTime: string; endTime: string }[];
  attendance: Attendance[];
};

const studentGroups: Group[] = [
  {
    id: "1",
    name: "Matemáticas Avanzadas",
    room: "Salón 201",
    schedule: [
      { day: "Lunes", startTime: "10:00", endTime: "12:00" },
      { day: "Miércoles", startTime: "10:00", endTime: "12:00" },
    ],
    attendance: [
      { date: "2025-01-09", status: "Present" },
      { date: "2025-01-10", status: "Absent" },
    ],
  },
  {
    id: "2",
    name: "Ciencias Naturales",
    room: "Salón 305",
    schedule: [{ day: "Viernes", startTime: "14:00", endTime: "16:00" }],
    attendance: [{ date: "2025-01-09", status: "Present" }],
  },
];

export default function StudentGroups() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [filterDate, setFilterDate] = useState("");

  const filteredAttendance = selectedGroup?.attendance.filter((record) =>
    filterDate ? record.date === filterDate : true
  );

  const calculateAttendanceSummary = () => {
    if (!selectedGroup) return { total: 0, present: 0, percentage: 0 };
    const total = selectedGroup.attendance.length;
    const present = selectedGroup.attendance.filter(
      (record) => record.status === "Present"
    ).length;
    const percentage = ((present / total) * 100).toFixed(2);
    return { total, present, percentage };
  };

  const attendanceSummary = calculateAttendanceSummary();

  return (
    <div className="px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold">Mis Grupos</h2>
      {!selectedGroup ? (
        <>
          <Input
            placeholder="Buscar por nombre"
            onChange={(e) => setFilterDate(e.target.value)}
            className="mb-4"
          />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Salón</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.room}</TableCell>
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
        </>
      ) : (
        <>
          <Button variant="outline" onClick={() => setSelectedGroup(null)}>
            Volver a Grupos
          </Button>
          <h3 className="text-xl font-bold">
            Asistencias en {selectedGroup.name}
          </h3>
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <p>
                <strong>Salón:</strong> {selectedGroup.room}
              </p>
              <p>
                <strong>Horario:</strong>{" "}
                {selectedGroup.schedule
                  .map(
                    (schedule) =>
                      `${schedule.day}: ${schedule.startTime} - ${schedule.endTime}`
                  )
                  .join(", ")}
              </p>
              <p>
                <strong>Sesiones Totales:</strong> {attendanceSummary.total}
              </p>
              <p>
                <strong>Asistencias:</strong> {attendanceSummary.present}
              </p>
              <p>
                <strong>Porcentaje de Asistencia:</strong>{" "}
                {attendanceSummary.percentage}%
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Filtrar por fecha"
              />
            </div>
            <div className="rounded-md border mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance?.length ? (
                    filteredAttendance.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.status}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        No hay registros de asistencia.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
