import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Brain,
  Sparkles,
  ArrowRight,
  Zap,
  Globe2,
  Layers,
  Fingerprint
} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 overflow-hidden relative">
      {/* Absolute Noise Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Insane Aurora Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-violet-600/20 blur-[120px] mix-blend-screen animate-aurora-1"></div>
        <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/20 blur-[120px] mix-blend-screen animate-aurora-2"></div>
        <div className="absolute -bottom-[20%] left-[10%] w-[80vw] h-[80vw] rounded-full bg-fuchsia-600/20 blur-[150px] mix-blend-screen animate-aurora-3"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full border border-white/10 bg-black/40 backdrop-blur-3xl supports-[backdrop-filter]:bg-black/20 shadow-2xl">
        <div className="px-6 flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-sm tracking-widest uppercase">EduFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#vision" className="text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Vision</a>
            <a href="#engine" className="text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Engine</a>
            <a href="#neural" className="text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Neural</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-white hover:text-white/70 transition-colors">
              Log In
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-20 px-6">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-spin-slow pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-reverse-spin pointer-events-none"></div>
          
          <div className="text-center max-w-5xl mx-auto relative z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-12 hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white] group-hover:scale-150 transition-transform"></div>
              <span className="text-xs font-bold tracking-widest uppercase text-white/80">LLaMA 3.3 Integrated</span>
            </div>
            
            <h1 className="text-[12vw] sm:text-[8vw] md:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/30 drop-shadow-2xl">
                LEARNING.
              </span>
              <br />
              <span className="relative inline-block mt-4">
                <span className="absolute -inset-2 bg-gradient-to-r from-violet-600 via-cyan-400 to-fuchsia-600 opacity-30 blur-2xl rounded-full"></span>
                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-cyan-300 to-fuchsia-400">
                  REIMAGINED.
                </span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-16 font-light leading-relaxed">
              Step into the future of education. An immersive, AI-driven reality where courses adapt to you in real-time, powered by cognitive neural processing.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative flex items-center gap-2">
                  ENTER THE SYSTEM <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-50">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Scroll to initialize</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
          </div>
        </section>

        {/* Spatial UI Grid */}
        <section id="vision" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20">
                SPATIAL ARCHITECTURE
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
              
              {/* Massive Bento Card 1 */}
              <div className="md:col-span-8 relative rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-duration-700"></div>
                <div className="absolute top-8 left-8">
                  <Brain className="w-10 h-10 text-white/50 mb-6 group-hover:text-violet-400 transition-colors duration-500" />
                  <h3 className="text-3xl font-bold tracking-tight mb-4">Neural Grading Core</h3>
                  <p className="text-white/50 max-w-sm leading-relaxed font-light">
                    Groq&apos;s LPU inference engine evaluates student input instantly, providing multi-dimensional feedback without latency.
                  </p>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full border border-white/5 bg-white/[0.01] flex items-center justify-center">
                   <div className="w-60 h-60 rounded-full border border-white/10 animate-spin-slow"></div>
                </div>
              </div>

              {/* Bento Card 2 */}
              <div className="md:col-span-4 relative rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-duration-700"></div>
                <div className="absolute top-8 left-8 right-8">
                  <Fingerprint className="w-10 h-10 text-white/50 mb-6 group-hover:text-cyan-400 transition-colors duration-500" />
                  <h3 className="text-2xl font-bold tracking-tight mb-3">Absolute Security</h3>
                  <p className="text-white/50 leading-relaxed font-light text-sm">
                    Military-grade JWT encryption. Your learning data is cryptographically sealed in our PostgreSQL vaults.
                  </p>
                </div>
              </div>

              {/* Bento Card 3 */}
              <div className="md:col-span-4 relative rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-bl from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-duration-700"></div>
                 <div className="absolute bottom-8 left-8 right-8">
                  <Globe2 className="w-10 h-10 text-white/50 mb-6 group-hover:text-fuchsia-400 transition-colors duration-500" />
                  <h3 className="text-2xl font-bold tracking-tight mb-3">Edge Deployed</h3>
                  <p className="text-white/50 leading-relaxed font-light text-sm">
                    Zero-latency UI delivery. React Server Components stream the interface directly from nodes closest to you.
                  </p>
                </div>
              </div>

              {/* Bento Card 4 */}
              <div className="md:col-span-8 relative rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                <div className="h-full flex flex-col justify-end p-8">
                  <Layers className="w-10 h-10 text-white/50 mb-6 group-hover:text-white transition-colors duration-500" />
                  <h3 className="text-3xl font-bold tracking-tight mb-4">Hyper-Dimensional RBAC</h3>
                  <p className="text-white/50 max-w-lg leading-relaxed font-light">
                    Instructors, Students, and Admins exist in entirely separate interface dimensions. Perfect separation of concerns.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Code Visualization Interface */}
        <section id="engine" className="py-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8 relative z-10">
              <h2 className="text-5xl font-black tracking-tighter">
                THE CORE <br />
                <span className="text-white/30">ALGORITHM.</span>
              </h2>
              <p className="text-xl text-white/50 font-light leading-relaxed">
                Beneath the surreal aesthetic lies a brutally efficient Prisma engine. The entire schema is mathematically optimized for real-time AI read/write operations.
              </p>
              <ul className="space-y-6 mt-12">
                {['Prisma ORM Synchronization', 'Vercel Edge Network Ready', 'Type-Safe Data Mutations'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg font-light group">
                    <div className="w-12 h-[1px] bg-white/20 group-hover:bg-white transition-colors"></div>
                    <span className="group-hover:text-white text-white/60 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 w-full relative">
              {/* Floating Holographic Terminal */}
              <div className="relative rounded-[2rem] border border-white/20 bg-black/50 backdrop-blur-3xl p-8 shadow-[0_0_100px_rgba(255,255,255,0.05)] transform rotate-y-[-10deg] rotate-x-[5deg] perspective-[1000px] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-1000">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <div className="ml-auto text-xs font-mono text-white/30 uppercase tracking-widest">Sys_Terminal</div>
                </div>
                <pre className="font-mono text-sm leading-loose overflow-x-auto text-white/70">
<span className="text-fuchsia-400">const</span> initNeuralLink <span className="text-cyan-400">=</span> <span className="text-fuchsia-400">async</span> () <span className="text-cyan-400">=&gt;</span> {'{'}
  <span className="text-fuchsia-400">const</span> engine <span className="text-cyan-400">=</span> <span className="text-fuchsia-400">await</span> <span className="text-violet-400">Groq</span>.connect({'{'}
    latency: <span className="text-green-400">&quot;zero&quot;</span>,
    model: <span className="text-green-400">&quot;llama-3.3-70b&quot;</span>
  {'}'});
  
  engine.<span className="text-violet-400">on</span>(<span className="text-green-400">&quot;data&quot;</span>, (stream) <span className="text-cyan-400">=&gt;</span> {'{'}
    <span className="text-white/40">{"// Render cognitive output instantly"}</span>
    UI.<span className="text-violet-400">inject</span>(stream);
  {'}'});
{'}'}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-6 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 pointer-events-none"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-[8vw] sm:text-[6vw] font-black tracking-tighter leading-none mb-12 uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
              Initialize.
            </h2>
            <Link href="/register" className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-black bg-white rounded-full overflow-hidden transition-all hover:scale-110 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)]">
              <span className="relative flex items-center gap-3 text-lg tracking-widest">
                START SEQUENCE <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />
              </span>
            </Link>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/5 py-12 px-6 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold uppercase tracking-widest text-white/30">
          <div>© {new Date().getFullYear()} EDUFLOW PROTOCOL</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="https://github.com/mayank123hangsh00" className="hover:text-white transition-colors">GitHub Repository</a>
          </div>
          <div>BUILT FOR HOUSE OF EDTECH</div>
        </div>
      </footer>
    </div>
  );
}
