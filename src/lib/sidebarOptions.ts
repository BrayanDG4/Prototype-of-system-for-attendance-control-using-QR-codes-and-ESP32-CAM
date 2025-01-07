import { Settings2, BookOpen, Bot } from "lucide-react";

export const sidebarOptions = {
  admin: [
    {
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: Settings2,
      items: [], // Vacío si no hay subitems
    },
    {
      label: "Users",
      href: "/dashboard/admin/users",
      icon: Bot,
      items: [
        {
          title: "Add User",
          href: "/dashboard/admin/users/add",
        },
        {
          title: "View Users",
          href: "/dashboard/admin/users/view",
        },
      ],
    },
  ],
  teacher: [
    {
      label: "Class Management",
      href: "/dashboard/teacher/classes",
      icon: BookOpen,
      items: [
        {
          title: "Add Class",
          href: "/dashboard/teacher/classes/add",
        },
        {
          title: "View Classes",
          href: "/dashboard/teacher/classes/view",
        },
      ],
    },
    {
      label: "Attendance",
      href: "/dashboard/teacher/attendance",
      icon: Settings2,
      items: [
        {
          title: "Enable Attendance",
          href: "/dashboard/teacher/attendance/enable",
        },
      ],
    },
  ],
  student: [
    {
      label: "My Courses",
      href: "/dashboard/student/courses",
      icon: BookOpen,
      items: [], // Sin subitems
    },
    {
      label: "Profile",
      href: "/dashboard/student/profile",
      icon: Settings2,
      items: [], // Sin subitems
    },
  ],
};
