"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Student = {
  id: string;
  name: string;
  email: string;
};

export default function Students() {
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "Juan Pérez", email: "juan.perez@example.com" },
    { id: "2", name: "María Gómez", email: "maria.gomez@example.com" },
  ]);

  const handleAddStudent = (student: Student) => {
    setStudents((prev) => [...prev, { ...student, id: Date.now().toString() }]);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  return (
    <div className="px-1 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Estudiantes</h2>
        <AddStudentDialog onAddStudent={handleAddStudent} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No hay estudiantes registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AddStudentDialog({
  onAddStudent,
}: {
  onAddStudent: (student: Student) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (name && email) {
      onAddStudent({ id: "", name, email });
      setName("");
      setEmail("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Registrar Estudiante</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Estudiante</DialogTitle>
          <DialogDescription>
            Complete la información para registrar un nuevo estudiante.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nombre del estudiante"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Registrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
