import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  BookOpen,
  BrainCircuit,
  Database,
  ShieldCheck,
  ChevronRight,
  BarChart,
  Code2,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm tracking-tight">EduFlow Enterprise</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#platform" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Platform</a>
            <a href="#infrastructure" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Infrastructure</a>
            <a href="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="btn-primary text-xs px-4 py-1.5 h-8">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container mx-auto max-w-7xl px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-xs font-medium text-muted-foreground mb-8">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              EduFlow 2.0 is now generally available
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl mx-auto">
              The operating system for <br className="hidden sm:block" />
              <span className="text-muted-foreground">modern education.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              An enterprise-grade platform unifying course delivery, real-time AI generation, and granular access control into a single, highly-performant infrastructure.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary h-11 px-8">
                Deploy EduFlow
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
              <Link href="#infrastructure" className="btn-secondary h-11 px-8">
                View Documentation
              </Link>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="border-y border-border/40 bg-secondary/20 py-12">
          <div className="container mx-auto max-w-7xl px-6 text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-8">
              Trusted by innovative engineering teams
            </p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-50 grayscale">
              {/* Abstract logos representing enterprise companies */}
              <div className="flex items-center gap-2 font-bold text-xl"><Cpu className="w-6 h-6"/> Acme Corp</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Layers className="w-6 h-6"/> GlobalNet</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Database className="w-6 h-6"/> DataSystems</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Code2 className="w-6 h-6"/> TechFlow</div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="platform" className="py-24 md:py-32">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">A complete platform architecture.</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">Everything you need to scale your educational infrastructure, built on modern, type-safe primitives.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <BrainCircuit className="w-5 h-5" />,
                  title: "LLaMA 3.3 Integration",
                  desc: "Native integration with Groq's high-speed inference engine for real-time course generation and automated grading.",
                },
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  title: "Granular RBAC",
                  desc: "Enterprise role-based access control. Strictly typed authorization layers for Admins, Instructors, and Students.",
                },
                {
                  icon: <Database className="w-5 h-5" />,
                  title: "PostgreSQL & Prisma",
                  desc: "Fully relational data models managed via Prisma ORM, deployed on Supabase for edge-ready connection pooling.",
                },
                {
                  icon: <BarChart className="w-5 h-5" />,
                  title: "Real-time Telemetry",
                  desc: "Comprehensive dashboards providing immediate visibility into enrollment metrics, module completion, and AI usage.",
                },
                {
                  icon: <Code2 className="w-5 h-5" />,
                  title: "Next.js 16 App Router",
                  desc: "Built entirely on React Server Components and Server Actions for minimal client-side JavaScript execution.",
                },
                {
                  icon: <Layers className="w-5 h-5" />,
                  title: "Extensible Schema",
                  desc: "Designed to scale. Easily attach new models to the core User-Course-Enrollment architecture without downtime.",
                },
              ].map((f, i) => (
                <div key={i} className="group relative p-6 border border-border/50 rounded-lg bg-card hover:border-muted-foreground/50 transition-colors">
                  <div className="mb-4 text-foreground/70 group-hover:text-foreground transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deep Dive Section */}
        <section id="infrastructure" className="py-24 md:py-32 border-t border-border/40 bg-secondary/10">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">Built for performance at the edge.</h2>
                <div className="space-y-6 text-muted-foreground">
                  <p>
                    EduFlow abandons traditional monolithic architectures in favor of a globally distributed, serverless approach. By utilizing Next.js Server Components, we stream UI directly from the edge.
                  </p>
                  <p>
                    Our AI pipeline is powered by Groq, utilizing their LPU Inference Engine to deliver LLaMA 3.3 responses in under 500ms, making real-time study assistance imperceptible from native execution.
                  </p>
                </div>
                <div className="mt-8 flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <CheckIcon /> Zero-config deployment via Vercel
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <CheckIcon /> Fully typed end-to-end with TypeScript
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <CheckIcon /> Automated CI/CD pipelines
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-lg blur-xl"></div>
                <div className="relative border border-border/50 bg-background rounded-lg p-6 font-mono text-xs overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    <span className="ml-2 text-muted-foreground">schema.prisma</span>
                  </div>
                  <pre className="text-muted-foreground">
<span className="text-blue-400">model</span> <span className="text-green-400">Course</span> {'{'}
  id          <span className="text-blue-400">String</span>   @id @default(cuid())
  title       <span className="text-blue-400">String</span>
  description <span className="text-blue-400">String</span>   @db.Text
  category    <span className="text-blue-400">String</span>
  difficulty  <span className="text-green-400">Difficulty</span>
  published   <span className="text-blue-400">Boolean</span>  @default(false)
  price       <span className="text-blue-400">Float</span>    @default(0)
  
  instructor  <span className="text-green-400">User</span>     @relation(fields: [instructorId], references: [id])
  modules     <span className="text-green-400">Module</span>[]
  enrollments <span className="text-green-400">Enrollment</span>[]
{'}'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 md:py-32 border-t border-border/40">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Start building your educational infrastructure.
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Deploy your own instance of EduFlow in minutes. Fully open-source and ready for production.
            </p>
            <Link href="/register" className="btn-primary h-12 px-8 text-base">
              Create an Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/10 py-12">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded bg-foreground flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-background" />
                </div>
                <span className="font-semibold text-sm">EduFlow Enterprise</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                The modern, scalable, and AI-native platform for educational infrastructure.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Resources</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Architecture</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><a href="https://github.com/mayank123hangsh00" className="hover:text-foreground transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} EduFlow Inc. All rights reserved.</p>
            <p>Built for the House of Edtech Assignment</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}
