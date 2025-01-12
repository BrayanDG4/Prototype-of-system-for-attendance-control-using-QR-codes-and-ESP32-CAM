"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/toast";

export function ProfileAlert({
  isProfileComplete,
}: {
  isProfileComplete: boolean;
}) {
  const { toast } = useToast();

  useEffect(() => {
    if (!isProfileComplete) {
      toast({
        title: "Perfil incompleto",
        description:
          "Por favor, completa tu perfil para acceder a todas las funcionalidades.",
        variant: "warning",
      });
    }
  }, [isProfileComplete, toast]);

  return null;
}
