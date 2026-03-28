"use client";

import { useEffect, useState } from "react";
import {
  BadgeDollarSign, Target, FileText, TrendingUp, ChevronRight, MoreHorizontal,
  X, Phone, MessageCircle, CheckSquare, UserCheck, MapPin, Globe, Mail,
  CalendarClock, Building2, Flame, ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScoreBadge } from "@/components/score-badge";
import { MiniLineChart } from "@/components/charts";
import { useAuth } from "@/lib/auth-context";
import { salesLeadsApi, salesTasksApi, type SalesLead } from "@/lib/api";
import type { LucideIcon } from "lucide-react";

/* ── Stage metadata ── */

interface StageMeta { objective: string; sla: string; tone: string }

const STAGE_META: Record<string, StageMeta> = {
  "New Lead":     { objective: "Capture and verify the opportunity",         sla: "Respond in 15 min",        tone: "stone" },
  Contacted:      { objective: "Make first contact and confirm fit",         sla: "Same day follow-up",       tone: "amber" },
  Qualified:      { objective: "Validate budget, location, and service fit", sla: "Move within 24h",          tone: "yellow" },
  Proposal:       { objective: "Send offer, package, or commercial proposal",sla: "Within 24h of qualification", tone: "orange" },
  Negotiation:    { objective: "Resolve objections and align on terms",      sla: "Daily touchpoint",         tone: "emerald" },
  Won:            { objective: "Confirm, hand off, and start onboarding",    sla: "Immediate handoff",        tone: "green" },
  Lost:           { objective: "Document reason and archive",                sla: "Post-mortem review",       tone: "slate" },
};

