import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Rocket,
  Brain,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  Gamepad2,
  Trophy,
  Users
} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-secondary/50">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[80px] animate-blob z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-tertiary/20 rounded-full blur-[80px] animate-blob animation-delay-2000 z-0 pointer-events-none"></div>

      {/* Floating Elements (Decorative) */}
      <div className="absolute top-[20%] left-[10%] animate-float-slow z-0 pointer-events-none opacity-50">
        <div className="w-16 h-16 bg-secondary border-3 border-border rounded-[2rem] shadow-[4px_4px_0_var(--border)] rotate-12 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-border" />
        </div>
      </div>
      <div className="absolute top-[30%] right-[15%] animate-float-fast z-0 pointer-events-none opacity-50">
        <div className="w-20 h-20 bg-primary border-3 border-border rounded-[2rem] shadow-[4px_4px_0_var(--border)] -rotate-6 flex items-center justify-center">
          <Brain className="w-10 h-10 text-white" />
        </div>
      </div>
      <div className="absolute bottom-[20%] left-[20%] animate-float-slow z-0 pointer-events-none opacity-50">
         <div className="w-14 h-14 bg-tertiary border-3 border-border rounded-full shadow-[4px_4px_0_var(--border)] rotate-45 flex items-center justify-center">
          <Rocket className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 pt-6 px-6 max-w-7xl mx-auto">
        <div className="h-20 bg-white border-3 border-border rounded-2xl shadow-[6px_8px_0_var(--border)] px-6 flex items-center justify-between animate-pop-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary border-2 border-border flex items-center justify-center shadow-[2px_2px_0_var(--border)] animate-wiggle">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-border">EduFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-bold text-border">
            <a href="#how-it-works" className="hover:text-primary transition-colors hover:scale-105 transform">How it Works</a>
            <a href="#features" className="hover:text-tertiary transition-colors hover:scale-105 transform">Features</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block font-bold text-border hover:text-primary transition-colors">
              Log In
            </Link>
            <Link href="/register" className="btn-edutech text-sm py-2 px-6">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-6">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="tag-edutech mb-8 animate-pop-in" style={{ animationDelay: "0.1s" }}>
              🎉 Learning just got an upgrade!
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] font-black tracking-tight text-border leading-[1.1] mb-8 animate-pop-in" style={{ animationDelay: "0.2s" }}>
              Master any topic <br className="hidden md:block" />
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-2 bg-secondary rounded-lg -rotate-2 border-3 border-border shadow-[4px_6px_0_var(--border)] z-[-1]"></span>
                <span className="relative z-10 px-2 text-border">with AI magic!</span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl font-semibold text-border/70 max-w-2xl mx-auto mb-12 animate-pop-in" style={{ animationDelay: "0.3s" }}>
              EduFlow makes studying incredibly fun and interactive. Auto-generate quizzes, chat with your AI tutor, and track your progress!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-pop-in" style={{ animationDelay: "0.4s" }}>
              <Link href="/register" className="btn-edutech text-xl py-4 px-10 group">
                Jump In Now!
                <Rocket className="w-6 h-6 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <Link href="#features" className="btn-edutech secondary text-xl py-4 px-10 group">
                Explore Platform
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section id="features" className="py-24 px-6 bg-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                Why you&apos;ll love EduFlow
              </h2>
              <p className="text-xl text-white/80 font-bold">Everything you need to learn faster and better.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="card-edutech bg-white p-8 group">
                <div className="w-16 h-16 rounded-2xl bg-primary border-3 border-border shadow-[4px_4px_0_var(--border)] flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:rotate-12 transition-all">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-border mb-4">Smart AI Quizzes</h3>
                <p className="text-lg font-semibold text-border/70">
                  Stop reading boring textbooks. Our AI instantly converts your modules into interactive quizzes that adapt to your skill level.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card-edutech bg-white p-8 group">
                <div className="w-16 h-16 rounded-2xl bg-secondary border-3 border-border shadow-[4px_4px_0_var(--border)] flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:-rotate-12 transition-all">
                  <Gamepad2 className="w-8 h-8 text-border" />
                </div>
                <h3 className="text-2xl font-black text-border mb-4">Interactive Learning</h3>
                <p className="text-lg font-semibold text-border/70">
                  Learning shouldn&apos;t feel like a chore. Enjoy an interface that feels more like a game than a classroom.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card-edutech bg-white p-8 group">
                <div className="w-16 h-16 rounded-2xl bg-tertiary border-3 border-border shadow-[4px_4px_0_var(--border)] flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:rotate-12 transition-all">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-border mb-4">Role Based Worlds</h3>
                <p className="text-lg font-semibold text-border/70">
                  Whether you are an Instructor building courses or a Student exploring them, get a dashboard built perfectly for your needs.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Big CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="card-edutech bg-secondary p-12 md:p-20 text-center relative overflow-hidden">
              {/* Decorative shapes inside CTA */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary rounded-full border-3 border-border opacity-20"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-tertiary rounded-lg border-3 border-border rotate-45 opacity-20"></div>

              <div className="w-24 h-24 mx-auto bg-white border-3 border-border rounded-full shadow-[4px_4px_0_var(--border)] flex items-center justify-center mb-8 animate-wiggle">
                <Trophy className="w-12 h-12 text-secondary" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-border mb-6">
                Ready to level up?
              </h2>
              <p className="text-2xl font-bold text-border/80 mb-10 max-w-xl mx-auto">
                Join the platform and start your first AI-powered course today!
              </p>
              <Link href="/register" className="btn-edutech bg-primary text-white text-2xl py-5 px-12 group">
                Let&apos;s Go!
                <ArrowRight className="w-8 h-8 ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-border py-12 px-6 border-t-8 border-primary">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-border" />
            </div>
            <span className="font-extrabold text-2xl text-white">EduFlow</span>
          </div>
          
          <div className="flex gap-6 font-bold text-white/70">
            <a href="https://github.com/mayank123hangsh00" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>

          <div className="font-bold text-white/50 bg-white/10 px-4 py-2 rounded-xl">
            Built for House of Edtech
          </div>
        </div>
      </footer>
    </div>
  );
}
