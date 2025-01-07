export default function ClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="classes-layout">
      <h3>Class Management</h3>
      {children}
    </div>
  );
}
