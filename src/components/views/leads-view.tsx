"use client";

import { useEffect, useState } from "react";
import { Users, Building2, UserPlus, Filter, Bookmark, Pencil, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScoreBadge } from "@/components/score-badge";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/lib/auth-context";
import { salesLeadsApi, type SalesLead } from "@/lib/api";
import type { LucideIcon } from "lucide-react";

const TYPES = ["Property Owner", "Guest Booking", "Investor", "Corporate Booking", "Property Listing"];
const SOURCES = ["Meta Ads", "WhatsApp", "Website", "Referral", "Instagram", "Direct Call", "TikTok", "Partner"];
const SCORES = ["Hot", "Warm", "Cold", "Priority"];
const STAGES = ["New Lead", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

function LeadForm({ initial, onSubmit, loading }: {
  initial?: Partial<SalesLead>;
  onSubmit: (data: Record<string, string>) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: initial?.name || "", email: initial?.email || "", phone: initial?.phone || "",
    type: initial?.type || "Property Owner", source: initial?.source || "Meta Ads",
    score: initial?.score || "Warm", stage: initial?.stage || "New Lead",
    city: initial?.city || "", country: initial?.country || "", language: initial?.language || "",
    budget: initial?.budget || "", targetArea: initial?.targetArea || "",
    assignedAgentName: initial?.assignedAgentName || "", notes: initial?.notes || "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Name *</label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="h-10 rounded-xl border-stone-200" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Email</label>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Phone</label>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Type</label>
          <select value={form.type} onChange={(e) => set("type", e.target.value)} className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Source</label>
          <select value={form.source} onChange={(e) => set("source", e.target.value)} className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
            {SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Score</label>
          <select value={form.score} onChange={(e) => set("score", e.target.value)} className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
            {SCORES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Stage</label>
          <select value={form.stage} onChange={(e) => set("stage", e.target.value)} className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">City</label>
          <Input value={form.city} onChange={(e) => set("city", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Country</label>
          <Input value={form.country} onChange={(e) => set("country", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Language</label>
          <Input value={form.language} onChange={(e) => set("language", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Budget</label>
          <Input value={form.budget} onChange={(e) => set("budget", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Assigned Agent</label>
          <Input value={form.assignedAgentName} onChange={(e) => set("assignedAgentName", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Notes</label>
        <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="w-full rounded-xl border border-stone-200 p-3 text-sm" rows={2} />
      </div>
      <Button type="submit" disabled={loading} className="h-10 w-full rounded-xl bg-stone-950 text-white hover:bg-stone-800">
        {loading ? "Saving..." : initial ? "Save Changes" : "Create Lead"}
      </Button>
    </form>
  );
}

export function LeadsView() {
  const { canEdit, canDelete } = useAuth();
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editLead, setEditLead] = useState<SalesLead | null>(null);
  const [viewLead, setViewLead] = useState<SalesLead | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { pageSize: "50" };
      if (filter === "Hot") params.score = "Hot";
      else if (filter !== "All" && filter !== "No Activity") params.type = filter === "Owners" ? "Property Owner" : filter === "Guests" ? "Guest Booking" : filter === "Investors" ? "Investor" : filter === "Corporate" ? "Corporate Booking" : "";
      if (search) params.search = search;
      const r = await salesLeadsApi.getAll(params);
      setLeads(r.items);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, [filter, search]);

  // Listen for top bar primary action
  useEffect(() => {
    const handler = (e: Event) => { if ((e as CustomEvent).detail === "Leads") setShowCreate(true); };
    window.addEventListener("crm:primary-action", handler);
    return () => window.removeEventListener("crm:primary-action", handler);
  }, []);

  const handleCreate = async (data: Record<string, string>) => {
    setSaving(true); setError("");
    try {
      await salesLeadsApi.create(data as unknown as Partial<SalesLead>);
      setShowCreate(false); fetchLeads();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); } finally { setSaving(false); }
  };

  const handleUpdate = async (data: Record<string, string>) => {
    if (!editLead) return;
    setSaving(true); setError("");
    try {
      await salesLeadsApi.update(editLead.id, data as unknown as Partial<SalesLead>);
      setEditLead(null); fetchLeads();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    try { await salesLeadsApi.delete(id); fetchLeads(); } catch { /* ignore */ }
  };

  const newCount = leads.filter((l) => l.stage === "New Lead").length;
  const qualifiedCount = leads.filter((l) => l.stage === "Qualified").length;
  const unassignedCount = leads.filter((l) => !l.assignedAgentName).length;
  const leadSummary: [string, string, LucideIcon][] = [
    ["New Leads", String(newCount), Users],
    ["Qualified", String(qualifiedCount), Building2],
    ["Unassigned", String(unassignedCount), UserPlus],
  ];

  return (
    <div className="space-y-4">
      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}<button onClick={() => setError("")} className="ml-2 font-semibold">Dismiss</button></div>}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {leadSummary.map(([title, value, Icon]) => (
          <Card key={title} className="rounded-3xl border-stone-200/80 shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-stone-500">{title}</p>
                <p className="mt-2 text-3xl font-semibold text-stone-950">{value}</p>
              </div>
              <div className="rounded-2xl bg-yellow-50 p-3 ring-1 ring-yellow-100"><Icon className="h-5 w-5 text-stone-900" /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["All", "Owners", "Guests", "Investors", "Corporate", "Hot"].map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}
                className={`rounded-2xl ${filter === f ? "bg-stone-950 text-white hover:bg-stone-800" : "border-stone-200"}`}>{f}</Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-48 rounded-2xl border-stone-200" />
            {canEdit && <Button onClick={() => setShowCreate(true)} className="rounded-2xl bg-stone-950 text-white hover:bg-stone-800"><UserPlus className="mr-2 h-4 w-4" /> Add Lead</Button>}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="p-0">
          {loading ? <p className="py-12 text-center text-sm text-stone-500">Loading leads...</p> : leads.length === 0 ? <p className="py-12 text-center text-sm text-stone-500">No leads found.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <th className="px-4 py-3">Lead</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">City</th><th className="px-4 py-3">Budget</th><th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3">Score</th><th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-stone-200 hover:bg-stone-50/70">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-stone-950">{lead.name}</p>
                        <p className="text-xs text-stone-500">{lead.assignedAgentName || "Unassigned"}</p>
                      </td>
                      <td className="px-4 py-3 text-stone-700">{lead.type}</td>
                      <td className="px-4 py-3 text-stone-700">{lead.source}</td>
                      <td className="px-4 py-3 text-stone-700">{lead.city}</td>
                      <td className="px-4 py-3 text-stone-700">{lead.budget || "N/A"}</td>
                      <td className="px-4 py-3 text-stone-700">{lead.stage}</td>
                      <td className="px-4 py-3"><ScoreBadge value={lead.score} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setViewLead(lead)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700" title="View"><Eye className="h-4 w-4" /></button>
                          {canEdit && <button onClick={() => setEditLead(lead)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700" title="Edit"><Pencil className="h-4 w-4" /></button>}
                          {canDelete && <button onClick={() => handleDelete(lead.id)} className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-100 hover:text-rose-600" title="Delete"><Trash2 className="h-4 w-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Cards */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {leads.slice(0, 3).map((lead) => (
          <Card key={lead.id} className="cursor-pointer rounded-3xl border-stone-200/80 shadow-sm hover:shadow-md" onClick={() => setViewLead(lead)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 rounded-2xl"><AvatarFallback className="rounded-2xl bg-stone-950 text-white">{lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                  <div><p className="font-semibold text-stone-950">{lead.name}</p><p className="text-sm text-stone-500">{lead.type}</p></div>
                </div>
                <ScoreBadge value={lead.score} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-stone-50 p-3"><p className="text-stone-400">Source</p><p className="mt-1 font-medium text-stone-900">{lead.source}</p></div>
                <div className="rounded-2xl bg-stone-50 p-3"><p className="text-stone-400">Agent</p><p className="mt-1 font-medium text-stone-900">{lead.assignedAgentName || "Unassigned"}</p></div>
                <div className="rounded-2xl bg-stone-50 p-3"><p className="text-stone-400">City</p><p className="mt-1 font-medium text-stone-900">{lead.city || "N/A"}</p></div>
                <div className="rounded-2xl bg-stone-50 p-3"><p className="text-stone-400">Stage</p><p className="mt-1 font-medium text-stone-900">{lead.stage}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create new lead">
        <LeadForm onSubmit={handleCreate} loading={saving} />
      </Modal>
      <Modal open={!!editLead} onClose={() => setEditLead(null)} title={`Edit ${editLead?.name || ""}`}>
        {editLead && <LeadForm initial={editLead} onSubmit={handleUpdate} loading={saving} />}
      </Modal>
      <Modal open={!!viewLead} onClose={() => setViewLead(null)} title={viewLead?.name || ""}>
        {viewLead && (
          <div className="space-y-3">
            {[["Email", viewLead.email], ["Phone", viewLead.phone], ["Type", viewLead.type], ["Source", viewLead.source],
              ["Stage", viewLead.stage], ["Score", viewLead.score], ["City", viewLead.city], ["Country", viewLead.country],
              ["Language", viewLead.language], ["Budget", viewLead.budget], ["Target Area", viewLead.targetArea],
              ["Agent", viewLead.assignedAgentName], ["Notes", viewLead.notes]].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="flex justify-between rounded-xl border border-stone-200 px-4 py-2.5">
                <span className="text-sm text-stone-500">{label}</span>
                <span className="text-sm font-medium text-stone-900">{value}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              {canEdit && <Button onClick={() => { setViewLead(null); setEditLead(viewLead); }} className="flex-1 rounded-xl bg-stone-950 text-white hover:bg-stone-800"><Pencil className="mr-2 h-4 w-4" />Edit</Button>}
              {canDelete && <Button variant="outline" onClick={() => { handleDelete(viewLead.id); setViewLead(null); }} className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></Button>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
