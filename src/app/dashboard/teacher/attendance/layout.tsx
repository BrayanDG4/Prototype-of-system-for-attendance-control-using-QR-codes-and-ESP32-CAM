export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="attendance-layout">
      <h3>Attendance Management</h3>
      {children}
    </div>
  );
}
