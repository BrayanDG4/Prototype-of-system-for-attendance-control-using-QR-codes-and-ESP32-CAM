export type RouteAccessMap = {
  [key: string]: string[];
};

// Mapeo de rutas y roles permitidos para el proyecto
export const routeAccessMap: RouteAccessMap = {
  // Rutas principales por rol
  "/dashboard/admin(.*)": ["admin"],
  "/dashboard/teacher(.*)": ["teacher"],
  "/dashboard/student(.*)": ["student"],

  // Otras rutas compartidas
  "/dashboard/list/teachers": ["admin", "teacher"],
  "/dashboard/list/students": ["admin", "teacher"],
  "/dashboard/list/parents": ["admin", "teacher"],
  "/dashboard/list/subjects": ["admin"],
  "/dashboard/list/classes": ["admin", "teacher"],
  "/dashboard/list/exams": ["admin", "teacher", "student", "parent"],
  "/dashboard/list/assignments": ["admin", "teacher", "student", "parent"],
  "/dashboard/list/results": ["admin", "teacher", "student", "parent"],
  "/dashboard/list/attendance": ["admin", "teacher", "student", "parent"],
  "/dashboard/list/events": ["admin", "teacher", "student", "parent"],
  "/dashboard/list/announcements": ["admin", "teacher", "student", "parent"],
};