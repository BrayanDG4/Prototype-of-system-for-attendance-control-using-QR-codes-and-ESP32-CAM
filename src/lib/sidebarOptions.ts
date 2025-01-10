import { BookOpen, Users, ClipboardList, FileText, Home } from "lucide-react";

export const sidebarOptions = {
  admin: [
    {
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: Home, // Ícono de inicio
      items: null, // Directo, sin subitems
    },
    {
      label: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
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
    {
      label: "Reports",
      href: "/dashboard/admin/reports",
      icon: FileText,
      items: [
        {
          title: "Generate Report",
          href: "/dashboard/admin/reports/generate",
        },
        {
          title: "View All Reports",
          href: "/dashboard/admin/reports/view",
        },
      ],
    },
  ],
  teacher: [
    {
      label: "Dashboard",
      href: "/dashboard/teacher",
      icon: Home, // Ícono de inicio
      items: null, // Directo, sin subitems
    },
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
      icon: ClipboardList,
      items: [
        {
          title: "Enable Attendance",
          href: "/dashboard/teacher/attendance/enable",
        },
        {
          title: "Attendance Records",
          href: "/dashboard/teacher/attendance/records",
        },
      ],
    },
  ],
  student: [
    {
      label: "Dashboard",
      href: "/dashboard/student",
      icon: Home, // Ícono de inicio
      items: null, // Directo, sin subitems
    },
    {
      label: "My Courses",
      href: "/dashboard/student/courses",
      icon: BookOpen,
      items: [
        {
          title: "All Courses",
          href: "/dashboard/student/courses/all",
        },
        {
          title: "Enroll",
          href: "/dashboard/student/courses/enroll",
        },
      ],
    },
    {
      label: "Profile",
      href: "/dashboard/student/profile",
      icon: Users,
      items: [
        {
          title: "Edit Profile",
          href: "/dashboard/student/profile/edit",
        },
        {
          title: "Achievements",
          href: "/dashboard/student/profile/achievements",
        },
      ],
    },
  ],
};
