"use client";

import * as React from "react";
import { Settings2 } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarOptions } from "@/lib/sidebarOptions";

export function AppSidebar({
  role,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  role: "admin" | "teacher" | "student";
}) {
  // Define data directly here if it's not imported
  const data = {
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/avatars/default-avatar.png", // Ruta válida para una imagen de avatar
    },
    projects: [
      {
        name: "Design Engineering",
        url: "/projects/1",
        icon: Settings2,
      },
      {
        name: "Sales & Marketing",
        url: "/projects/2",
        icon: Settings2,
      },
    ],
    teams: [
      {
        name: "Team Alpha",
        logo: Settings2,
        plan: "Pro",
      },
    ],
  };

  const roleOptions = sidebarOptions[role] || [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={roleOptions.map((option) => ({
            title: option.label,
            url: option.href,
            icon: option.icon || Settings2,
            items: option.items || [],
          }))}
        />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
