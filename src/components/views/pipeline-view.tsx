"use client";

import { useEffect, useState } from "react";
import { BadgeDollarSign, Target, FileText, TrendingUp, ChevronRight, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/score-badge";
import { Modal } from "@/components/ui/modal";
import { MiniLineChart } from "@/components/charts";
import { useAuth } from "@/lib/auth-context";
import { salesLeadsApi, type SalesLead } from "@/lib/api";
import type { LucideIcon } from "lucide-react";

/* ── Stage metadata (mirrors the design reference) ── */

interface StageMeta {
  objective: string;
  sla: string;
  tone: string;
}

const STAGE_META: Record<string, StageMeta> = {
  "New Lead": {
    objective: "Capture and verify the opportunity",
    sla: "Respond in 15 min",
    tone: "stone",
  },
  Contacted: {
    objective: "Make first contact and confirm fit",
    sla: "Same day follow-up",
    tone: "amber",
  },
  Qualified: {
    objective: "Validate budget, location, and service fit",
    sla: "Move within 24h",
    tone: "yellow",
  },
  Proposal: {
    objective: "Send offer, package, or commercial proposal",
    sla: "Within 24h of qualification",
    tone: "orange",
  },
  Negotiation: {
    objective: "Resolve objections and align on terms",
    sla: "Daily touchpoint",
    tone: "emerald",
  },
  Won: {
    objective: "Confirm, hand off, and start onboarding",
    sla: "Immediate handoff",
    tone: "green",
  },
  Lost: {
    objective: "Document reason and archive",
    sla: "Post-mortem review",
    tone: "slate",
  },
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

export function PipelineView() {
  const { canEdit } = useAuth();
  const [pipeline, setPipeline] = useState<Record<string, SalesLead[]>>({});
  const [loading, setLoading] = useState(true);
  const [moveLead, setMoveLead] = useState<SalesLead | null>(null);

  const fetchPipeline = async () => {
    setLoading(true);
    try { const data = await salesLeadsApi.getPipeline(); setPipeline(data); } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchPipeline(); }, []);

  const handleMoveStage = async (leadId: string, newStage: string) => {
    try { await salesLeadsApi.updateStage(leadId, newStage); setMoveLead(null); fetchPipeline(); } catch { /* */ }
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
      {/* ── KPI Row ── */}
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

      {/* ── Professional Sales Funnel ── */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg text-stone-950">Professional sales funnel</CardTitle>
              <p className="mt-1 text-sm text-stone-500">
                Move opportunities through clear gates instead of a loose lead list.
              </p>
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
              {/* Stage Headers Row */}
              <div className="overflow-x-auto pb-1">
                <div className="grid min-w-[1100px] grid-cols-7 gap-3">
                  {STAGES.map((stage, index) => {
                    const meta = STAGE_META[stage];
                    const items = pipeline[stage] || [];
                    const share = totalCount > 0 ? Math.round((items.length / totalCount) * 100) : 0;
                    const colorClass = STAGE_COLORS[meta.tone] || STAGE_COLORS.stone;

                    return (
                      <div key={stage} className="relative">
                        <div className={`rounded-3xl border p-4 shadow-sm ${colorClass}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">Stage {index + 1}</p>
                              <h3 className="mt-1 text-sm font-semibold">{stage}</h3>
                            </div>
                            <div className="rounded-2xl border border-white/60 bg-white/70 px-2.5 py-1 text-sm font-semibold text-stone-900">
                              {items.length}
                            </div>
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

              {/* Lead Cards Row */}
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
                              className={`rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition ${
                                canEdit ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""
                              }`}
                              onClick={() => canEdit && setMoveLead(lead)}
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
                          {items.length === 0 && (
                            <p className="py-6 text-center text-xs text-stone-400">No leads in this stage</p>
                          )}
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

      {/* ── Stage Rules + Performance ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">Stage rules</CardTitle>
            <p className="text-sm text-stone-500">Houseiana-specific pipeline logic for premium lead handling</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {STAGES.filter((s) => s !== "Lost").map((stage, i) => {
              const meta = STAGE_META[stage];
              return (
                <div key={stage} className="rounded-2xl border border-stone-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-stone-950">{stage}</p>
                      <p className="mt-1 text-sm leading-6 text-stone-500">{meta.objective}</p>
                    </div>
                    <Badge className="shrink-0 rounded-full border border-stone-200 bg-stone-50 text-xs text-stone-500">
                      {meta.sla}
                    </Badge>
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

      {/* ── Move Stage Modal ── */}
      <Modal open={!!moveLead} onClose={() => setMoveLead(null)} title={`Move "${moveLead?.name}" to stage`}>
        {moveLead && (
          <div className="space-y-2">
            <p className="mb-3 text-sm text-stone-500">
              Current stage: <span className="font-semibold text-stone-900">{moveLead.stage}</span>
            </p>
            {STAGES.map((stage) => {
              const meta = STAGE_META[stage];
              return (
                <button
                  key={stage}
                  onClick={() => handleMoveStage(moveLead.id, stage)}
                  disabled={stage === moveLead.stage}
                  className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                    stage === moveLead.stage
                      ? "border-yellow-200 bg-yellow-50 text-stone-950"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <div>
                    <span className="text-sm font-medium">{stage}</span>
                    <p className="mt-0.5 text-xs text-stone-500">{meta.objective}</p>
                  </div>
                  {stage === moveLead.stage ? (
                    <Badge className="rounded-full border border-yellow-200 bg-yellow-100 text-yellow-900">Current</Badge>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-stone-400" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
