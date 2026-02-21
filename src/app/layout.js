import { Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
// import { Toaster } from 'sonner' // Removed dependency

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata = {
  title: 'Zipo Fresh - Grocery Delivery',
  description: 'Fresh groceries delivered to your doorstep.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {/* Sticky Navbar */}
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 bg-gray-50 text-gray-900 pt-20 md:pt-24">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