const STAGES = ["New Lead", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

const STAGE_COLORS: Record<string, string> = {
  stone: "border-stone-200 bg-stone-50 text-stone-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  yellow: "border-yellow-200 bg-yellow-50 text-yellow-900",
  orange: "border-orange-200 bg-orange-50 text-orange-900",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
  green: "border-lime-200 bg-lime-50 text-lime-900",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
};

/* ── Lead Preview Drawer ── */

function LeadPreviewDrawer({
  lead,
  onClose,
  onMoveStage,
  onAddTask,
}: {
  lead: SalesLead;
  onClose: () => void;
  onMoveStage: (leadId: string, stage: string) => void;
  onAddTask: (leadId: string, title: string) => void;
}) {
  const [showStages, setShowStages] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [showTaskInput, setShowTaskInput] = useState(false);
  const initials = lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const details: { icon: LucideIcon; label: string; value: string }[] = [
    ...(lead.type ? [{ icon: Building2, label: "Type", value: lead.type }] : []),
    ...(lead.source ? [{ icon: Flame, label: "Source", value: lead.source }] : []),
    ...(lead.city || lead.country ? [{ icon: MapPin, label: "Location", value: [lead.city, lead.country].filter(Boolean).join(", ") }] : []),
    ...(lead.assignedAgentName ? [{ icon: UserCheck, label: "Assigned Agent", value: lead.assignedAgentName }] : []),
    ...(lead.phone ? [{ icon: Phone, label: "Phone", value: lead.phone }] : []),
    ...(lead.email ? [{ icon: Mail, label: "Email", value: lead.email }] : []),
    ...(lead.language ? [{ icon: Globe, label: "Language", value: lead.language }] : []),
    ...(lead.budget ? [{ icon: BadgeDollarSign, label: "Budget", value: lead.budget }] : []),
    ...(lead.targetArea ? [{ icon: MapPin, label: "Target Area", value: lead.targetArea }] : []),
    ...(lead.businessLine ? [{ icon: Building2, label: "Business Line", value: lead.businessLine }] : []),
    ...(lead.managementScope ? [{ icon: Target, label: "Management Scope", value: lead.managementScope }] : []),
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-stone-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 px-6 py-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 rounded-2xl">
              <AvatarFallback className="rounded-2xl bg-stone-950 text-sm text-white">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-stone-950">{lead.name}</h3>
              <p className="mt-0.5 text-sm text-stone-500">{lead.type} · {lead.source}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Stage & Score */}
          <div className="mb-5 flex items-center gap-2">
            <Badge className="rounded-full border border-stone-200 bg-stone-50 text-stone-700">{lead.stage}</Badge>
            <ScoreBadge value={lead.score} />
          </div>

          {/* Quick Actions */}
          <div className="mb-5 grid grid-cols-2 gap-2">
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center justify-center gap-2 rounded-2xl bg-stone-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800">
                <Phone className="h-4 w-4" /> Call
              </a>
            )}
            {lead.phone && (
              <a href={`https://wa.me/${lead.phone.replace(/[^0-9+]/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
            <button onClick={() => setShowTaskInput(!showTaskInput)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50">
              <CheckSquare className="h-4 w-4" /> Add Task
            </button>
            <button onClick={() => setShowStages(!showStages)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50">
              <ChevronRight className="h-4 w-4" /> Move Stage
            </button>
          </div>

          {/* Add Task Input */}
          {showTaskInput && (
            <div className="mb-5 rounded-2xl border border-stone-200 bg-stone-50 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">Quick task</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Follow up on proposal"
                  className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && taskTitle.trim()) {
                      onAddTask(lead.id, taskTitle.trim());
                      setTaskTitle("");
                      setShowTaskInput(false);
                    }
                  }}
                />
                <Button
                  onClick={() => { if (taskTitle.trim()) { onAddTask(lead.id, taskTitle.trim()); setTaskTitle(""); setShowTaskInput(false); } }}
                  className="rounded-xl bg-stone-950 text-white hover:bg-stone-800"
                  size="sm"
                >Add</Button>
              </div>
            </div>
          )}

          {/* Move Stage Selector */}
          {showStages && (
            <div className="mb-5 space-y-1.5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">Move to stage</p>
              {STAGES.map((stage) => {
                const meta = STAGE_META[stage];
                const isCurrent = stage === lead.stage;
                return (
                  <button
                    key={stage}
                    onClick={() => { if (!isCurrent) { onMoveStage(lead.id, stage); setShowStages(false); } }}
                    disabled={isCurrent}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-left transition ${
                      isCurrent ? "border-yellow-200 bg-yellow-50" : "border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <div>
                      <span className={`text-sm font-medium ${isCurrent ? "text-stone-950" : "text-stone-700"}`}>{stage}</span>
                      <p className="text-xs text-stone-500">{meta.objective}</p>
                    </div>
                    {isCurrent ? (
                      <Badge className="rounded-full border border-yellow-200 bg-yellow-100 text-xs text-yellow-900">Current</Badge>
                    ) : (
                      <ChevronRight className="h-4 w-4 text-stone-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Lead Details */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Lead details</p>
            {details.map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="rounded-2xl border border-stone-200 p-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-stone-100 p-2">
                      <Icon className="h-4 w-4 text-stone-700" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-stone-400">{row.label}</p>
                      <p className="mt-0.5 text-sm font-medium text-stone-900">{row.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">Notes</p>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700">
                {lead.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 px-6 py-4">
          <Button variant="outline" onClick={onClose} className="w-full rounded-2xl border-stone-200">
            <ExternalLink className="mr-2 h-4 w-4" /> Open Full Lead
          </Button>
        </div>
      </div>
    </>
  );
}

/* ── Main Pipeline View ── */

export function PipelineView() {
  const { canEdit } = useAuth();
  const [pipeline, setPipeline] = useState<Record<string, SalesLead[]>>({});
  const [loading, setLoading] = useState(true);
  const [previewLead, setPreviewLead] = useState<SalesLead | null>(null);

  const fetchPipeline = async () => {
    setLoading(true);
    try { const data = await salesLeadsApi.getPipeline(); setPipeline(data); } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchPipeline(); }, []);

  const handleMoveStage = async (leadId: string, newStage: string) => {
    try {
      await salesLeadsApi.updateStage(leadId, newStage);
      // Update preview lead's stage locally
      setPreviewLead((prev) => prev ? { ...prev, stage: newStage } : null);
      fetchPipeline();
    } catch { /* */ }
  };

  const handleAddTask = async (leadId: string, title: string) => {
    try {
      await salesTasksApi.create({ title, owner: "Unassigned", leadId });
    } catch { /* */ }
  };

  const allLeads = Object.values(pipeline).flat();
  const totalCount = allLeads.length;
  const wonCount = pipeline["Won"]?.length || 0;
  const proposalCount = pipeline["Proposal"]?.length || 0;
  const qualifiedCount = pipeline["Qualified"]?.length || 0;

  const summary: [string, string, LucideIcon][] = [
    ["Total in Pipeline", String(totalCount), BadgeDollarSign],
    ["Qualified", String(qualifiedCount), Target],
    ["Proposals", String(proposalCount), FileText],
    ["Won", String(wonCount), TrendingUp],
  ];

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {summary.map(([title, value, Icon]) => (
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

      {/* Professional Sales Funnel */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg text-stone-950">Professional sales funnel</CardTitle>
              <p className="mt-1 text-sm text-stone-500">Click any lead card to open the preview panel.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">Stage-based process</Badge>
              <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">SLA driven</Badge>
              <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">Best-practice flow</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <p className="py-12 text-center text-sm text-stone-500">Loading pipeline...</p>
          ) : (
            <>
              {/* Stage Headers */}
              <div className="overflow-x-auto pb-1">
                <div className="grid min-w-[1100px] grid-cols-7 gap-3">
                  {STAGES.map((stage, index) => {
                    const meta = STAGE_META[stage];
                    const items = pipeline[stage] || [];
                    const share = totalCount > 0 ? Math.round((items.length / totalCount) * 100) : 0;
                    const colorClass = STAGE_COLORS[meta.tone] || STAGE_COLORS.stone;
                    return (
                      <div key={stage}>
                        <div className={`rounded-3xl border p-4 shadow-sm ${colorClass}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">Stage {index + 1}</p>
                              <h3 className="mt-1 text-sm font-semibold">{stage}</h3>
                            </div>
                            <div className="rounded-2xl border border-white/60 bg-white/70 px-2.5 py-1 text-sm font-semibold text-stone-900">{items.length}</div>
                          </div>
                          <div className="mt-3 space-y-2 text-xs">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.14em] opacity-60">Objective</p>
                              <p className="mt-0.5 font-medium text-stone-800">{meta.objective}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <div className="rounded-xl bg-white/70 px-2 py-1.5">
                                <p className="text-[10px] uppercase tracking-[0.12em] text-stone-400">SLA</p>
                                <p className="mt-0.5 font-medium text-stone-900">{meta.sla}</p>
                              </div>
                              <div className="rounded-xl bg-white/70 px-2 py-1.5">
                                <p className="text-[10px] uppercase tracking-[0.12em] text-stone-400">Share</p>
                                <p className="mt-0.5 font-medium text-stone-900">{share}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lead Cards */}
              <div className="overflow-x-auto pb-1">
                <div className="grid min-w-[1100px] grid-cols-7 gap-3">
                  {STAGES.map((stage) => {
                    const meta = STAGE_META[stage];
                    const items = pipeline[stage] || [];
                    return (
                      <div key={stage} className="rounded-3xl bg-stone-50 p-3">
                        <div className="mb-3 flex items-start justify-between gap-2 px-1">
                          <div>
                            <p className="text-sm font-semibold text-stone-900">{stage}</p>
                            <p className="mt-0.5 text-xs text-stone-500">{meta.objective}</p>
                          </div>
                          <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">{items.length}</Badge>
                        </div>
                        <div className="space-y-2">
                          {items.map((lead) => (
                            <div
                              key={lead.id}
                              className="cursor-pointer rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:ring-1 hover:ring-yellow-200"
                              onClick={() => setPreviewLead(lead)}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-medium text-stone-900">{lead.name}</p>
                                  <p className="mt-1 text-xs text-stone-500">{lead.type || "Lead"}</p>
                                </div>
                                <MoreHorizontal className="h-4 w-4 shrink-0 text-stone-400" />
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <Badge className="rounded-full border border-stone-200 bg-stone-50 text-xs text-stone-700">{lead.source}</Badge>
                                <ScoreBadge value={lead.score} />
                              </div>
                              {(lead.assignedAgentName || lead.targetArea) && (
                                <div className="mt-2 rounded-xl bg-stone-50 px-2.5 py-1.5 text-xs text-stone-600">
                                  {lead.assignedAgentName && <span>Agent: <span className="font-medium text-stone-800">{lead.assignedAgentName}</span></span>}
                                  {lead.targetArea && <span className="ml-1">· {lead.targetArea}</span>}
                                </div>
                              )}
                            </div>
                          ))}
                          {items.length === 0 && <p className="py-6 text-center text-xs text-stone-400">No leads</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Stage Rules + Performance */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">Stage rules</CardTitle>
            <p className="text-sm text-stone-500">Houseiana-specific pipeline logic for premium lead handling</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {STAGES.filter((s) => s !== "Lost").map((stage) => {
              const meta = STAGE_META[stage];
              return (
                <div key={stage} className="rounded-2xl border border-stone-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-stone-950">{stage}</p>
                      <p className="mt-1 text-sm leading-6 text-stone-500">{meta.objective}</p>
                    </div>
                    <Badge className="shrink-0 rounded-full border border-stone-200 bg-stone-50 text-xs text-stone-500">{meta.sla}</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">Pipeline performance trend</CardTitle>
            <p className="text-sm text-stone-500">Movement speed from first contact to proposal and close</p>
          </CardHeader>
          <CardContent><MiniLineChart /></CardContent>
        </Card>
      </div>

      {/* Lead Preview Drawer */}
      {previewLead && (
        <LeadPreviewDrawer
          lead={previewLead}
          onClose={() => setPreviewLead(null)}
          onMoveStage={handleMoveStage}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
}
