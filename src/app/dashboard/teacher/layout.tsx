export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="teacher-layout">
      <header>
        <h2 className="font-bold text-3xl pb-2"></h2>
      </header>
      <main>{children}</main>
    </div>
  );
}
