"use client";

import Link from "next/link";
import { sidebarOptions } from "@/lib/sidebarOptions";

export default function StudentDashboardPage() {
  const options = sidebarOptions.student;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to the Student Dashboard</h1>
      <p className="text-muted-foreground">
        Manage the system efficiently. Select an option below:
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <Link
            key={option.label}
            href={option.href}
            className="flex flex-col items-center justify-center gap-4 p-6 text-center border rounded-lg shadow-sm hover:bg-gray-100"
          >
            {option.icon && <option.icon className="w-10 h-10 text-primary" />}
            <span className="text-lg font-semibold">{option.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
