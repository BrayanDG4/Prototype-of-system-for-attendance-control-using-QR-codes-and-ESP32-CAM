"use client";

import { PDFReportDownloader } from "@/components/dashboard/PDFReportDownloader";

export function ReportsSection() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Generar Reportes PDF</h3>
      <PDFReportDownloader />
    </div>
  );
}
