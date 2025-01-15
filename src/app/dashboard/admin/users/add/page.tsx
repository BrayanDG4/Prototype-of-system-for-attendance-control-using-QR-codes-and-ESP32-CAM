"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react"; // Iconos para mostrar/ocultar contraseña
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "student",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(""); // Indicador de fuerza de contraseña
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));

    // Evaluar fuerza de contraseña
    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (password: string) => {
    if (password.length < 6) {
      setPasswordStrength("Débil");
    } else if (password.length < 10) {
      setPasswordStrength("Media");
    } else {
      setPasswordStrength("Fuerte");
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.role) {
      setError("El correo y el rol son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard/admin/users/view");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error desconocido.");
      }
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold">Añadir Usuario</h2>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Correo Electrónico</span>
          <Input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Nombre</span>
          <Input
            type="text"
            name="firstName"
            placeholder="Nombre (opcional)"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Apellido</span>
          <Input
            type="text"
            name="lastName"
            placeholder="Apellido (opcional)"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>

        <label className="block relative">
          <span className="text-sm font-medium">Contraseña</span>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña (opcional)"
              value={formData.password}
              onChange={handleChange}
              className="pr-10" // Ajusta el espaciado para que no solape el botón
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formData.password && (
            <p
              className={`text-sm mt-1 ${
                passwordStrength === "Fuerte"
                  ? "text-green-600"
                  : passwordStrength === "Media"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              Fuerza: {passwordStrength}
            </p>
          )}
        </label>

        <label className="block">
          <span className="text-sm font-medium">Rol</span>
          <Select onValueChange={handleRoleChange} value={formData.role}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creando..." : "Crear Usuario"}
      </Button>
    </form>
  );
}
