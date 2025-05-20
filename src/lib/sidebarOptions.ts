import { BookOpen, Users, ClipboardList, FileText, Home } from "lucide-react";

export const sidebarOptions = {
  admin: [
    {
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: Home,
      items: null,
    },
    {
      label: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
      items: [
        { title: "Add User", href: "/dashboard/admin/users/add" },
        { title: "View Users", href: "/dashboard/admin/users/view" },
      ],
    },
    {
      label: "Reports",
      href: "/dashboard/admin/reports",
      icon: FileText,
      items: [
        { title: "Generate Report", href: "/dashboard/admin/reports/generate" },
        { title: "View All Reports", href: "/dashboard/admin/reports/view" },
      ],
    },
  ],
  teacher: [
    {
      label: "Dashboard",
      href: "/dashboard/teacher",
      icon: Home,
      items: null,
    },
    {
      label: "Groups",
      href: "/dashboard/teacher/groups",
      icon: BookOpen,
      items: null,
    },
    {
      label: "Attendance by Group",
      href: "/dashboard/teacher/attendance-by-group",
      icon: ClipboardList,
      items: null,
    },
  ],
  student: [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard/student",
    },
    {
      label: "Grupos",
      icon: BookOpen,
      href: "/dashboard/student/groups",
    },
    {
      label: "Reportes",
      icon: FileText,
      href: "/dashboard/student/reports",
    },
  ],
};
