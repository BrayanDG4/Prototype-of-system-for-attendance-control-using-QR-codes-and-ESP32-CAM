import React from "react";
import { DashboardTabWrapper } from "@/components/common/DashboardTabWrapper";

export const TeacherClassesTab: React.FC = () => {
  return (
    <DashboardTabWrapper>
      <h2 className="text-lg font-bold">Class Management</h2>
      <p className="text-muted-foreground">
        View and manage your classes here.
      </p>
    </DashboardTabWrapper>
  );
};
