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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function ManualAttendanceDialog({
  group,
  onManualAttendance,
}: {
  group: { id: string; students: { id: string; name: string }[] };
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
