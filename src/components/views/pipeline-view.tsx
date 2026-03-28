"use client";

import {
  BadgeDollarSign,
  Target,
  FileText,
  TrendingUp,
  CircleDot,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/score-badge";
import { MiniLineChart } from "@/components/charts";
import { pipeline } from "@/lib/data";
import type { LucideIcon } from "lucide-react";

export function PipelineView() {
  const summary: [string, string, LucideIcon][] = [
    ["Pipeline Value", "QAR 1.8M", BadgeDollarSign],
    ["Qualified Leads", "41", Target],
    ["Proposal Sent", "16", FileText],
    ["Win Momentum", "+18%", TrendingUp],
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
              <div className="rounded-2xl bg-yellow-50 p-3 ring-1 ring-yellow-100">
                <Icon className="h-5 w-5 text-stone-900" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg text-stone-950">Pipeline board</CardTitle>
              <p className="mt-1 text-sm text-stone-500">
                Owner, guest, and investor lead progression
              </p>
            </div>
            <Button variant="outline" className="rounded-2xl border-stone-200">
              View Full Pipeline
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 xl:grid-cols-5">
            {Object.entries(pipeline).map(([stage, items]) => (
              <div key={stage} className="rounded-3xl bg-stone-50 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{stage}</p>
                    <p className="text-xs text-stone-500">{items.length} leads</p>
                  </div>
                  <CircleDot className="h-4 w-4 text-stone-400" />
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-stone-900">{item.name}</p>
                          <p className="mt-1 text-xs text-stone-500">{item.badge}</p>
                        </div>
                        <MoreHorizontal className="h-4 w-4 text-stone-400" />
                      </div>
                      <div className="mt-3">
                        <ScoreBadge value={item.score} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">Stage rules</CardTitle>
            <p className="text-sm text-stone-500">
              Houseiana-specific pipeline logic for premium lead handling
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["New Lead", "Auto-assign by source or language"],
              ["Qualified", "Requires budget or ownership fit"],
              ["Proposal", "Offer or management package sent"],
              ["Won", "Deal confirmed or listing signed"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-stone-200 p-4">
                <p className="font-medium text-stone-950">{title}</p>
                <p className="mt-1 text-sm leading-6 text-stone-500">{text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">
              Pipeline performance trend
            </CardTitle>
            <p className="text-sm text-stone-500">
              Movement speed from first contact to proposal and close
            </p>
          </CardHeader>
          <CardContent>
            <MiniLineChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
