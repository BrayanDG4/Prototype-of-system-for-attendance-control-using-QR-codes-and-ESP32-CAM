import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DeleteGroupDialog({
  groupId,
  onDelete,
}: {
  groupId: string;
  onDelete: (groupId: string) => void;
}) {
  const handleDelete = () => {
    onDelete(groupId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Eliminar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
        </DialogHeader>
        <p>Esta acción no se puede deshacer. El grupo será eliminado.</p>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
