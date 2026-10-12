import './globals.css'
import 'leaflet/dist/leaflet.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Link from 'next/link'
import LanguageTranslator from '../components/LanguageTranslator'
import AuthStatus from '../components/AuthStatus'
import HeaderMenu from '../components/HeaderMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YaatraSangi | Your Journey. Your Companion.',
  description: 'Optimize your route, plan your stay, and book everything in one place with YaatraSangi.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            if (localStorage.getItem('theme') === 'light') {
              document.documentElement.classList.add('light-theme-forced');
            }
          `
        }} />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}>
        {/* Navigation Bar */}
        <header className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/10 safe-pt">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 shrink-0">
              <HeaderMenu />
              <img src="/yatrasangi_logo.png" alt="YaatraSangi Logo" className="w-9 h-9 rounded-xl object-contain bg-white/10 p-0.5 border border-white/20 shadow-md" />
              <span className="text-2xl font-black tracking-tight hidden sm:inline-block">
                <span className="text-[#0d59a8]">Yaatra</span><span className="text-[#f97316]">Sangi</span>
              </span>
            </div>
            <nav className="hidden 2xl:flex gap-3 text-[13px] font-medium text-slate-300 justify-center flex-1 px-2">
              <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">Home</Link>
              <Link href="/destinations" className="hover:text-white transition-colors whitespace-nowrap">Destinations</Link>
              <Link href="/plan" className="hover:text-white transition-colors whitespace-nowrap">Trip Planner</Link>
              <Link href="/hotels" className="hover:text-white transition-colors whitespace-nowrap">Hotels</Link>
              <Link href="/taxi" className="hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"><span className="text-white">🚕</span> Cabs</Link>
              <Link href="/restaurants" className="hover:text-white transition-colors whitespace-nowrap">Restaurants</Link>
              <Link href="/tour-packages" className="hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"><span className="text-emerald-400">🌴</span> Packages</Link>
            </nav>
            <div className="flex items-center shrink-0">
              <AuthStatus />
            </div>
          </div>
        </header>

        {/* Floating Language Translator */}
        <LanguageTranslator />

        {/* Main Content */}
        <div className="pt-20 min-h-screen">
          {children}
        </div>

        {/* Global Footer */}
        <footer className="bg-slate-950/90 backdrop-blur-md border-t border-slate-800 text-slate-300 py-12 relative z-50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/yatrasangi_logo.png" alt="YaatraSangi" className="w-8 h-8 rounded-lg object-contain bg-white/10 p-0.5" />
                <h2 className="text-xl font-black tracking-tight">
                  <span className="text-[#0d59a8]">Yaatra</span><span className="text-[#f97316]">Sangi</span>
                </h2>
              </div>
              <p className="text-sm text-slate-400 mb-2">Your ultimate companion for planning trips, booking stays, and finding reliable rides across India.</p>
              <p className="text-xs font-semibold italic text-sky-400">Your Journey. Your Companion.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/destinations" className="hover:text-white transition-colors">Top Destinations</Link></li>
                <li><Link href="/plan" className="hover:text-white transition-colors">Trip Planner AI</Link></li>
                <li><Link href="/hotels" className="hover:text-white transition-colors">Luxury Hotels</Link></li>
                <li><Link href="/taxi" className="hover:text-white transition-colors">Book a Cab</Link></li>
                <li className="pt-2 mt-2 border-t border-slate-800">
                  <Link href="/vendor" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1">
                    <span>💼</span> Partner Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Customer Reviews</h3>
              <div className="text-sm text-slate-400 space-y-3">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                  <p className="italic">&quot;Best travel planning app! Saved me hours of research.&quot;</p>
                  <span className="text-yellow-500 font-bold mt-1 block">★★★★★ - Rahul M.</span>
                </div>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 text-xs">Read more reviews &rarr;</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact & Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex flex-col gap-2">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="text-slate-500">📞</span> Customer Care:
                  </span>
                  <span className="text-white font-medium text-base ml-6">+91 93772 39439</span>
                  <div className="flex gap-2 ml-6 mt-1">
                    <a href="tel:+919377239439" className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-md shadow-indigo-600/20 w-24">
                      Call
                    </a>
                    <a href="https://wa.me/919377239439" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-md shadow-green-600/20 w-24">
                      WhatsApp
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-2 mt-2">
                  <span className="text-slate-500">✉️</span> Email: <br />
                  <a href="mailto:support@travelpartner.com" className="text-white hover:text-indigo-300">support@travelpartner.com</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} YaatraSangi. All rights reserved.</p>
            <div className="mt-6 md:mt-0 flex flex-col sm:flex-row items-center gap-3">
              <span className="text-sm font-medium text-slate-400">Developed with ❤️ by</span>
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gradient-to-r from-yellow-900/40 to-slate-900/80 px-5 py-2.5 rounded-full border border-yellow-500/50 shadow-[0_0_25px_rgba(234,179,8,0.3)] hover:shadow-[0_0_35px_rgba(234,179,8,0.5)] hover:scale-105 transition-all cursor-pointer">
                <img src="/logo.jpg" alt="Golden Sparrow Softech" className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                <div className="flex flex-col leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-500 font-black uppercase tracking-[0.2em] text-[13px] drop-shadow-md">Golden Sparrow</span>
                  <span className="text-yellow-500/90 text-[9px] uppercase tracking-[0.4em] font-bold mt-0.5">Softech</span>
                </div>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
