"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Switch } from "@radix-ui/react-switch";

export function MyAccount() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    role: "",
  });
  const { toast } = useToast();
  const { user } = useUser();

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `/api/get-user-profile?userId=${user?.id}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }
        const data = await response.json();
        setProfileData({
          name: data.name || "",
          fullName: data.fullName || data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          role: data.role || "",
        });
        setProfileImage(user?.imageUrl || "");
      } catch (error) {
        toast({
          description: `Error al cargar los datos del perfil: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user, toast]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;
    setProfileData({ ...profileData, [id]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          ...profileData,
          profileImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo actualizar el perfil");
      }

      toast({ description: "Perfil actualizado exitosamente." });
    } catch (error) {
      toast({
        description: `Error al actualizar el perfil: ${
          (error as Error).message
        }`,
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs defaultValue="personal-info" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal-info">Información Personal</TabsTrigger>
        <TabsTrigger value="security">Seguridad</TabsTrigger>
        <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        <TabsTrigger value="danger-zone">Zona de Peligro</TabsTrigger>
      </TabsList>

      {/* Tab: Información Personal */}
      <TabsContent value="personal-info">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Actualiza tu información personal y foto de perfil.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24 cursor-pointer">
                <AvatarImage src={profileImage || ""} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  JPG, GIF o PNG. Máximo 1MB.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  placeholder="Juan Pérez"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="300 000 0000"
                  value={profileData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled // No editable
                />
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  placeholder="Calle Ejemplo, 123, 28001 Madrid"
                  value={profileData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="cursor-pointer">
              Guardar Cambios
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Seguridad */}
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Seguridad</CardTitle>
            <CardDescription>
              Gestiona tu contraseña y la seguridad de tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="confirm-password">
                Confirmar Nueva Contraseña
              </Label>
              <Input id="confirm-password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="cursor-pointer">Cambiar Contraseña</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Notificaciones */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>
              Configura cómo y cuándo quieres recibir notificaciones.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Notificaciones por Correo</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe actualizaciones importantes por correo electrónico.
                </p>
              </div>
              <Switch className="cursor-pointer" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Notificaciones Push</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe notificaciones push en tu dispositivo.
                </p>
              </div>
              <Switch className="cursor-pointer" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Zona de Peligro */}
      <TabsContent value="danger-zone">
        <Card>
          <CardHeader>
            <CardTitle>Zona de Peligro</CardTitle>
            <CardDescription>
              Acciones irreversibles relacionadas con tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Eliminar Cuenta</Label>
                <p className="text-sm text-muted-foreground">
                  Elimina permanentemente tu cuenta y todos tus datos.
                </p>
              </div>
              <Button variant="destructive" className="cursor-pointer">
                Eliminar Cuenta
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
