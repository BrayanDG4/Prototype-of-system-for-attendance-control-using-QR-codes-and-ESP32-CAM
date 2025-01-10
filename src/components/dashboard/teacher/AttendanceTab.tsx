import React from "react";
import { DashboardTabWrapper } from "@/components/common/DashboardTabWrapper";

export const TeacherAttendanceTab: React.FC = () => {
  return (
    <DashboardTabWrapper>
      <h2 className="text-lg font-bold">Attendance Management</h2>
      <p className="text-muted-foreground">
        Manage attendance for your classes here.
      </p>
      <div className="mt-4">
        <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Add Attendance
        </button>
      </div>
    </DashboardTabWrapper>
  );
};
