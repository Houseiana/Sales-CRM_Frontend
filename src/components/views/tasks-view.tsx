"use client";

import { useEffect, useState } from "react";
import {
  Plus, Check, Trash2, Clock, CheckCircle2, ListTodo,
  AlertCircle, Flame, Send, Phone, FileText, Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ScoreBadge } from "@/components/score-badge";
import { useAuth } from "@/lib/auth-context";
import { salesTasksApi, type SalesTaskItem } from "@/lib/api";
import { useLocale } from "@/lib/i18n/locale-context";
import type { LucideIcon } from "lucide-react";

const PRIORITIES = ["Urgent", "High", "Medium", "Low"];

/* ── Category helper ── */
function guessCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("call")) return "Call";
  if (t.includes("proposal") || t.includes("send")) return "Proposal";
  if (t.includes("meeting") || t.includes("prep")) return "Meeting";
  if (t.includes("review") || t.includes("audit")) return "Review";
  if (t.includes("follow")) return "Follow-up";
  return "Task";
}

const categoryIcons: Record<string, LucideIcon> = {
  Call: Phone,
  Proposal: FileText,
  Meeting: Users,
  Review: ListTodo,
  "Follow-up": Send,
  Task: CheckCircle2,
};

/* ── Task Row Component ── */
function TaskRow({
  task,
  onToggle,
  onDelete,
  canDelete,
}: {
  task: SalesTaskItem;
  onToggle: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const category = guessCategory(task.title);
  const CategoryIcon = categoryIcons[category] || CheckCircle2;
  const dueStr = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : "";
  const timeStr = task.dueDate
    ? new Date(task.dueDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "";

  return (
    <div className={`group flex items-start gap-3 rounded-2xl border border-stone-200 p-4 transition hover:bg-stone-50/70 ${task.isCompleted ? "opacity-60" : ""}`}>
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
          task.isCompleted
            ? "border-emerald-300 bg-emerald-100 text-emerald-700"
            : "border-stone-300 hover:border-stone-500"
        }`}
      >
        {task.isCompleted && <Check className="h-3 w-3" />}
      </button>

      {/* Category Icon */}
      <div className={`mt-0.5 rounded-xl p-2 ${task.isCompleted ? "bg-stone-100" : "bg-stone-950"}`}>
        <CategoryIcon className={`h-3.5 w-3.5 ${task.isCompleted ? "text-stone-400" : "text-white"}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${task.isCompleted ? "text-stone-400 line-through" : "text-stone-950"}`}>
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
          {task.owner && <span>{task.owner}</span>}
          {dueStr && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {dueStr}{timeStr ? ` · ${timeStr}` : ""}
            </span>
          )}
          {task.leadName && <span className="text-stone-400">{task.leadName}</span>}
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">{category}</span>
        </div>
      </div>

      {/* Priority + Delete */}
      <div className="flex shrink-0 items-center gap-1.5">
        <ScoreBadge value={task.isCompleted ? "Done" : task.priority} />
        {canDelete && (
          <button
            onClick={onDelete}
            className="rounded-lg p-1 text-stone-300 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main View ── */
export function TasksView() {
  const { canEdit, canDelete } = useAuth();
  const { t } = useLocale();
  const [tasks, setTasks] = useState<SalesTaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", priority: "Medium", owner: "", dueDate: "", description: "" });

  const fetchTasks = async () => {
    setLoading(true);
    try { const data = await salesTasksApi.getAll(); setTasks(data); } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  useEffect(() => {
    const handler = (e: Event) => { if ((e as CustomEvent).detail === "Tasks") setShowCreate(true); };
    window.addEventListener("crm:primary-action", handler);
    return () => window.removeEventListener("crm:primary-action", handler);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await salesTasksApi.create({ ...form, dueDate: form.dueDate || undefined });
      setShowCreate(false); setForm({ title: "", priority: "Medium", owner: "", dueDate: "", description: "" }); fetchTasks();
    } catch { /* */ } finally { setSaving(false); }
  };

  const handleToggle = async (id: string) => {
    try { await salesTasksApi.toggle(id); fetchTasks(); } catch { /* */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.tasks.deleteTask)) return;
    try { await salesTasksApi.delete(id); fetchTasks(); } catch { /* */ }
  };

  const pending = tasks.filter((tk) => !tk.isCompleted);
  const completed = tasks.filter((tk) => tk.isCompleted);
  const today = new Date().toDateString();
  const todayTasks = pending.filter((tk) => tk.dueDate && new Date(tk.dueDate).toDateString() === today);
  const upcomingTasks = pending.filter((tk) => !tk.dueDate || new Date(tk.dueDate).toDateString() !== today);

  const urgentCount = pending.filter((tk) => tk.priority === "Urgent").length;
  const highCount = pending.filter((tk) => tk.priority === "High").length;

  /* ── Summary Cards ── */
  const summaryCards: [string, string, LucideIcon][] = [
    [t.tasks.pending, String(pending.length), ListTodo],
    [t.tasks.dueToday, String(todayTasks.length), Clock],
    [t.completed, String(completed.length), CheckCircle2],
  ];

  return (
    <div className="space-y-4">
      {/* Summary Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {summaryCards.map(([title, value, Icon]) => (
          <Card key={title} className="rounded-3xl border-stone-200/80 shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-stone-500">{title}</p>
                <p className="mt-2 text-3xl font-semibold text-stone-950">{value}</p>
              </div>
              <div className="rounded-2xl bg-yellow-50 p-3 ring-1 ring-yellow-100">
                <Icon className="h-5 w-5 text-stone-900" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Layout: Task List + Right Rail */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">

        {/* ── Task List ── */}
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-stone-950">{t.tasks.taskList}</CardTitle>
                <p className="mt-1 text-sm text-stone-500">{t.tasks.taskListSub}</p>
              </div>
              {canEdit && (
                <Button onClick={() => setShowCreate(true)} className="rounded-2xl bg-stone-950 text-white hover:bg-stone-800">
                  <Plus className="mr-2 h-4 w-4" /> {t.tasks.newTask}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {loading ? (
              <p className="py-12 text-center text-sm text-stone-500">{t.loading}</p>
            ) : (
              <>
                {/* Today */}
                {(todayTasks.length > 0 || pending.length > 0) && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <p className="text-sm font-semibold text-stone-950">{t.today}</p>
                      <Badge className="rounded-full border border-stone-200 bg-white text-stone-600">
                        {todayTasks.length > 0 ? todayTasks.length : pending.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {(todayTasks.length > 0 ? todayTasks : pending.slice(0, 5)).map((task) => (
                        <TaskRow key={task.id} task={task} onToggle={() => handleToggle(task.id)} onDelete={() => handleDelete(task.id)} canDelete={canDelete} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming */}
                {upcomingTasks.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <p className="text-sm font-semibold text-stone-950">{t.upcoming}</p>
                      <Badge className="rounded-full border border-stone-200 bg-white text-stone-600">{upcomingTasks.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {upcomingTasks.map((task) => (
                        <TaskRow key={task.id} task={task} onToggle={() => handleToggle(task.id)} onDelete={() => handleDelete(task.id)} canDelete={canDelete} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed */}
                {completed.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <p className="text-sm font-semibold text-stone-950">{t.completed}</p>
                      <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">{completed.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {completed.map((task) => (
                        <TaskRow key={task.id} task={task} onToggle={() => handleToggle(task.id)} onDelete={() => handleDelete(task.id)} canDelete={canDelete} />
                      ))}
                    </div>
                  </div>
                )}

                {tasks.length === 0 && (
                  <p className="py-12 text-center text-sm text-stone-400">{t.tasks.noTasks}</p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* ── Right Rail ── */}
        <div className="space-y-4">
          {/* Focus Today */}
          <Card className="rounded-3xl border-stone-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-stone-950">{t.tasks.focusToday}</CardTitle>
              <p className="text-sm text-stone-500">{t.tasks.focusTodaySub}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-stone-200 p-4">
                <div className="rounded-xl bg-rose-100 p-2"><AlertCircle className="h-4 w-4 text-rose-700" /></div>
                <div>
                  <p className="font-medium text-stone-950">{urgentCount} {t.tasks.urgentTasks}{urgentCount !== 1 ? "s" : ""}</p>
                  <p className="mt-0.5 text-sm text-stone-500">{t.tasks.immediateAction}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-stone-200 p-4">
                <div className="rounded-xl bg-orange-100 p-2"><Flame className="h-4 w-4 text-orange-700" /></div>
                <div>
                  <p className="font-medium text-stone-950">{highCount} {t.tasks.highPriority}{highCount !== 1 ? "s" : ""}</p>
                  <p className="mt-0.5 text-sm text-stone-500">{t.tasks.completeToday}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-stone-200 p-4">
                <div className="rounded-xl bg-emerald-100 p-2"><CheckCircle2 className="h-4 w-4 text-emerald-700" /></div>
                <div>
                  <p className="font-medium text-stone-950">{completed.length} {t.completed.toLowerCase()}</p>
                  <p className="mt-0.5 text-sm text-stone-500">{completed.length > 0 ? t.tasks.greatProgress : t.tasks.getStarted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Execution Rhythm */}
          <Card className="rounded-3xl border-stone-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-stone-950">{t.tasks.executionRhythm}</CardTitle>
              <p className="text-sm text-stone-500">{t.tasks.dailyCadence}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                ["09:00", t.tasks.leadReview],
                ["11:00", t.tasks.ownerFollowUp],
                ["14:00", t.tasks.proposalWindow],
                ["17:00", t.tasks.endOfDay],
              ].map(([time, label]) => (
                <div key={time} className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
                  <span className="text-sm font-semibold text-stone-950">{time}</span>
                  <span className="text-sm text-stone-600">{label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title={t.tasks.createTask}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">{t.tasks.title} {t.required}</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-10 rounded-xl border-stone-200" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">{t.tasks.priority}</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">{t.tasks.owner} {t.required}</label>
              <Input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className="h-10 rounded-xl border-stone-200" required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">{t.tasks.dueDate}</label>
            <Input type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="h-10 rounded-xl border-stone-200" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">{t.tasks.description}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-stone-200 p-3 text-sm" rows={2} />
          </div>
          <Button type="submit" disabled={saving} className="h-10 w-full rounded-xl bg-stone-950 text-white hover:bg-stone-800">
            {saving ? t.tasks.creating : t.tasks.createTask}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
