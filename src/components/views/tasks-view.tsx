"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Flame, Send, Plus, Check, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ScoreBadge } from "@/components/score-badge";
import { useAuth } from "@/lib/auth-context";
import { salesTasksApi, type SalesTaskItem } from "@/lib/api";
import type { LucideIcon } from "lucide-react";

const PRIORITIES = ["Urgent", "High", "Medium", "Low"];

export function TasksView() {
  const { canEdit, canDelete } = useAuth();
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
    if (!confirm("Delete this task?")) return;
    try { await salesTasksApi.delete(id); fetchTasks(); } catch { /* */ }
  };

  const pending = tasks.filter((t) => !t.isCompleted);
  const completed = tasks.filter((t) => t.isCompleted);
  const today = new Date().toDateString();
  const todayTasks = pending.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === today);
  const upcoming = pending.filter((t) => !t.dueDate || new Date(t.dueDate).toDateString() !== today);

  const sections: [string, SalesTaskItem[]][] = [
    ["Today", todayTasks.length > 0 ? todayTasks : pending.slice(0, 4)],
    ["Upcoming", upcoming],
    ["Completed", completed],
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">{pending.length} pending, {completed.length} completed</p>
        </div>
        {canEdit && (
          <Button onClick={() => setShowCreate(true)} className="rounded-2xl bg-stone-950 text-white hover:bg-stone-800">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {sections.map(([section, items]) => (
          <Card key={section} className="rounded-3xl border-stone-200/80 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-stone-950">{section}</CardTitle>
                <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">{items.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.length === 0 && <p className="py-4 text-center text-sm text-stone-400">No tasks</p>}
              {items.map((task) => (
                <div key={task.id} className="rounded-2xl border border-stone-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button onClick={() => handleToggle(task.id)}
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${task.isCompleted ? "border-emerald-300 bg-emerald-100 text-emerald-700" : "border-stone-300 hover:border-stone-400"}`}>
                        {task.isCompleted && <Check className="h-3 w-3" />}
                      </button>
                      <div>
                        <p className={`font-medium ${task.isCompleted ? "text-stone-400 line-through" : "text-stone-950"}`}>{task.title}</p>
                        <p className="mt-1 text-sm text-stone-500">
                          {task.owner}{task.dueDate ? ` · ${new Date(task.dueDate).toLocaleDateString()}` : ""}
                        </p>
                        {task.leadName && <p className="text-xs text-stone-400">Lead: {task.leadName}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <ScoreBadge value={task.isCompleted ? "Done" : task.priority} />
                      {canDelete && (
                        <button onClick={() => handleDelete(task.id)} className="rounded-lg p-1 text-stone-300 hover:bg-rose-50 hover:text-rose-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">Follow-up priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {([
              [`${tasks.filter((t) => !t.isCompleted && t.priority === "Urgent").length} urgent tasks`, "Immediate action needed", AlertCircle],
              [`${tasks.filter((t) => !t.isCompleted && t.priority === "High").length} high priority`, "Schedule today", Flame],
              [`${completed.length} completed`, "Great progress", Send],
            ] as [string, string, LucideIcon][]).map(([title, text, Icon]) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl border border-stone-200 p-4">
                <div className="rounded-2xl bg-stone-100 p-2"><Icon className="h-4 w-4 text-stone-700" /></div>
                <div><p className="font-medium text-stone-950">{title}</p><p className="mt-1 text-sm text-stone-500">{text}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">Daily execution rhythm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["09:00 - Lead review and assignment", "11:00 - Owner follow-up block", "14:00 - Proposal and negotiation window", "17:00 - End-of-day performance check"].map((item) => (
              <div key={item} className="rounded-2xl bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800">{item}</div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create new task">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Title *</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-10 rounded-xl border-stone-200" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Owner *</label>
              <Input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className="h-10 rounded-xl border-stone-200" required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Due Date</label>
            <Input type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="h-10 rounded-xl border-stone-200" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-stone-200 p-3 text-sm" rows={2} />
          </div>
          <Button type="submit" disabled={saving} className="h-10 w-full rounded-xl bg-stone-950 text-white hover:bg-stone-800">
            {saving ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
