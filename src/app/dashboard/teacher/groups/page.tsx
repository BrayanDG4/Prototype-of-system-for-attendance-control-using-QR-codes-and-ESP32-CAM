"use client";

import { useState } from "react";
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

const itemsPerPage = 5;

export default function TeacherGroups() {
  const [groups, setGroups] = useState([
    {
      name: "Cálculo 1",
      room: "Salón 112",
      schedule: [{ day: "monday", startTime: "06:00", endTime: "08:00" }],
      accessCode: "ad212212",
      attendanceEnabled: false,
    },
    {
      name: "Física 1",
      room: "Salón 113",
      schedule: [{ day: "tuesday", startTime: "10:00", endTime: "12:00" }],
      accessCode: "fy113456",
      attendanceEnabled: false,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateGroup = (data) => {
    setGroups((prev) => [...prev, data]);
  };

  const handleEnableAttendance = (groupIndex, duration) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = {
      ...updatedGroups[groupIndex],
      attendanceEnabled: true,
      duration,
    };
    setGroups(updatedGroups);
  };

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
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGroups.length > 0 ? (
              paginatedGroups.map((group, index) => (
                <TableRow key={index}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.room}</TableCell>
                  <TableCell>{group.accessCode}</TableCell>
                  <TableCell>
                    <ul>
                      {group.schedule.map((sch, i) => (
                        <li key={i}>
                          {sch.day}: {sch.startTime} - {sch.endTime}
                        </li>
                      ))}
                    </ul>
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
                <TableCell colSpan={5} className="text-center">
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
              className={`${
                currentPage === 1 ? "pointer-events-none text-gray-400" : ""
              }`}
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
                isActive={currentPage === i + 1}
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
              className={`${
                currentPage === totalPages
                  ? "pointer-events-none text-gray-400"
                  : ""
              }`}
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
