import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Brain,
  Zap,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Shield,
  ExternalLink,
} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">EduFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm">Sign in</Link>
            <Link href="/register" className="btn-primary text-sm">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 border border-brand-500/30">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-sm text-brand-300 font-medium">AI-Powered Learning Platform</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tight">
            <span className="text-foreground">Learn Smarter</span>
            <br />
            <span className="gradient-text">with AI</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            EduFlow combines world-class courses with AI-powered quizzes and a personalized study assistant — turning passive learning into active mastery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register" className="btn-primary text-base px-8 py-3">
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/courses" className="btn-secondary text-base px-8 py-3">
              <BookOpen className="w-5 h-5" />
              Browse Courses
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["🧑‍💻", "👩‍🎓", "🧑‍🏫", "👨‍🔬"].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-brand-500/20 border-2 border-background flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
              <span>10,000+ students enrolled</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
              <span className="ml-1">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>500+ courses available</span>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute bottom-20 left-8 glass p-4 rounded-xl hidden xl:block animate-float" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Avg. completion rate</div>
              <div className="font-bold text-green-400">87%</div>
            </div>
          </div>
        </div>

        <div className="absolute top-32 right-8 glass p-4 rounded-xl hidden xl:block animate-float" style={{ animationDelay: "2s" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">AI quizzes generated</div>
              <div className="font-bold text-brand-300">50,000+</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="tag mb-4">
              <Zap className="w-3 h-3" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything you need to <span className="gradient-text">master anything</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From structured courses to AI-powered quizzes — EduFlow gives you all the tools to learn effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                color: "text-brand-400 bg-brand-500/15",
                title: "AI Quiz Generator",
                desc: "Groq-powered AI generates custom quiz questions from any module content in seconds. Get instant grading and detailed explanations.",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                color: "text-blue-400 bg-blue-500/15",
                title: "AI Study Assistant",
                desc: "Chat with an intelligent AI tutor that knows your course material. Get explanations, examples, and answers — streamed in real time.",
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                color: "text-cyan-400 bg-cyan-500/15",
                title: "Structured Courses",
                desc: "Professionally crafted courses with ordered modules, rich content, and video support — designed for real-world skill building.",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                color: "text-green-400 bg-green-500/15",
                title: "Progress Tracking",
                desc: "Visual dashboards to track your learning journey. See completion rates, quiz scores, and streaks at a glance.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                color: "text-orange-400 bg-orange-500/15",
                title: "Multi-Role Platform",
                desc: "Students learn, instructors teach, admins manage. Role-based dashboards with granular permissions for every user type.",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                color: "text-red-400 bg-red-500/15",
                title: "Secure & Scalable",
                desc: "Built with Next.js 15, Supabase PostgreSQL, JWT auth, Zod validation, and Row Level Security for production-grade safety.",
              },
            ].map((f, i) => (
              <div key={i} className="stat-card card-hover glow-on-hover">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="tag mb-4">
              <CheckCircle className="w-3 h-3" />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Start learning in <span className="gradient-text">3 steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-brand-500/50 to-brand-500/50" />

            {[
              { step: "01", title: "Create Account", desc: "Sign up as a student or instructor in seconds. No credit card required." },
              { step: "02", title: "Enroll in Courses", desc: "Browse our catalog and enroll in courses that match your goals." },
              { step: "03", title: "Learn with AI", desc: "Study modules, take AI-generated quizzes, and chat with your study assistant." },
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                <div className="w-24 h-24 rounded-2xl glass border border-brand-500/30 flex items-center justify-center mx-auto mb-6 glow">
                  <span className="text-3xl font-black gradient-text">{s.step}</span>
                </div>
                <h3 className="font-bold text-xl mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="tag mb-4">
              <Star className="w-3 h-3" />
              Testimonials
            </div>
            <h2 className="text-4xl font-black mb-4">
              Loved by <span className="gradient-text">learners worldwide</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", role: "Frontend Developer", text: "The AI quiz generator is a game-changer. I retained information 3x faster compared to just reading." },
              { name: "Rahul M.", role: "Data Scientist", text: "The study assistant answered my questions better than any Stack Overflow thread. Incredible tool." },
              { name: "Sarah K.", role: "UX Designer", text: "Clean interface, brilliant AI features. EduFlow genuinely makes you smarter, not just informed." },
            ].map((t, i) => (
              <div key={i} className="glass p-6 rounded-2xl border border-border card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center font-bold text-brand-300">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass p-12 rounded-3xl border border-brand-500/20 glow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-blue-500/5 pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-black mb-4 relative">
              Ready to <span className="gradient-text">level up?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 relative">
              Join thousands of learners mastering new skills with AI. It's free to start.
            </p>
            <Link href="/register" className="btn-primary text-lg px-10 py-4 relative">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold gradient-text">EduFlow</span>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Developed by <span className="text-foreground font-medium">Your Name</span></p>
            <p className="mt-1">Submission for House of Edtech — Fullstack Developer Assignment</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
