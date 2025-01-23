"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { daysOfWeek } from "@/lib/constants/daysOfweek";
import { groupSchema } from "@/lib/schemas/groupSchema";
import { z } from "zod";

type GroupFormData = z.infer<typeof groupSchema>;

export default function CreateGroupDialog({
  onCreate,
}: {
  onCreate: (data: GroupFormData) => void;
}) {
  const { user } = useUser(); // Obtener el usuario autenticado desde Clerk

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      room: "",
      schedule: [{ day: "", startTime: "", endTime: "" }],
      accessCode: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "schedule",
    control: form.control,
  });

  const onSubmit = async (data: GroupFormData) => {
    if (!user?.id) {
      console.error("No se encontró el ID del usuario autenticado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/class-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          teacherId: user.id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const createdGroup = await response.json();
      onCreate(createdGroup);
      form.reset();
    } catch (error) {
      console.error("Error al crear el grupo:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Crear Grupo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Grupo de Clase</DialogTitle>
          <DialogDescription>
            Complete la información para crear un nuevo grupo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Programación 1 - Grupo A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salón</FormLabel>
                  <FormControl>
                    <Input placeholder="Salón 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-4">
                <FormField
                  control={form.control}
                  name={`schedule.${index}.day`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Día</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un día" />
                          </SelectTrigger>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`schedule.${index}.startTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Inicio</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`schedule.${index}.endTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Fin</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="ghost"
                  onClick={() => remove(index)}
                  className="mt-6"
                >
                  Eliminar
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => append({ day: "", startTime: "", endTime: "" })}
              className="mt-4"
            >
              Agregar Horario
            </Button>
            <FormField
              control={form.control}
              name="accessCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Acceso</FormLabel>
                  <FormControl>
                    <Input placeholder="PG1A2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Crear Grupo</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
