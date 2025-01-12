"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StudentAttendance = {
  id: string;
  name: string;
  email: string;
  date: string;
  status: "Present" | "Absent";
};

type Group = {
  id: string;
  name: string;
  attendance: StudentAttendance[];
  students: { id: string; name: string; email: string }[];
};

export default function AttendanceByGroup() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      name: "Cálculo 1",
      attendance: [
        {
          id: "1",
          name: "Juan Pérez",
          email: "juan.perez@example.com",
          date: "2025-01-09",
          status: "Present",
        },
      ],
      students: [
        { id: "1", name: "Juan Pérez", email: "juan.perez@example.com" },
        { id: "2", name: "María Gómez", email: "maria.gomez@example.com" },
      ],
    },
    { id: "2", name: "Física 1", attendance: [], students: [] },
  ]);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [filterDate, setFilterDate] = useState("");

  const handleManualAttendance = (
    groupId: string,
    studentId: string,
    date: string
  ) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              attendance: [
                ...group.attendance,
                {
                  id: studentId,
                  name:
                    group.students.find((s) => s.id === studentId)?.name ||
                    "Desconocido",
                  email:
                    group.students.find((s) => s.id === studentId)?.email ||
                    "Desconocido",
                  date,
                  status: "Present",
                },
              ],
            }
          : group
      )
    );
  };

  const filteredAttendance = selectedGroup?.attendance.filter((record) =>
    filterDate ? record.date === filterDate : true
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
                  filteredAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.email}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.status}</TableCell>
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

function ManualAttendanceDialog({
  group,
  onManualAttendance,
}: {
  group: Group;
  onManualAttendance: (
    groupId: string,
    studentId: string,
    date: string
  ) => void;
}) {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");

  const handleSubmit = () => {
    if (selectedStudent && attendanceDate) {
      onManualAttendance(group.id, selectedStudent, attendanceDate);
      setSelectedStudent("");
      setAttendanceDate("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Registrar Manualmente</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Asistencia Manual</DialogTitle>
          <DialogDescription>
            Seleccione un estudiante y una fecha para registrar la asistencia.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select onValueChange={setSelectedStudent}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar Estudiante" />
            </SelectTrigger>
            <SelectContent>
              {group.students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Registrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
