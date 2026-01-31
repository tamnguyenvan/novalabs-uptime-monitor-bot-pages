import { Terminal, Shield, Activity, Zap, Globe, BarChart3, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Navigation */}
      <nav className="border-b-2 border-black p-6 flex justify-between items-center sticky top-0 bg-white z-50">
        <div className="font-mono font-bold text-xl tracking-tighter">UPTIME_GUARD</div>
        <div className="hidden md:flex gap-8 font-mono text-sm font-bold uppercase">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
          <Link href="/login" className="hover:underline text-brand-red">Admin Dashboard</Link>
        </div>
        <Link href="/login" className="font-mono border-2 border-black px-4 py-1 text-sm font-bold hover:bg-black hover:text-white transition-colors">
          LOGIN
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 p-8 lg:p-24 items-center">
        <div>
          <h1 className="font-mono text-5xl lg:text-7xl font-bold leading-none mb-8">
            INFRASTRUCTURE <br />MONITORING <br />VIA TELEGRAM
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-md">
            Production-grade uptime monitoring. Instant alerts. Zero configuration. Deploy in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="https://t.me/UptimeGuardBot" className="bg-black text-white font-mono font-bold px-8 py-4 text-center hover:bg-gray-800 brutalist-shadow transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
              START MONITORING
            </Link>
            <button className="border-2 border-black font-mono font-bold px-8 py-4 hover:bg-gray-100 transition-colors">
              VIEW DOCS
            </button>
          </div>
          <div className="mt-12 inline-flex items-center gap-2 border-2 border-black px-4 py-2 font-mono text-xs font-bold uppercase">
            <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
            All Systems Operational
          </div>
        </div>
        <div className="border-2 border-black bg-gray-100 aspect-square relative overflow-hidden brutalist-shadow">
           <div className="absolute inset-0 grid-bg" />
           <div className="relative p-8 font-mono text-sm">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-black" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black" />
                <div className="w-3 h-3 rounded-full bg-green-500 border border-black" />
              </div>
              <div className="text-green-600">$ uptime-guard monitor add https://api.acme.com</div>
              <div className="mt-2">[INFO] Endpoint added to watch list</div>
              <div className="mt-1">[OK] Initial health check: 200 OK (142ms)</div>
              <div className="mt-4 text-brand-red font-bold">CRITICAL: api.acme.com is DOWN (502 Bad Gateway)</div>
              <div className="text-gray-500">Alert sent to @admin via Telegram</div>
           </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y-2 border-black bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x-2 divide-black border-x-0 md:border-x-2 border-black">
          {[
            { label: 'Uptime SLA', val: '99.97%' },
            { label: 'Check Interval', val: '5 MIN' },
            { label: 'Alert Latency', val: '< 2S' },
            { label: 'Monitoring', val: '24/7' },
          ].map((s, i) => (
            <div key={i} className="p-8 text-center border-b-2 md:border-b-0 border-black last:border-b-0">
              <div className="font-mono text-4xl font-bold mb-1">{s.val}</div>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto p-8 lg:p-24">
        <div className="mb-16">
          <div className="font-mono text-sm font-bold text-gray-500 uppercase mb-4 tracking-tighter">// CORE_CAPABILITIES</div>
          <h2 className="font-mono text-4xl font-bold uppercase">Built for Reliability</h2>
        </div>

        <div className="grid md:grid-cols-3 border-2 border-black">
          {[
            { title: 'Real-Time Monitoring', icon: <Activity />, desc: 'Continuous health checks every 5 minutes. Immediate detection of HTTP errors.' },
            { title: 'Instant Notifications', icon: <Zap />, desc: 'Sub-2-second alert delivery via Telegram with full incident context.' },
            { title: 'Zero Configuration', icon: <Terminal />, desc: 'Add endpoints in seconds with simple commands. No complex setup required.' },
            { title: 'Status Tracking', icon: <BarChart3 />, desc: 'Historical status data with detailed HTTP response codes and recovery time.' },
            { title: 'Multi-Site Support', icon: <Globe />, desc: 'Monitor up to 20 endpoints simultaneously from a single interface.' },
            { title: 'Identity Protection', icon: <Shield />, desc: 'Secure OAuth integration with Supabase and Telegram ID verification.' },
          ].map((f, i) => (
            <div key={i} className="p-10 border-black border-r-2 border-b-2 last:border-r-0 odd:border-r-2 group hover:bg-black hover:text-white transition-all cursor-default">
              <div className="mb-6 p-3 border-2 border-black inline-block group-hover:border-white">{f.icon}</div>
              <h3 className="font-mono text-xl font-bold mb-4 uppercase">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500 group-hover:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white p-12 lg:p-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 mb-12 border-b border-gray-800 pb-12">
           <div>
              <div className="font-mono font-bold text-2xl mb-6 tracking-tighter">UPTIME_GUARD</div>
              <p className="text-gray-400 max-w-sm font-light leading-relaxed">
                Production-grade infrastructure monitoring delivered via Telegram. Built for developers who need reliable uptime tracking without the complexity.
              </p>
           </div>
           <div className="grid grid-cols-2 gap-8 font-mono text-sm">
              <div>
                <h4 className="font-bold mb-4 text-white uppercase tracking-widest">Product</h4>
                <ul className="text-gray-500 flex flex-col gap-2">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Docs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-white uppercase tracking-widest">Legal</h4>
                <ul className="text-gray-500 flex flex-col gap-2">
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                  <li><a href="#" className="hover:text-white">SLA</a></li>
                </ul>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center font-mono text-xs text-gray-600 gap-4">
          <div>© 2026 UPTIME_GUARD. OPEN SOURCE.</div>
          <div className="flex gap-6 uppercase">
            <a href="#" className="hover:text-white">Github</a>
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">Telegram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}