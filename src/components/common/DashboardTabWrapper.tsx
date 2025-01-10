import React from "react";

export const DashboardTabWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="p-4 bg-white rounded shadow">{children}</div>;
};
