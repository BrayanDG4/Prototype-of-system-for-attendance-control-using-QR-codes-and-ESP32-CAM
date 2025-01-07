"use client";

import { usePathname } from "next/navigation";

export default function ClassActionPage() {
  const pathname = usePathname();

  // Extraer la acción desde el pathname
  const action = pathname.split("/").pop(); // Obtiene la última parte de la ruta

  return (
    <div>
      <h1>
        {action === "add"
          ? "Add a New Class"
          : action === "view"
          ? "View Classes"
          : "Edit Class"}
      </h1>
    </div>
  );
}
