"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2, Download } from "lucide-react";
import QRCode from "qrcode"; // <-- usamos esta

export default function GenerateQRPage() {
  const { user } = useUser();
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (user?.id) fetchGroups(user.id);
  }, [user]);

  useEffect(() => {
    if (qrValue && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrValue, {
        width: 300,
        margin: 2,
      });
    }
  }, [qrValue]);

  const fetchGroups = async (userId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BACKEND_URL}/class-group/enrolled/${userId}`
      );
      const data = await res.json();
      setGroups(data || []);
    } catch (error) {
      console.error("Error cargando grupos:", error);
    }
  };

  const generateQR = async () => {
    if (!user || !selectedGroup) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BACKEND_URL}/qr/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user?.primaryEmailAddress?.emailAddress,
            classGroupId: selectedGroup,
          }),
        }
      );

      const data = await response.json();
      setQrValue(data.qrString); // ✅ usamos qrString directo
    } catch (error) {
      console.error("Error al generar el QR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "codigo-qr-asistencia.png";
    a.click();
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Generar Código QR</h1>

      <label className="block text-sm text-left mb-1 font-medium">
        Selecciona tu grupo:
      </label>
      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        className="w-full border px-3 py-2 rounded-md mb-4"
      >
        <option value="">-- Selecciona un grupo --</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>

      <button
        onClick={generateQR}
        disabled={!selectedGroup || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Generar QR"}
      </button>

      {qrValue && (
        <div className="mt-6">
          <p className="mb-2 text-sm text-gray-600">
            Este código puede ser escaneado para registrar asistencia (válido
            por tiempo limitado).
          </p>
          <canvas ref={canvasRef} className="mx-auto border rounded" />
          <button
            onClick={handleDownload}
            className="mt-3 flex items-center justify-center gap-2 text-sm text-blue-600 underline"
          >
            <Download className="w-4 h-4" />
            Descargar QR
          </button>
          <p className="text-xs mt-2 text-gray-500 break-all">{qrValue}</p>
        </div>
      )}
    </div>
  );
}
