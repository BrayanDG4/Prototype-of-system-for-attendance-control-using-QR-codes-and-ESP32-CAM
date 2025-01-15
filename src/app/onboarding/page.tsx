"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0); // Para manejar los reintentos
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const steps = [
    { text: "Verificando tu cuenta" },
    { text: "Asignando rol de usuario" },
    { text: "Configurando tu dashboard" },
    { text: "Preparando tu experiencia personalizada" },
  ];

  useEffect(() => {
    const handleRedirect = async () => {
      if (isLoaded && user) {
        const role = user.publicMetadata?.role;

        if (role) {
          // Redirigir al dashboard correspondiente después de 3 segundos
          setTimeout(() => {
            router.push(`/dashboard/${role}`);
          }, 3000);
        } else if (retryCount < 5) {
          // Intentar nuevamente después de 1 segundo si no hay rol
          setTimeout(() => setRetryCount((prev) => prev + 1), 1000);
        } else {
          // Si después de 5 intentos no se asigna un rol, mostrar mensaje
          setLoading(false);
        }
      }
    };

    handleRedirect();
  }, [user, isLoaded, retryCount, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      {loading ? (
        <MultiStepLoader loadingStates={steps} loading={true} />
      ) : (
        <p className="text-lg">
          No se pudo completar la asignación de rol. Por favor, recarga la
          página o contacta al soporte.
        </p>
      )}
    </div>
  );
}
