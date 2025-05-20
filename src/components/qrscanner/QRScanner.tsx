"use client";

import { useEffect, useState } from "react";

export default function QRScanner() {
  const [scanned, setScanned] = useState("");
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "loading"
  >("idle");
  const [message, setMessage] = useState("");
  const [locked, setLocked] = useState(false);
  const [lastParsed, setLastParsed] = useState<{
    email: string;
    classGroupId: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (locked) return;

      if (e.key === "Enter") {
        const cleaned = scanned.replace(/[^a-zA-Z0-9@:.°\-]/g, "");
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
    const parsed = parseQRString(input);
    console.log("[🔍 Objeto parseado]:", parsed);

    if (!parsed) {
      setStatus("error");
      setMessage("❌ Formato inválido del código QR.");
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
          body: JSON.stringify(parsed),
        }
      );

      const data = await res.json();
      setLastParsed(parsed);

      if (data.success) {
        setStatus("success");
        setMessage("✅ Asistencia registrada correctamente.");
      } else {
        setStatus("error");
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      setStatus("error");
      setMessage("❌ Error al conectar con el servidor.");
    }

    // 🔓 Desbloquear después de 3 segundos
    setTimeout(() => {
      setLocked(false);
      setStatus("idle");
      setMessage("");
      setLastParsed(null);
    }, 3000);
  };

  const parseQRString = (text: string) => {
    try {
      const emailMatch = text.match(/correoA(.*?)grupoA/);
      const groupMatch = text.match(/grupoA(.*?)fechaA/);
      const dateMatch = text.match(/fechaA(.+)$/);

      if (!emailMatch || !groupMatch || !dateMatch) return null;

      return {
        email: emailMatch[1].replace("arrob", "@"),
        classGroupId: groupMatch[1],
        timestamp: dateMatch[1],
      };
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

      {lastParsed && (
        <div className="text-xs text-gray-500 mb-2">
          <strong>📧 Correo:</strong> {lastParsed.email} <br />
          <strong>🆔 Grupo:</strong> {lastParsed.classGroupId} <br />
          <strong>🕒 Fecha:</strong> {lastParsed.timestamp}
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
