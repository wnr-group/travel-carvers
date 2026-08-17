import Navbar from '@/components/customer/Navbar'
import Footer from '@/components/customer/Footer'
import WhatsAppButton from '@/components/customer/WhatsAppButton'
import TravelBackdrop from '@/components/customer/TravelBackdrop'
import { MapOverlayProvider } from '@/components/customer/MapOverlayContext'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MapOverlayProvider>
      {/* Fixed at -z-10 behind every customer page. Page wrappers are kept free of
          opaque backgrounds so it shows through. */}
      <TravelBackdrop />
      <Navbar />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
      <WhatsAppButton />
    </MapOverlayProvider>
  )
}
