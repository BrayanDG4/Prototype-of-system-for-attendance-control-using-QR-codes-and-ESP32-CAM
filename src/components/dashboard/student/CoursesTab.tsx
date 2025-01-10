import React from "react";
import { DashboardTabWrapper } from "@/components/common/DashboardTabWrapper";

export const StudentCoursesTab: React.FC = () => {
  return (
    <DashboardTabWrapper>
      <h2 className="text-lg font-bold">My Courses</h2>
      <p className="text-muted-foreground">View all your enrolled courses.</p>
    </DashboardTabWrapper>
  );
};
