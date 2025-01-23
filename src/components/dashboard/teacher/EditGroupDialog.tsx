import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { daysOfWeek } from "@/lib/constants/daysOfweek";

export default function EditGroupDialog({ groupData, onEdit }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    defaultValues: groupData,
  });

  const { fields, append, remove } = useFieldArray({
    name: "schedule",
    control: form.control,
  });

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(
        `http://localhost:4000/class-group/${groupData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedGroup = await response.json();
      onEdit(updatedGroup);
      setIsOpen(false);
    } catch (error) {
      console.error("Error al actualizar el grupo:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Grupo de Clase</DialogTitle>
          <DialogDescription>
            Actualice los detalles del grupo de clase.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label>Nombre</label>
            <Input {...form.register("name")} />
          </div>
          <div>
            <label>Salón</label>
            <Input {...form.register("room")} />
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex space-x-4">
              <div>
                <label>Día</label>
                <select {...form.register(`schedule.${index}.day`)}>
                  {daysOfWeek.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Hora de Inicio</label>
                <Input
                  type="time"
                  {...form.register(`schedule.${index}.startTime`)}
                />
              </div>
              <div>
                <label>Hora de Fin</label>
                <Input
                  type="time"
                  {...form.register(`schedule.${index}.endTime`)}
                />
              </div>
              <Button onClick={() => remove(index)}>Eliminar</Button>
            </div>
          ))}
          <Button type="submit">Guardar Cambios</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
