"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Users, Building2, UserPlus, Pencil, Trash2, Eye, RefreshCw, Flame, CalendarClock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScoreBadge } from "@/components/score-badge";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/lib/auth-context";
import { salesLeadsApi, type SalesLead } from "@/lib/api";
import { CreateLeadForm } from "@/components/create-lead-form";
import { useLocale } from "@/lib/i18n/locale-context";
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
  const { t } = useLocale();
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
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.createLead.contactName} {t.required}</label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="h-10 rounded-xl border-stone-200" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.email}</label>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.createLead.mobileWhatsapp}</label>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.leads.type}</label>
          <select value={form.type} onChange={(e) => set("type", e.target.value)} className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
            {TYPES.map((tp) => <option key={tp}>{tp}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.leads.source}</label>
          <select value={form.source} onChange={(e) => set("source", e.target.value)} className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
            {SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.leads.score}</label>
          <select value={form.score} onChange={(e) => set("score", e.target.value)} className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
            {SCORES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.leads.stage}</label>
          <select value={form.stage} onChange={(e) => set("stage", e.target.value)} className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.leads.city}</label>
          <Input value={form.city} onChange={(e) => set("city", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.createLead.country}</label>
          <Input value={form.country} onChange={(e) => set("country", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.createLead.preferredLanguage}</label>
          <Input value={form.language} onChange={(e) => set("language", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.leads.budget}</label>
          <Input value={form.budget} onChange={(e) => set("budget", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{t.createLead.assignedAgent}</label>
          <Input value={form.assignedAgentName} onChange={(e) => set("assignedAgentName", e.target.value)} className="h-10 rounded-xl border-stone-200" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">{t.createLead.internalNotes}</label>
        <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="w-full rounded-xl border border-stone-200 p-3 text-sm" rows={2} />
      </div>
      <Button type="submit" disabled={loading} className="h-10 w-full rounded-xl bg-stone-950 text-white hover:bg-stone-800">
        {loading ? t.createLead.saving : initial ? t.save : t.createLead.createHouseianaLead}
      </Button>
    </form>
  );
}

export function LeadsView() {
  const { canEdit, canDelete } = useAuth();
  const { t, isRTL } = useLocale();
  const [allLeads, setAllLeads] = useState<SalesLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editLead, setEditLead] = useState<SalesLead | null>(null);
  const [viewLead, setViewLead] = useState<SalesLead | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch ALL leads at once — filtering is done client-side for instant response
  const fetchLeads = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const r = await salesLeadsApi.getAll({ pageSize: "200" });
      setAllLeads(r.items);
    } catch { /* ignore */ } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

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
    if (!confirm(t.leads.deleteLead)) return;
    try { await salesLeadsApi.delete(id); fetchLeads(); } catch { /* ignore */ }
  };

  // ── Client-side filtering (instant, no extra API call) ──
  const filteredLeads = useMemo(() => {
    let result = allLeads;
    switch (filter) {
      case "Owners":    result = result.filter((l) => l.type === "Property Owner"); break;
      case "Guests":    result = result.filter((l) => l.type === "Guest Booking"); break;
      case "Investors": result = result.filter((l) => l.type === "Investor"); break;
      case "Corporate": result = result.filter((l) => l.type === "Corporate Booking"); break;
      case "Hot":       result = result.filter((l) => l.score === "Hot"); break;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) =>
        l.name.toLowerCase().includes(q) ||
        (l.phone ?? "").toLowerCase().includes(q) ||
        (l.email ?? "").toLowerCase().includes(q) ||
        (l.city ?? "").toLowerCase().includes(q) ||
        (l.source ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [allLeads, filter, search]);

  // ── Top Priority leads (Hot or Priority score) ──
  const topPriorityLeads = useMemo(
    () => allLeads.filter((l) => l.score === "Hot" || l.score === "Priority").slice(0, 6),
    [allLeads]
  );

  // ── Summary counts ──
  const newCount = allLeads.filter((l) => l.stage === "New Lead").length;
  const qualifiedCount = allLeads.filter((l) => l.stage === "Qualified").length;
  const unassignedCount = allLeads.filter((l) => !l.assignedAgentName).length;
  const leadSummary: [string, string, LucideIcon][] = [
    [t.leads.newLeads, String(newCount), Users],
    [t.leads.qualified, String(qualifiedCount), Building2],
    [t.leads.unassigned, String(unassignedCount), UserPlus],
  ];

  const filterLabels: [string, string][] = [
    ["All", t.all],
    ["Owners", t.leads.owners],
    ["Guests", t.leads.guests],
    ["Investors", t.leads.investors],
    ["Corporate", t.leads.corporate],
    ["Hot", t.leads.hot],
  ];

  // ── Premium Create Form (full page) ──
  if (showCreate) {
    return (
      <CreateLeadForm
        onSuccess={() => { setShowCreate(false); fetchLeads(); }}
        onCancel={() => setShowCreate(false)}
      />
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
          <button onClick={() => setError("")} className="ml-2 font-semibold">{t.dismiss}</button>
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {leadSummary.map(([title, value, Icon]) => (
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

      {/* ── Quick Access: Top Priority ── */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50">
              <Flame className="h-4 w-4 text-rose-500" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{t.leads.quickAccess}</p>
              <p className="text-sm font-semibold text-stone-950">{t.leads.topPriority}</p>
            </div>
          </div>
          {topPriorityLeads.length === 0 ? (
            <p className="py-4 text-center text-sm text-stone-400">{t.leads.noTopPriority}</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {topPriorityLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setViewLead(lead)}
                  className="flex min-w-[200px] flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:border-stone-400 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Avatar className="h-9 w-9 rounded-xl">
                      <AvatarFallback className="rounded-xl bg-stone-950 text-xs text-white">
                        {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ScoreBadge value={lead.score} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-950 leading-tight">{lead.name}</p>
                    <p className="text-xs text-stone-500">{lead.type}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-stone-500">
                    {lead.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{lead.city}
                      </span>
                    )}
                    {lead.nextFollowUp && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <CalendarClock className="h-3 w-3" />
                        {new Date(lead.nextFollowUp).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Filter Bar ── */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filterLabels.map(([key, label]) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                onClick={() => setFilter(key)}
                className={`rounded-2xl ${filter === key ? "bg-stone-950 text-white hover:bg-stone-800" : "border-stone-200 hover:bg-stone-50"}`}
              >
                {label}
                {key !== "All" && (
                  <span className={`${isRTL ? "mr-1.5" : "ml-1.5"} rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold leading-none ${filter === key ? "text-white/80" : "bg-stone-100 text-stone-500"}`}>
                    {key === "Hot"
                      ? allLeads.filter((l) => l.score === "Hot").length
                      : key === "Owners" ? allLeads.filter((l) => l.type === "Property Owner").length
                      : key === "Guests" ? allLeads.filter((l) => l.type === "Guest Booking").length
                      : key === "Investors" ? allLeads.filter((l) => l.type === "Investor").length
                      : key === "Corporate" ? allLeads.filter((l) => l.type === "Corporate Booking").length
                      : 0}
                  </span>
                )}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={t.leads.searchLeads}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-52 rounded-2xl border-stone-200"
            />
            <button
              onClick={() => fetchLeads(true)}
              disabled={refreshing}
              title={t.leads.refresh}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            {canEdit && (
              <Button onClick={() => setShowCreate(true)} className="rounded-2xl bg-stone-950 text-white hover:bg-stone-800">
                <UserPlus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} /> {t.leads.addLead}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Leads Table ── */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <p className="py-12 text-center text-sm text-stone-500">{t.leads.loadingLeads}</p>
          ) : filteredLeads.length === 0 ? (
            <p className="py-12 text-center text-sm text-stone-500">{t.leads.noLeadsFound}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <th className="px-4 py-3">{t.leads.lead}</th>
                    <th className="px-4 py-3">{t.leads.type}</th>
                    <th className="px-4 py-3">{t.leads.source}</th>
                    <th className="px-4 py-3">{t.leads.city}</th>
                    <th className="px-4 py-3">{t.leads.budget}</th>
                    <th className="px-4 py-3">{t.leads.stage}</th>
                    <th className="px-4 py-3">{t.leads.score}</th>
                    <th className="px-4 py-3">{t.leads.nextFollowUp}</th>
                    <th className="px-4 py-3">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-stone-200 hover:bg-stone-50/70">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-stone-950">{lead.name}</p>
                        <p className="text-xs text-stone-500">{lead.assignedAgentName || t.leads.unassigned}</p>
                      </td>
                      <td className="px-4 py-3 text-stone-700">{lead.type}</td>
                      <td className="px-4 py-3 text-stone-700">{lead.source}</td>
                      <td className="px-4 py-3 text-stone-700">{lead.city || <span className="text-stone-400">—</span>}</td>
                      <td className="px-4 py-3 text-stone-700">{lead.budget || <span className="text-stone-400">—</span>}</td>
                      <td className="px-4 py-3 text-stone-700">{lead.stage}</td>
                      <td className="px-4 py-3"><ScoreBadge value={lead.score} /></td>
                      <td className="px-4 py-3 whitespace-nowrap text-stone-700">
                        {lead.nextFollowUp
                          ? <span className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5 text-amber-500" />{new Date(lead.nextFollowUp).toLocaleDateString()}</span>
                          : <span className="text-stone-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setViewLead(lead)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700" title={t.view}><Eye className="h-4 w-4" /></button>
                          {canEdit && <button onClick={() => setEditLead(lead)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700" title={t.edit}><Pencil className="h-4 w-4" /></button>}
                          {canDelete && <button onClick={() => handleDelete(lead.id)} className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-100 hover:text-rose-600" title={t.delete}><Trash2 className="h-4 w-4" /></button>}
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

      {/* ── Modals ── */}
      <Modal open={!!editLead} onClose={() => setEditLead(null)} title={`${t.edit} ${editLead?.name || ""}`}>
        {editLead && <LeadForm initial={editLead} onSubmit={handleUpdate} loading={saving} />}
      </Modal>
      <Modal open={!!viewLead} onClose={() => setViewLead(null)} title={viewLead?.name || ""}>
        {viewLead && (
          <div className="space-y-3">
            {[
              [t.email, viewLead.email],
              [t.createLead.mobileWhatsapp, viewLead.phone],
              [t.leads.type, viewLead.type],
              [t.leads.source, viewLead.source],
              [t.leads.stage, viewLead.stage],
              [t.leads.score, viewLead.score],
              [t.leads.city, viewLead.city],
              [t.createLead.country, viewLead.country],
              [t.createLead.preferredLanguage, viewLead.language],
              [t.leads.budget, viewLead.budget],
              [t.createLead.targetLocation, viewLead.targetArea],
              [t.leads.nextFollowUp, viewLead.nextFollowUp ? new Date(viewLead.nextFollowUp).toLocaleString() : undefined],
              [t.preview.agent, viewLead.assignedAgentName],
              [t.createLead.internalNotes, viewLead.notes],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={String(label)} className="flex justify-between rounded-xl border border-stone-200 px-4 py-2.5">
                <span className="text-sm text-stone-500">{label}</span>
                <span className="text-sm font-medium text-stone-900">{value}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              {canEdit && (
                <Button onClick={() => { setViewLead(null); setEditLead(viewLead); }} className="flex-1 rounded-xl bg-stone-950 text-white hover:bg-stone-800">
                  <Pencil className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />{t.edit}
                </Button>
              )}
              {canDelete && (
                <Button variant="outline" onClick={() => { handleDelete(viewLead.id); setViewLead(null); }} className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
