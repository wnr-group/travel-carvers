import Navbar from '@/components/customer/Navbar'
import Footer from '@/components/customer/Footer'
import WhatsAppButton from '@/components/customer/WhatsAppButton'
import { MapOverlayProvider } from '@/components/customer/MapOverlayContext'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MapOverlayProvider>
      <Navbar />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
      <WhatsAppButton />
    </MapOverlayProvider>
  )
}
