import React from "react";
import { DashboardTabWrapper } from "@/components/common/DashboardTabWrapper";

export const AdminGeneralTab: React.FC = () => {
  return (
    <DashboardTabWrapper>
      <h2 className="text-lg font-bold">Admin General Tab</h2>
      <p className="text-muted-foreground">
        Overview of admin functionalities.
      </p>
    </DashboardTabWrapper>
  );
};
