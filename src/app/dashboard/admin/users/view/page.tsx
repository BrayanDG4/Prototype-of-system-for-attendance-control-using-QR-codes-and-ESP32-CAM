"use client";

import { useState, useEffect } from "react";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
  publicMetadata: {
    role: string;
  };
};

export default function ViewUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({
    key: "firstName",
    direction: "asc",
  });

  const limit = 10; // Número de usuarios por página

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users?page=${page}&limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
          setFilteredUsers(data.users); // Inicialmente mostrar todos los usuarios
          setTotal(data.total);
        } else {
          console.error("Error al obtener usuarios");
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  useEffect(() => {
    // Filtrar usuarios según la búsqueda
    const lowerCaseQuery = searchQuery.toLowerCase();
    setFilteredUsers(
      users.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(lowerCaseQuery) ||
          user.lastName?.toLowerCase().includes(lowerCaseQuery) ||
          user.emailAddresses[0]?.emailAddress
            .toLowerCase()
            .includes(lowerCaseQuery) ||
          user.publicMetadata.role.toLowerCase().includes(lowerCaseQuery)
      )
    );
  }, [searchQuery, users]);

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert("Usuario eliminado exitosamente");
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } else {
        alert("Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar usuario");
    }
  };

  const handleSort = (key: string) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    setFilteredUsers((prevUsers) =>
      [...prevUsers].sort((a, b) => {
        const aValue = a[key as keyof User] || "";
        const bValue = b[key as keyof User] || "";
        if (typeof aValue === "string" && typeof bValue === "string") {
          return direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      })
    );
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Lista de Usuarios</h2>
      <Input
        placeholder="Buscar por nombre, correo o rol"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("firstName")}
                className="cursor-pointer"
              >
                Nombre{" "}
                {sortConfig.key === "firstName" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("emailAddresses")}
                className="cursor-pointer"
              >
                Correo Electrónico{" "}
                {sortConfig.key === "emailAddresses" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("publicMetadata")}
                className="cursor-pointer"
              >
                Rol{" "}
                {sortConfig.key === "publicMetadata" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.firstName || "Sin nombre"} {user.lastName || ""}
                  </TableCell>
                  <TableCell>
                    {user.emailAddresses[0]?.emailAddress || "No disponible"}
                  </TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value) =>
                        fetch("/api/users", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            userId: user.id,
                            role: value,
                          }),
                        }).then(() =>
                          setFilteredUsers((prev) =>
                            prev.map((u) =>
                              u.id === user.id
                                ? { ...u, publicMetadata: { role: value } }
                                : u
                            )
                          )
                        )
                      }
                      value={user.publicMetadata.role}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.max(prev - 1, 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={page === index + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.min(prev + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
