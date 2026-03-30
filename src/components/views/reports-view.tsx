"use client";

import { useEffect, useState } from "react";
import { UserRound, ChartNoAxesColumn, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiniBarChart, MiniLineChart } from "@/components/charts";
import { salesLeadsApi, type DashboardData } from "@/lib/api";
import { useLocale } from "@/lib/i18n/locale-context";

export function ReportsView() {
  const { t } = useLocale();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    salesLeadsApi.getDashboard().then(setDashboard).catch(() => {});
  }, []);

  // Pipeline bar chart: real counts per stage from API
  const STAGE_ORDER = ["New Lead", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
  const barData   = dashboard ? STAGE_ORDER.map((s) => dashboard.pipelineCounts[s] ?? 0) : undefined;
  const barLabels = STAGE_ORDER.map((s) => s.split(" ")[0]);

  const sources: [string, string][] = dashboard
    ? Object.entries(dashboard.sourceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([s, c]) => [s, `${Math.round((c / Math.max(dashboard.totalLeads, 1)) * 100)}%`])
    : [];

  const team: [string, string, string][] = dashboard
    ? dashboard.teamStats.map((ts) => [
        ts.name,
        `${ts.leadsHandled} ${t.reports.leadsHandled}`,
        `${ts.winRate}% ${t.reports.winRate}`,
      ])
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg text-stone-950">{t.dashboard.leadFlowThisWeek}</CardTitle>
                <p className="mt-1 text-sm text-stone-500">
                  {t.dashboard.leadFlowSub}
                </p>
              </div>
              <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">
                7 Days
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <MiniBarChart data={barData} labels={barLabels} />
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">{t.reports.conversionTrend}</CardTitle>
            <p className="text-sm text-stone-500">
              {t.reports.weeklyConversion}
            </p>
          </CardHeader>
          <CardContent>
            <MiniLineChart data={undefined} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.55fr_0.45fr]">
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">{t.dashboard.leadSources}</CardTitle>
            <p className="text-sm text-stone-500">{t.dashboard.topChannels}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {sources.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-2xl bg-stone-100 p-4 mb-3">
                  <BarChart3 className="h-5 w-5 text-stone-400" />
                </div>
                <p className="text-sm text-stone-500">{t.leads.noLeadsFound}</p>
              </div>
            ) : (
              sources.map(([source, value]) => (
                <div key={source}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-stone-800">{source}</span>
                    <span className="text-stone-500">{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100">
                    <div className="h-2 rounded-full bg-stone-900" style={{ width: value }} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg text-stone-950">{t.dashboard.teamPerformance}</CardTitle>
              <div className="rounded-2xl bg-stone-100 p-2">
                <ChartNoAxesColumn className="h-4 w-4 text-stone-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {team.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-2xl bg-stone-100 p-4 mb-3">
                  <UserRound className="h-5 w-5 text-stone-400" />
                </div>
                <p className="text-sm text-stone-500">{t.leads.noLeadsFound}</p>
              </div>
            ) : (
              team.map(([name, meta, winRate]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-2xl border border-stone-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100">
                      <UserRound className="h-5 w-5 text-stone-700" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">{name}</p>
                      <p className="text-sm text-stone-500">{meta}</p>
                    </div>
                  </div>
                  <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
                    {winRate}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
