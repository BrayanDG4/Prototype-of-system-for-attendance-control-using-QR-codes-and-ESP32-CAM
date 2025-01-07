export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="student-layout">
      <header>
        <h2>Student Dashboard</h2>
      </header>
      <main>{children}</main>
    </div>
  );
}
