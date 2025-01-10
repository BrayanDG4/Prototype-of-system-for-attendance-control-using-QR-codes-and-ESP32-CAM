import React from "react";
import { DashboardTabWrapper } from "@/components/common/DashboardTabWrapper";

export const StudentProfileTab: React.FC = () => {
  return (
    <DashboardTabWrapper>
      <h2 className="text-lg font-bold">My Profile</h2>
      <p className="text-muted-foreground">
        Update and manage your profile here.
      </p>
    </DashboardTabWrapper>
  );
};
