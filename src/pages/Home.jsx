import { Link } from 'react-router-dom';
import { Terminal, ChevronRight, Activity, Cpu, Globe, ArrowUpRight, Zap } from 'lucide-react';
import { writeups } from '../data/writeups';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-green-500/30">
      {/* Background Decorative - Cahaya Halus */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto">
        
        {/* Header Section / Branding */}
        <section className="mb-24">
          <div className="flex items-center gap-3 text-green-500 font-mono text-xs mb-6">
            <Globe size={16} className="animate-pulse" />
            <span className="tracking-[0.3em] uppercase opacity-70">HTTP://akufarrel.dev/writeUp</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
            Farrel<span className="text-green-500">.</span>Athaillah
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed font-light mb-10">
            Cybersecurity Enthusiast & Fullstack Developer. 
            Arsip dokumentasi teknis, analisis forensik jaringan, dan catatan CTF.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="/" 
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-full text-sm font-mono text-slate-300 hover:text-white hover:border-slate-600 transition-all group"
            >
              <ArrowUpRight size={14} className="group-hover:text-green-400 transition-colors" />
              MAIN_PORTFOLIO
            </a>
            <div className="flex items-center gap-4 px-6 py-3 bg-green-500/5 border border-green-500/10 rounded-full">
              <span className="flex items-center gap-2 text-[10px] font-mono text-green-500/70 uppercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                System Stable
              </span>
            </div>
          </div>
        </section>

        {/* Writeups Feed Section */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg">
              <Terminal size={18} className="text-green-500" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-widest">Latest_Logs</h2>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {writeups.map((w) => (
              <Link 
                key={w.id} 
                to={`/writeup/${w.id}`} 
                className="group block relative p-8 bg-slate-900/30 border border-slate-800 rounded-2xl hover:border-green-500/30 transition-all hover:bg-slate-900/50"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap size={12} className="text-green-500 opacity-50" />
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Entry: {w.id}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors mb-3">
                      {w.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base line-clamp-2">
                      {w.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="flex flex-col items-end hidden md:flex">
                      <span className="text-[10px] font-mono text-slate-600">STATUS</span>
                      <span className="text-xs font-mono text-green-500">DECRYPTED</span>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 group-hover:border-green-500/50 transition-all">
                      <ChevronRight size={20} className="text-slate-500 group-hover:text-green-400 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Simple Footer Decorative */}
        <footer className="mt-32 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 font-mono text-[10px] tracking-widest uppercase">
            © 2026 Farrel Athaillah // Security Archive
          </p>
          <div className="flex items-center gap-6 text-slate-600">
             <div className="flex items-center gap-2">
                <Activity size={14} />
                <span className="font-mono text-[10px]">24ms</span>
             </div>
             <div className="flex items-center gap-2">
                <Cpu size={14} />
                <span className="font-mono text-[10px]">V8_Engine</span>
             </div>
          </div>
        </footer>
      </div>
    </div>
  );
}