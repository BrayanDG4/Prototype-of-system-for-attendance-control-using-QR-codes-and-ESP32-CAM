"use client";

import { useEffect, useRef, useState } from "react";

export default function QRScanner() {
  const [scanned, setScanned] = useState("");
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "loading"
  >("idle");
  const [message, setMessage] = useState("");
  const [locked, setLocked] = useState(false);
  const [lastToken, setLastToken] = useState<string | null>(null);

  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);
  const inactiveSoundRef = useRef<HTMLAudioElement | null>(null);
  const duplicateSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    successSoundRef.current = new Audio("/sounds/ACCESO_CORRECTO.mp3");
    errorSoundRef.current = new Audio("/sounds/INTENTE_DE_NUEVO.mp3");
    inactiveSoundRef.current = new Audio("/sounds/ASISTENCIA_NO_ACTIVA.mp3");
    duplicateSoundRef.current = new Audio(
      "/sounds/ASISTENCIA_YA_REGISTRADA.mp3"
    );
  }, []);

  const playSound = (ref: React.RefObject<HTMLAudioElement | null>) => {
    const audio = ref.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn("No se pudo reproducir el sonido:", err);
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (locked) return;

      if (e.key === "Enter") {
        const cleaned = scanned.replace(/[^a-zA-Z0-9@:.T\-]/g, "");
        console.log("[📦 Código limpio]:", cleaned);
        processScan(cleaned.trim());
        setScanned("");
      } else if (e.key.length === 1) {
        setScanned((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [scanned, locked]);

  const processScan = async (input: string) => {
    const parsed = parseFormattedQR(input);

    if (!parsed || !parsed.token) {
      setStatus("error");
      setMessage("❌ Formato inválido del código QR.");
      playSound(errorSoundRef);
      return;
    }

    setLocked(true);
    setStatus("loading");
    setMessage("⌛ Registrando asistencia...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BACKEND_URL}/esp32-attendance/record`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: parsed.token }),
        }
      );

      const data = await res.json();
      setLastToken(parsed.token);

      if (data.success) {
        setStatus("success");
        setMessage("✅ Asistencia registrada correctamente.");
        playSound(successSoundRef);
      } else {
        setStatus("error");
        setMessage(`❌ ${data.message}`);
        const msg = data.message?.toLowerCase() || "";
        if (
          msg.includes("ya se ha registrado") ||
          msg.includes("asistencia duplicada")
        ) {
          playSound(duplicateSoundRef);
        } else if (
          msg.includes("no está habilitada") ||
          msg.includes("asistencia no activa")
        ) {
          playSound(inactiveSoundRef);
        } else {
          playSound(errorSoundRef);
        }
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      setStatus("error");
      setMessage("❌ Error al conectar con el servidor.");
      playSound(errorSoundRef);
    }

    setTimeout(() => {
      setLocked(false);
      setStatus("idle");
      setMessage("");
      setLastToken(null);
    }, 3000);
  };

  const parseFormattedQR = (text: string): { token: string } | null => {
    try {
      const match = text.match(/T(.+)$/); // busca firmaA... al final
      if (!match) return null;
      return { token: match[1] };
    } catch {
      return null;
    }
  };

  return (
    <div className="p-6 border rounded-md shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">
        📲 Registro de Asistencia por QR
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Escanea el código QR con el lector. La lectura se registrará
        automáticamente.
      </p>

      <div className="font-mono text-sm bg-gray-100 p-2 rounded mb-2">
        <span className="text-gray-400">Entrada:</span> {scanned || "..."}
      </div>

      {lastToken && (
        <div className="text-xs text-gray-500 mb-2 break-all">
          <strong>🔑 Token:</strong> {lastToken}
        </div>
      )}

      {status !== "idle" && (
        <div
          className={`text-sm font-semibold mt-2 ${
            status === "success"
              ? "text-green-600"
              : status === "error"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
