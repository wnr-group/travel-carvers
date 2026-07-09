export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Add admin sidebar/navbar here later */}
      <main>{children}</main>
    </div>
  )
}
