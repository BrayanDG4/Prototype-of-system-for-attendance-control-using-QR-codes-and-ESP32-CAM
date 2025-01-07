export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="teacher-layout">
      <header>
        <h2>Teacher Dashboard</h2>
      </header>
      <main>{children}</main>
    </div>
  );
}
