import Navbar from '@/components/customer/Navbar'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {/* Add customer footer here later */}
    </>
  )
}
