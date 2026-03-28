"use client";

import { useEffect, useState } from "react";
import { BadgeDollarSign, Target, FileText, TrendingUp, CircleDot, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/score-badge";
import { Modal } from "@/components/ui/modal";
import { MiniLineChart } from "@/components/charts";
import { useAuth } from "@/lib/auth-context";
import { salesLeadsApi, type SalesLead } from "@/lib/api";
import type { LucideIcon } from "lucide-react";

const STAGES = ["New Lead", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

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
  const wonCount = pipeline["Won"]?.length || 0;
  const proposalCount = pipeline["Proposal"]?.length || 0;
  const qualifiedCount = pipeline["Qualified"]?.length || 0;

  const summary: [string, string, LucideIcon][] = [
    ["Total in Pipeline", String(allLeads.length), BadgeDollarSign],
    ["Qualified", String(qualifiedCount), Target],
    ["Proposals", String(proposalCount), FileText],
    ["Won", String(wonCount), TrendingUp],
  ];

  return (
    <div className="space-y-4">
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

      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-stone-950">Pipeline board</CardTitle>
          <p className="text-sm text-stone-500">Click a lead card to move it to a different stage</p>
        </CardHeader>
        <CardContent>
          {loading ? <p className="py-12 text-center text-sm text-stone-500">Loading pipeline...</p> : (
            <div className="grid gap-4 xl:grid-cols-7">
              {STAGES.map((stage) => {
                const items = pipeline[stage] || [];
                return (
                  <div key={stage} className="rounded-3xl bg-stone-50 p-3">
                    <div className="mb-3 flex items-center justify-between px-1">
                      <div>
                        <p className="text-sm font-semibold text-stone-900">{stage}</p>
                        <p className="text-xs text-stone-500">{items.length}</p>
                      </div>
                      <CircleDot className="h-4 w-4 text-stone-400" />
                    </div>
                    <div className="space-y-2">
                      {items.map((lead) => (
                        <div key={lead.id}
                          className={`rounded-2xl border border-stone-200 bg-white p-3 shadow-sm ${canEdit ? "cursor-pointer hover:ring-1 hover:ring-yellow-200" : ""}`}
                          onClick={() => canEdit && setMoveLead(lead)}>
                          <p className="text-sm font-medium text-stone-900">{lead.name}</p>
                          <p className="mt-1 text-xs text-stone-500">{lead.source}</p>
                          <div className="mt-2"><ScoreBadge value={lead.score} /></div>
                        </div>
                      ))}
                      {items.length === 0 && <p className="py-4 text-center text-xs text-stone-400">Empty</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">Stage rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[["New Lead", "Auto-assign by source or language"], ["Qualified", "Requires budget or ownership fit"],
              ["Proposal", "Offer or management package sent"], ["Won", "Deal confirmed or listing signed"]].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-stone-200 p-4">
                <p className="font-medium text-stone-950">{t}</p><p className="mt-1 text-sm text-stone-500">{d}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-stone-950">Pipeline performance trend</CardTitle></CardHeader>
          <CardContent><MiniLineChart /></CardContent>
        </Card>
      </div>

      <Modal open={!!moveLead} onClose={() => setMoveLead(null)} title={`Move "${moveLead?.name}" to stage`}>
        {moveLead && (
          <div className="space-y-2">
            <p className="mb-3 text-sm text-stone-500">Current stage: <span className="font-semibold text-stone-900">{moveLead.stage}</span></p>
            {STAGES.map((stage) => (
              <button key={stage} onClick={() => handleMoveStage(moveLead.id, stage)} disabled={stage === moveLead.stage}
                className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${stage === moveLead.stage ? "border-yellow-200 bg-yellow-50 text-stone-950" : "border-stone-200 hover:bg-stone-50"}`}>
                <span className="text-sm font-medium">{stage}</span>
                {stage === moveLead.stage ? <Badge className="rounded-full border border-yellow-200 bg-yellow-100 text-yellow-900">Current</Badge> : <ChevronRight className="h-4 w-4 text-stone-400" />}
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
