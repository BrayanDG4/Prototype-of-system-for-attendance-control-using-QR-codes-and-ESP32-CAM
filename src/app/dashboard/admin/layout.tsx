export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <header>
        <h2></h2>
      </header>
      <main>{children}</main>
    </div>
  );
}
