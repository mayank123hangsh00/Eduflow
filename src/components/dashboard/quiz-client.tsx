"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain, ChevronRight, CheckCircle, XCircle, Loader2, RefreshCw,
  Trophy, Clock, BookOpen, ChevronDown, Sparkles, History, Play
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  duration: number;
}

interface CourseWithModules {
  courseId: string;
  courseTitle: string;
  category: string;
  modules: Module[];
}

interface RecentAttempt {
  moduleId: string;
  moduleTitle: string;
  courseTitle: string;
  score: number;
  createdAt: string;
}

interface QuizState {
  phase: "setup" | "loading" | "quiz" | "results";
  questions: Question[];
  answers: number[];
  currentQ: number;
  startTime: number;
  timeTaken: number;
  moduleTitle: string;
}

function formatScore(score: number) {
  if (score >= 80) return { label: "Excellent! 🎉", color: "text-green-400", bg: "bg-green-500/15" };
  if (score >= 60) return { label: "Good job! 👍", color: "text-yellow-400", bg: "bg-yellow-500/15" };
  return { label: "Keep practicing! 💪", color: "text-red-400", bg: "bg-red-500/15" };
}

// ─── Module Selector ────────────────────────────────────────────────────────
function ModuleSelector({
  coursesWithModules,
  selectedModuleId,
  onSelect,
}: {
  coursesWithModules: CourseWithModules[];
  selectedModuleId: string;
  onSelect: (moduleId: string, moduleTitle: string, courseTitle: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = coursesWithModules
    .flatMap((c) => c.modules.map((m) => ({ ...m, courseTitle: c.courseTitle })))
    .find((m) => m.id === selectedModuleId);

  const filtered = coursesWithModules
    .map((c) => ({
      ...c,
      modules: c.modules.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          c.courseTitle.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((c) => c.modules.length > 0);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
          open
            ? "border-brand-500/50 bg-brand-500/5"
            : "border-border bg-secondary hover:border-brand-500/30"
        )}
      >
        <div className="w-9 h-9 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-4 h-4 text-brand-400" />
        </div>
        <div className="flex-1 min-w-0">
          {selected ? (
            <>
              <div className="font-semibold text-sm truncate">{selected.title}</div>
              <div className="text-xs text-muted-foreground truncate">{selected.courseTitle}</div>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">Select a module to quiz on...</div>
          )}
        </div>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 z-20 rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden animate-fade-in">
            {/* Search */}
            <div className="p-3 border-b border-border">
              <input
                type="text"
                autoFocus
                className="input-field py-2 text-sm"
                placeholder="Search modules or courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No modules found</div>
              ) : (
                filtered.map((course) => (
                  <div key={course.courseId}>
                    <div className="px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-secondary/50 border-b border-border/50">
                      {course.courseTitle}
                      <span className="ml-2 text-brand-400/70 normal-case font-normal">{course.category}</span>
                    </div>
                    {course.modules.map((mod) => (
                      <button
                        key={mod.id}
                        onClick={() => {
                          onSelect(mod.id, mod.title, course.courseTitle);
                          setOpen(false);
                          setSearch("");
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border/30 last:border-0",
                          mod.id === selectedModuleId
                            ? "bg-brand-500/10 text-brand-300"
                            : "hover:bg-secondary text-foreground"
                        )}
                      >
                        <Play className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{mod.title}</div>
                          {mod.description && (
                            <div className="text-xs text-muted-foreground truncate">{mod.description}</div>
                          )}
                        </div>
                        {mod.id === selectedModuleId && (
                          <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function QuizClientPage({
  coursesWithModules,
  recentAttempts,
}: {
  coursesWithModules: CourseWithModules[];
  recentAttempts: RecentAttempt[];
}) {
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedModuleTitle, setSelectedModuleTitle] = useState("");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");

  const [state, setState] = useState<QuizState>({
    phase: "setup",
    questions: [],
    answers: [],
    currentQ: 0,
    startTime: 0,
    timeTaken: 0,
    moduleTitle: "",
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState("");

  const generateQuiz = async (moduleIdOverride?: string) => {
    const mid = moduleIdOverride ?? selectedModuleId;
    if (!mid) {
      setError("Please select a module first");
      return;
    }
    setError("");
    setState((s) => ({ ...s, phase: "loading" }));

    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: mid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate quiz");

      setState({
        phase: "quiz",
        questions: data.questions,
        answers: [],
        currentQ: 0,
        startTime: Date.now(),
        timeTaken: 0,
        moduleTitle: data.moduleTitle || selectedModuleTitle,
      });
      setSelectedAnswer(null);
      setShowExplanation(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz");
      setState((s) => ({ ...s, phase: "setup" }));
    }
  };

  const handleAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    const newAnswers = [...state.answers, selectedAnswer ?? -1];
    if (state.currentQ + 1 >= state.questions.length) {
      // eslint-disable-next-line react-hooks/purity
      const timeTaken = Math.round((Date.now() - state.startTime) / 1000);
      setState((s) => ({ ...s, answers: newAnswers, phase: "results", timeTaken }));
      saveAttempt(newAnswers, timeTaken);
    } else {
      setState((s) => ({ ...s, answers: newAnswers, currentQ: s.currentQ + 1 }));
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const saveAttempt = async (answers: number[], timeTaken: number) => {
    const score =
      (state.questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0) /
        state.questions.length) *
      100;
    await fetch("/api/quiz-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moduleId: selectedModuleId,
        questions: state.questions,
        answers,
        score,
        timeTaken,
      }),
    });
  };

  const score =
    state.questions.length > 0
      ? Math.round(
          (state.answers.reduce(
            (acc, a, i) => acc + (a === state.questions[i]?.correctIndex ? 1 : 0),
            0
          ) /
            state.questions.length) *
            100
        )
      : 0;

  const q = state.questions[state.currentQ];
  const scoreInfo = formatScore(score);
  const noModules = coursesWithModules.length === 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black flex items-center gap-3 mb-1">
          <Brain className="w-8 h-8 text-brand-400" />
          <span className="gradient-text">AI Quiz Generator</span>
        </h1>
        <p className="text-muted-foreground">
          Select any module from your enrolled courses to generate an AI-powered quiz
        </p>
      </div>

      {/* ── SETUP PHASE ── */}
      {state.phase === "setup" && (
        <div className="space-y-4">
          {noModules ? (
            <div className="glass rounded-2xl border border-border p-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="font-bold mb-2">No modules available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enroll in a course that has modules to start generating quizzes.
              </p>
              <Link href="/courses" className="btn-primary">Browse Courses</Link>
            </div>
          ) : (
            <div className="glass rounded-2xl border border-border p-8 space-y-6">
              {/* Module selector */}
              <div>
                <label className="label text-base mb-3 block">Choose a Module</label>
                <ModuleSelector
                  coursesWithModules={coursesWithModules}
                  selectedModuleId={selectedModuleId}
                  onSelect={(id, title, course) => {
                    setSelectedModuleId(id);
                    setSelectedModuleTitle(title);
                    setSelectedCourseTitle(course);
                    setError("");
                  }}
                />
              </div>

              {/* Selected module preview */}
              {selectedModuleId && (
                <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{selectedModuleTitle}</div>
                    <div className="text-xs text-muted-foreground">{selectedCourseTitle}</div>
                  </div>
                  <span className="text-xs text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full font-medium">
                    5 questions
                  </span>
                </div>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                onClick={() => generateQuiz()}
                disabled={!selectedModuleId}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Brain className="w-5 h-5" />
                Generate AI Quiz
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* How it works */}
              <div className="p-4 bg-secondary rounded-xl border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-3">How it works</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Select any module from your enrolled courses above",
                    "Groq AI (LLaMA 3.3 70B) reads the module content",
                    "Generates 5 targeted multiple-choice questions",
                    "Get instant grading with detailed explanations",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-brand-400 font-bold flex-shrink-0">{i + 1}.</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent attempts */}
          {recentAttempts.length > 0 && (
            <div className="glass rounded-2xl border border-border p-6">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Recent Quiz Attempts
              </h2>
              <div className="space-y-2">
                {recentAttempts.map((a, i) => {
                  const info = formatScore(a.score);
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary group">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0", info.bg, info.color)}>
                        {Math.round(a.score)}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{a.moduleTitle}</div>
                        <div className="text-xs text-muted-foreground">{a.courseTitle}</div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedModuleId(a.moduleId);
                          setSelectedModuleTitle(a.moduleTitle);
                          setSelectedCourseTitle(a.courseTitle);
                          generateQuiz(a.moduleId);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity btn-secondary py-1.5 text-xs px-3"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Retry
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── LOADING PHASE ── */}
      {state.phase === "loading" && (
        <div className="glass rounded-2xl border border-border p-16 text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <Brain className="w-16 h-16 text-brand-400 animate-pulse" />
          </div>
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Generating your quiz...</h2>
          <p className="text-muted-foreground text-sm">
            Groq AI is analyzing{" "}
            <span className="text-brand-300 font-semibold">{selectedModuleTitle}</span>
          </p>
        </div>
      )}

      {/* ── QUIZ PHASE ── */}
      {state.phase === "quiz" && q && (
        <div className="space-y-4">
          {/* Module title */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span className="truncate">{state.moduleTitle}</span>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {state.currentQ + 1} of {state.questions.length}
            </span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Quiz in progress</span>
            </div>
          </div>
          <div className="progress-bar h-2">
            <div
              className="progress-fill"
              style={{ width: `${(state.currentQ / state.questions.length) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <div className="glass rounded-2xl border border-border p-8">
            <h2 className="text-xl font-bold mb-6 leading-relaxed">{q.question}</h2>

            <div className="space-y-3 mb-6">
              {q.options.map((opt, idx) => {
                let style = "border-border bg-secondary hover:border-brand-500/50 hover:bg-brand-500/5";
                if (showExplanation) {
                  if (idx === q.correctIndex) style = "border-green-500/50 bg-green-500/10 text-green-300";
                  else if (idx === selectedAnswer) style = "border-red-500/50 bg-red-500/10 text-red-300";
                  else style = "border-border bg-secondary opacity-50";
                } else if (selectedAnswer === idx) {
                  style = "border-brand-500/70 bg-brand-500/15";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showExplanation}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 text-sm",
                      style
                    )}
                  >
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                    {showExplanation && idx === q.correctIndex && (
                      <CheckCircle className="w-4 h-4 ml-auto text-green-400" />
                    )}
                    {showExplanation && idx === selectedAnswer && idx !== q.correctIndex && (
                      <XCircle className="w-4 h-4 ml-auto text-red-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl mb-6 text-sm">
                <span className="font-semibold text-brand-300 block mb-1">💡 Explanation</span>
                <span className="text-muted-foreground">{q.explanation}</span>
              </div>
            )}

            {showExplanation && (
              <button onClick={nextQuestion} className="btn-primary w-full justify-center py-3">
                {state.currentQ + 1 >= state.questions.length ? "See Results" : "Next Question"}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── RESULTS PHASE ── */}
      {state.phase === "results" && (
        <div className="glass rounded-2xl border border-border p-8 text-center">
          <div
            className={cn(
              "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-black",
              scoreInfo.bg,
              scoreInfo.color
            )}
          >
            {score}%
          </div>

          <Trophy
            className={cn(
              "w-8 h-8 mx-auto mb-3",
              score >= 80 ? "text-yellow-400" : "text-muted-foreground"
            )}
          />
          <h2 className="text-2xl font-black mb-2">{scoreInfo.label}</h2>
          <p className="text-muted-foreground mb-2">
            You scored{" "}
            <strong className="text-foreground">
              {state.answers.filter((a, i) => a === state.questions[i]?.correctIndex).length}/
              {state.questions.length}
            </strong>{" "}
            correctly
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            Module: <span className="text-foreground font-medium">{state.moduleTitle}</span>
          </p>
          <p className="text-sm text-muted-foreground mb-8">Completed in {state.timeTaken}s</p>

          {/* Question breakdown */}
          <div className="space-y-2 mb-8 text-left">
            {state.questions.map((q, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg text-sm",
                  state.answers[i] === q.correctIndex
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                )}
              >
                {state.answers[i] === q.correctIndex ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-medium">{q.question}</div>
                  {state.answers[i] !== q.correctIndex && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Correct: {q.options[q.correctIndex]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => setState((s) => ({ ...s, phase: "setup" }))}
              className="btn-secondary"
            >
              <RefreshCw className="w-4 h-4" />
              New Quiz
            </button>
            <button onClick={() => generateQuiz()} className="btn-primary">
              <RefreshCw className="w-4 h-4" />
              Retry Same Module
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
