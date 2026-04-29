"use client";

import { useState } from "react";
import { Brain, ChevronRight, CheckCircle, XCircle, Loader2, RefreshCw, Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizState {
  phase: "setup" | "loading" | "quiz" | "results";
  questions: Question[];
  answers: number[];
  currentQ: number;
  startTime: number;
  timeTaken: number;
}

export default function QuizPage() {
  const [moduleId, setModuleId] = useState("");
  const [state, setState] = useState<QuizState>({
    phase: "setup",
    questions: [],
    answers: [],
    currentQ: 0,
    startTime: 0,
    timeTaken: 0,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState("");

  const generateQuiz = async () => {
    if (!moduleId.trim()) {
      setError("Please enter a Module ID");
      return;
    }
    setError("");
    setState((s) => ({ ...s, phase: "loading" }));

    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId }),
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
    const score = state.questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0) / state.questions.length * 100;
    await fetch("/api/quiz-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, questions: state.questions, answers, score, timeTaken }),
    });
  };

  const score = state.questions.length > 0
    ? Math.round(state.answers.reduce((acc, a, i) => acc + (a === state.questions[i]?.correctIndex ? 1 : 0), 0) / state.questions.length * 100)
    : 0;

  const q = state.questions[state.currentQ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black flex items-center gap-3 mb-1">
          <Brain className="w-8 h-8 text-brand-400" />
          <span className="gradient-text">AI Quiz Generator</span>
        </h1>
        <p className="text-muted-foreground">Enter a module ID to generate an AI-powered quiz from its content</p>
      </div>

      {state.phase === "setup" && (
        <div className="glass rounded-2xl border border-border p-8">
          <label className="label text-base mb-2">Module ID</label>
          <p className="text-sm text-muted-foreground mb-4">
            Go to any course module and copy its ID from the URL, then paste it here.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="e.g. clxyz123abc456..."
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateQuiz()}
            />
            <button onClick={generateQuiz} className="btn-primary px-6">
              Generate Quiz
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          {/* Tips */}
          <div className="mt-6 p-4 bg-secondary rounded-xl border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-3">How it works</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">1.</span>
                Groq AI (LLaMA 3.3 70B) reads your module content
              </div>
              <div className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">2.</span>
                Generates 5 targeted multiple-choice questions
              </div>
              <div className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">3.</span>
                Get instant grading with detailed explanations
              </div>
            </div>
          </div>
        </div>
      )}

      {state.phase === "loading" && (
        <div className="glass rounded-2xl border border-border p-16 text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <Brain className="w-16 h-16 text-brand-400 animate-pulse" />
          </div>
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Generating your quiz...</h2>
          <p className="text-muted-foreground text-sm">Groq AI is analyzing your module content</p>
        </div>
      )}

      {state.phase === "quiz" && q && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Question {state.currentQ + 1} of {state.questions.length}</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Quiz in progress</span>
            </div>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-fill" style={{ width: `${((state.currentQ) / state.questions.length) * 100}%` }} />
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
                    {showExplanation && idx === q.correctIndex && <CheckCircle className="w-4 h-4 ml-auto text-green-400" />}
                    {showExplanation && idx === selectedAnswer && idx !== q.correctIndex && <XCircle className="w-4 h-4 ml-auto text-red-400" />}
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

      {state.phase === "results" && (
        <div className="glass rounded-2xl border border-border p-8 text-center">
          <div className={cn(
            "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-black",
            score >= 80 ? "bg-green-500/15 text-green-400" :
            score >= 60 ? "bg-yellow-500/15 text-yellow-400" :
            "bg-red-500/15 text-red-400"
          )}>
            {score}%
          </div>

          <Trophy className={cn("w-8 h-8 mx-auto mb-3", score >= 80 ? "text-yellow-400" : "text-muted-foreground")} />
          <h2 className="text-2xl font-black mb-2">
            {score >= 80 ? "Excellent! 🎉" : score >= 60 ? "Good job! 👍" : "Keep practicing! 💪"}
          </h2>
          <p className="text-muted-foreground mb-2">
            You scored <strong className="text-foreground">{Math.round(state.answers.filter((a, i) => a === state.questions[i]?.correctIndex).length)}/{state.questions.length}</strong> correctly
          </p>
          <p className="text-sm text-muted-foreground mb-8">Completed in {state.timeTaken}s</p>

          {/* Question breakdown */}
          <div className="space-y-2 mb-8 text-left">
            {state.questions.map((q, i) => (
              <div key={i} className={cn(
                "flex items-start gap-3 p-3 rounded-lg text-sm",
                state.answers[i] === q.correctIndex ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
              )}>
                {state.answers[i] === q.correctIndex
                  ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
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

          <div className="flex gap-3 justify-center">
            <button onClick={() => setState((s) => ({ ...s, phase: "setup" }))} className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
              New Quiz
            </button>
            <button onClick={generateQuiz} className="btn-primary">
              <RefreshCw className="w-4 h-4" />
              Retry Same Module
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
