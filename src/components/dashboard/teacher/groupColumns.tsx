"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Group = {
  id: string;
  name: string;
  room: string;
  schedule: string;
  accessCode: string;
};

export const groupColumns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: "Nombre del Grupo",
  },
  {
    accessorKey: "room",
    header: "Salón",
  },
  {
    accessorKey: "schedule",
    header: "Horario",
  },
  {
    accessorKey: "accessCode",
    header: "Código de Acceso",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <button
        className="text-sm font-medium text-blue-500 hover:underline"
        onClick={() => alert(`Ver detalles de ${row.original.name}`)}
      >
        Detalles
      </button>
    ),
  },
];
