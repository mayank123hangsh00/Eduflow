"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCourse, deleteCourse, publishCourse } from "@/actions/courses";
import { createModule, deleteModule } from "@/actions/modules";
import {
  ArrowLeft, Eye, EyeOff, Trash2, PlusCircle, BookOpen, Loader2,
  Edit3, Users, GripVertical, AlertCircle, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Module = {
  id: string;
  title: string;
  description: string | null;
  content: string;
  order: number;
  duration: number;
  videoUrl: string | null;
};

type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  published: boolean;
  tags: string[];
  price: number;
  thumbnail: string | null;
  modules: Module[];
  _count: { enrollments: number };
};

export function CourseManagerClient({ course: initial }: { course: Course }) {
  const router = useRouter();
  const [course, setCourse] = useState(initial);
  const [tab, setTab] = useState<"overview" | "modules">("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleForm, setModuleForm] = useState({
    title: "", description: "", content: "", videoUrl: "", duration: 0,
  });

  // Edit course state
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: course.title,
    description: course.description,
    category: course.category,
    difficulty: course.difficulty,
    tags: course.tags,
    price: course.price,
    thumbnail: course.thumbnail || "",
  });

  const showMsg = (type: "error" | "success", msg: string) => {
    if (type === "error") setError(msg);
    else setSuccess(msg);
    setTimeout(() => { setError(""); setSuccess(""); }, 3000);
  };

  const handlePublish = async () => {
    setLoading(true);
    const res = await publishCourse(course.id, !course.published);
    if (res.success) {
      setCourse((c) => ({ ...c, published: !c.published }));
      showMsg("success", `Course ${!course.published ? "published" : "unpublished"}`);
    } else showMsg("error", res.error || "Failed");
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    setLoading(true);
    const res = await deleteCourse(course.id);
    if (res.success) router.push("/instructor");
    else showMsg("error", res.error || "Failed to delete");
    setLoading(false);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    const res = await updateCourse(course.id, editForm);
    if (res.success) {
      setCourse((c) => ({ ...c, ...editForm, tags: editForm.tags }));
      setEditing(false);
      showMsg("success", "Course updated!");
    } else showMsg("error", res.error || "Failed to update");
    setLoading(false);
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createModule(course.id, moduleForm);
    if (res.success) {
      router.refresh();
      setShowModuleForm(false);
      setModuleForm({ title: "", description: "", content: "", videoUrl: "", duration: 0 });
      showMsg("success", "Module added!");
    } else showMsg("error", res.error || "Failed to add module");
    setLoading(false);
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module?")) return;
    const res = await deleteModule(moduleId);
    if (res.success) {
      setCourse((c) => ({ ...c, modules: c.modules.filter((m) => m.id !== moduleId) }));
      showMsg("success", "Module deleted");
    } else showMsg("error", res.error || "Failed");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="btn-secondary py-2 px-3">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black">{course.title}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className={`badge ${course.published ? "badge-beginner" : "badge-advanced"}`}>
                {course.published ? "Published" : "Draft"}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {course._count.enrollments} students
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/courses/${course.id}`} target="_blank" className="btn-secondary text-sm py-2">
            <Eye className="w-4 h-4" /> Preview
          </Link>
          <button onClick={handlePublish} disabled={loading} className="btn-secondary text-sm py-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : course.published ? <><EyeOff className="w-4 h-4" /> Unpublish</> : <><Eye className="w-4 h-4" /> Publish</>}
          </button>
          <button onClick={handleDelete} disabled={loading} className="btn-secondary text-sm py-2 hover:bg-destructive/20 hover:border-destructive/30 hover:text-red-400">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toasts */}
      {error && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-400">
          <CheckCircle className="w-4 h-4" /> {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit">
        {(["overview", "modules"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize", tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="glass rounded-2xl border border-border p-8">
          {!editing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Course Details</h2>
                <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-1.5">
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Category</div>
                  <div className="font-medium">{course.category}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Difficulty</div>
                  <div className="font-medium">{course.difficulty}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Price</div>
                  <div className="font-medium">{course.price === 0 ? "Free" : `$${course.price}`}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {course.tags.map((t) => <span key={t} className="tag text-xs">{t}</span>)}
                    {course.tags.length === 0 && <span className="text-muted-foreground">None</span>}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm mb-1">Description</div>
                <p className="text-sm leading-relaxed">{course.description}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Edit Course</h2>
              <div>
                <label className="label">Title</label>
                <input type="text" className="input-field" value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input-field min-h-[100px] resize-none" value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Difficulty</label>
                  <select className="input-field" value={editForm.difficulty} onChange={(e) => setEditForm((f) => ({ ...f, difficulty: e.target.value }))}>
                    {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Price ($)</label>
                  <input type="number" className="input-field" min="0" value={editForm.price} onChange={(e) => setEditForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSaveEdit} disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "modules" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{course.modules.length} Module{course.modules.length !== 1 ? "s" : ""}</h2>
            <button onClick={() => setShowModuleForm(true)} className="btn-primary text-sm">
              <PlusCircle className="w-4 h-4" /> Add Module
            </button>
          </div>

          {/* Module list */}
          {course.modules.length === 0 && !showModuleForm ? (
            <div className="glass rounded-2xl border border-border p-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground mb-4">No modules yet. Add your first module!</p>
              <button onClick={() => setShowModuleForm(true)} className="btn-primary">
                <PlusCircle className="w-4 h-4" /> Add Module
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {course.modules.map((mod, i) => (
                <div key={mod.id} className="glass rounded-xl border border-border p-4 flex items-center gap-4 group">
                  <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab" />
                  <div className="w-8 h-8 rounded-full bg-brand-500/15 flex items-center justify-center text-sm font-bold text-brand-300 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{mod.title}</div>
                    {mod.description && <div className="text-sm text-muted-foreground truncate">{mod.description}</div>}
                    <div className="text-xs text-muted-foreground mt-1 font-mono">ID: {mod.id}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteModule(mod.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity btn-secondary py-1.5 px-2 hover:bg-destructive/20 hover:border-destructive/30 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add module form */}
          {showModuleForm && (
            <form onSubmit={handleAddModule} className="glass rounded-2xl border border-brand-500/30 p-6 space-y-4">
              <h3 className="font-bold text-brand-300">New Module</h3>
              <div>
                <label className="label">Title *</label>
                <input type="text" className="input-field" placeholder="Module title" value={moduleForm.title} onChange={(e) => setModuleForm((f) => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Description</label>
                <input type="text" className="input-field" placeholder="Brief description" value={moduleForm.description} onChange={(e) => setModuleForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="label">Content *</label>
                <textarea className="input-field min-h-[150px] resize-none font-mono text-sm" placeholder="Module content (supports markdown)..." value={moduleForm.content} onChange={(e) => setModuleForm((f) => ({ ...f, content: e.target.value }))} required rows={6} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Video URL</label>
                  <input type="url" className="input-field" placeholder="YouTube / Vimeo URL" value={moduleForm.videoUrl} onChange={(e) => setModuleForm((f) => ({ ...f, videoUrl: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Duration (minutes)</label>
                  <input type="number" className="input-field" min="0" value={moduleForm.duration} onChange={(e) => setModuleForm((f) => ({ ...f, duration: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModuleForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><PlusCircle className="w-4 h-4" /> Add Module</>}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
