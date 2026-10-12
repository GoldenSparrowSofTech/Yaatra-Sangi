import Link from 'next/link';

export default function Home() {
  return (
    <main 
      className="relative min-h-screen bg-slate-950 overflow-x-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.6), rgba(2, 6, 23, 0.9)), url('https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-blob animation-delay-4000"></div>

      {/* Floating Logo Top Left (Below Header) */}
      <div className="absolute top-24 left-6 md:left-12 z-50 hidden sm:block">
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl">
          <img 
            src="/yatrasangi_logo.png" 
            alt="YaatraSangi Logo" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-xl" 
          />
          <div className="text-left hidden lg:block pr-2">
            <div className="text-xl font-black leading-tight">
              <span className="text-[#0d59a8]">Yaatra</span><span className="text-[#f97316]">Sangi</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-400 italic">Your Journey. Your Companion.</div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center min-h-[90vh] animate-fade-in-up">
        
        {/* Floating Badge */}
        <div className="inline-flex items-center px-4 py-2 mb-8 text-sm font-bold rounded-full text-indigo-300 glass-panel border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)] animate-pulse-slow">
          <span className="flex w-2.5 h-2.5 rounded-full bg-indigo-400 mr-2 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
          Your Journey. Your Companion.
        </div>
        
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 leading-tight w-full px-2">
          <span className="text-white">Experience </span>
          <br className="md:hidden" />
          <span className="inline-block drop-shadow-2xl font-black">
            <span className="text-[#0d59a8]">Yaatra</span><span className="text-[#f97316]">Sangi</span>
          </span>
        </h1>
        <p className="text-lg md:text-2xl font-semibold text-sky-300 mb-6 tracking-wide italic">
          "Your Journey. Your Companion."
        </p>
        
        {/* Sub-headline */}
        <p className="max-w-2xl text-lg sm:text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed font-light drop-shadow-md px-2">
          Zero commissions. Direct bookings. Intelligent AI routing.
          <br/>Your ultimate personalized travel companion.
        </p>
        
        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-5 w-full justify-center mt-2 items-center">
          <Link href="/plan" className="group relative px-8 py-5 text-lg font-bold text-white transition-all bg-indigo-600 rounded-2xl hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(99,102,241,0.4)] active:scale-95 flex items-center justify-center gap-3 w-full sm:w-auto overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            ✨ Start AI Planning
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>

        {/* Secondary Quick Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-6xl justify-center mt-12">
          <Link href="/destinations" className="glass-panel px-6 py-5 text-md font-semibold text-slate-200 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">📍</span>
            Destinations
          </Link>
          <Link href="/hotels" className="glass-panel px-6 py-5 text-md font-semibold text-slate-200 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🏨</span>
            Hotels
          </Link>
          <Link href="/taxi" className="glass-panel px-6 py-5 text-md font-semibold text-slate-200 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🚕</span>
            Outstation Cabs
          </Link>
          <Link href="/restaurants" className="glass-panel px-6 py-5 text-md font-semibold text-slate-200 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🍽️</span>
            Restaurants
          </Link>
          <Link href="/local-rides" className="relative px-6 py-5 text-md font-semibold text-yellow-100 rounded-2xl transition-all flex flex-col items-center justify-center gap-2 group bg-yellow-500/10 border border-yellow-400/50 hover:bg-yellow-500/20 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] shadow-[0_0_15px_rgba(250,204,21,0.2)] overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500/20 text-red-400 text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-red-500/30">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> LIVE
            </div>
            <div className="flex items-center justify-center gap-1 group-hover:scale-110 transition-transform mb-1 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
              <span className="text-4xl -mr-2 z-10">🛺</span>
              <span className="text-3xl -mr-2 z-20 mt-2">🛵</span>
              <span className="text-3xl z-30">🚗</span>
            </div>
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text font-black tracking-wide">Local Rides</span>
          </Link>
          <Link href="/tour-packages" className="glass-panel px-6 py-5 text-md font-semibold text-slate-200 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🌴</span>
            Tour Packages
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 border-t border-slate-800/50">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Why <span className="text-[#0d59a8]">Yaatra</span><span className="text-[#f97316]">Sangi</span>?</h2>
          <p className="text-xl text-slate-400">The most transparent way to travel. Your Journey. Your Companion.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: '0% Commission', desc: 'Book directly with local businesses. We charge absolutely zero platform fees.', icon: '💸', color: 'from-emerald-500/20 to-teal-500/5', link: '/hotels' },
            { title: 'AI Routing', desc: 'Instantly generate multi-city travel routes that save you time and money.', icon: '🧠', color: 'from-indigo-500/20 to-purple-500/5', link: '/plan' },
            { title: 'Live Broadcast', desc: 'Request local rides and watch drivers compete to accept your trip instantly.', icon: '📡', color: 'from-yellow-500/20 to-orange-500/5', link: '/local-rides' },
          ].map((feature, i) => (
            <Link href={feature.link} key={i} className={`glass-panel p-8 rounded-3xl hover:bg-slate-800/80 transition-all hover:-translate-y-2 border-t border-t-white/10 bg-gradient-to-b ${feature.color} block group`}>
              <div className="text-5xl mb-6 bg-slate-900/50 w-20 h-20 flex items-center justify-center rounded-2xl border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full py-12 border-t border-slate-800/50 text-center glass-panel mt-20 rounded-t-3xl">
        <div className="text-2xl font-black tracking-tight mb-2">
          <span className="text-[#0d59a8]">Yaatra</span><span className="text-[#f97316]">Sangi</span>
        </div>
        <p className="text-slate-400 text-sm mb-1 font-medium italic">Your Journey. Your Companion.</p>
        <p className="text-slate-500 text-xs">&copy; 2026 YaatraSangi. Built with ❤️ for travelers.</p>
      </footer>
    </main>
  );
}
