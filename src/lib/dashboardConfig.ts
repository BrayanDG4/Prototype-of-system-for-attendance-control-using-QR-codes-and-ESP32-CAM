import { AdminGeneralTab } from "@/components/dashboard/admin/GeneralTab";
import { AdminUsersTab } from "@/components/dashboard/admin/UsersTab";
import { TeacherClassesTab } from "@/components/dashboard/teacher/ClassesTab";
import { TeacherAttendanceTab } from "@/components/dashboard/teacher/AttendanceTab";
import { StudentCoursesTab } from "@/components/dashboard/student/CoursesTab";
import { StudentProfileTab } from "@/components/dashboard/student/ProfileTab";

const GuestWelcomeTab = () => {
  return "Welcome to the Guest Dashboard";
};

export const dashboardConfig = {
  admin: {
    tabs: [
      { label: "General", content: AdminGeneralTab },
      { label: "Users", content: AdminUsersTab },
    ],
  },
  teacher: {
    tabs: [
      { label: "Classes", content: TeacherClassesTab },
      { label: "Attendance", content: TeacherAttendanceTab },
    ],
  },
  student: {
    tabs: [
      { label: "Courses", content: StudentCoursesTab },
      { label: "Profile", content: StudentProfileTab },
    ],
  },
  guest: {
    tabs: [
      {
        label: "Welcome",
        content: GuestWelcomeTab, // Componente funcional válido
      },
    ],
  },
};
