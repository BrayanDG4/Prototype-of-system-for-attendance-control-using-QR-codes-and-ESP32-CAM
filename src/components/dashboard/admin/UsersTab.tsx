import React from "react";
import { DashboardTabWrapper } from "@/components/common/DashboardTabWrapper";

export const AdminUsersTab: React.FC = () => {
  return (
    <DashboardTabWrapper>
      <h2 className="text-lg font-bold">Manage Users</h2>
      <p className="text-muted-foreground">
        Create, edit, and manage system users.
      </p>
    </DashboardTabWrapper>
  );
};
