"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/actions/courses";
import { Sparkles, Loader2, AlertCircle, BookOpen, ArrowLeft, Wand2 } from "lucide-react";

const CATEGORIES = ["Web Development", "Data Science", "Design", "Business", "Marketing", "Mobile Dev", "DevOps", "Cybersecurity", "AI/ML", "Blockchain", "Other"];
const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export default function NewCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    difficulty: "BEGINNER" as typeof DIFFICULTIES[number],
    tags: [] as string[],
    price: 0,
    thumbnail: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await createCourse(form);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push(`/instructor/courses/${res.courseId}`);
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const generateWithAI = async () => {
    if (!form.title) {
      setError("Enter a course title first to use AI generation");
      return;
    }
    setAiLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, category: form.category, tags: form.tags }),
      });
      const data = await res.json();
      if (data.description) {
        setForm((f) => ({ ...f, description: data.description }));
      }
    } catch {
      setError("AI generation failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="btn-secondary py-2 px-3">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black">Create New Course</h1>
          <p className="text-sm text-muted-foreground">Use AI to generate content automatically</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl border border-border p-8 space-y-6">
        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="label">Course Title *</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Complete React.js Masterclass"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0">Description *</label>
            <button
              type="button"
              onClick={generateWithAI}
              disabled={aiLoading}
              className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium"
            >
              {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              {aiLoading ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <textarea
            className="input-field min-h-[120px] resize-none"
            placeholder="Describe what students will learn..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
            rows={5}
          />
          <p className="text-xs text-muted-foreground mt-1">
            <Sparkles className="w-3 h-3 inline mr-1 text-brand-400" />
            Click &quot;Generate with AI&quot; for a Groq-generated description
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Category *</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Difficulty *</label>
            <select
              className="input-field"
              value={form.difficulty}
              onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as typeof DIFFICULTIES[number] }))}
            >
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            />
            <button type="button" onClick={addTag} className="btn-secondary px-4">Add</button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((t) => (
                <span key={t} className="tag cursor-pointer" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))}>
                  {t} ×
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Price ($)</label>
            <input
              type="number"
              className="input-field"
              placeholder="0 for free"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <label className="label">Thumbnail URL</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://..."
              value={form.thumbnail}
              onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
            ) : (
              <><BookOpen className="w-4 h-4" /> Create Course</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
