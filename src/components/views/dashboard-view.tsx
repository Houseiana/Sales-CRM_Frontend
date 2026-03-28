"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Phone,
  Mail,
  MessageCircle,
  Building2,
  Globe,
  CalendarClock,
  Flame,
  CheckSquare,
  CircleDot,
  MoreHorizontal,
  MapPin,
  BadgeDollarSign,
  Clock3,
  UserRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScoreBadge } from "@/components/score-badge";
import { MiniBarChart } from "@/components/charts";
import { stats as defaultStats, leads as defaultLeads, pipeline as defaultPipeline, timeline, tasks as defaultTasks, reports as defaultReports } from "@/lib/data";
import { salesLeadsApi, salesTasksApi, type SalesLead, type DashboardData, type SalesTaskItem } from "@/lib/api";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { LucideIcon } from "lucide-react";

const timelineIcons: Record<string, LucideIcon> = {
  MessageCircle,
  Phone,
  Flame,
  CheckSquare,
};

function StatCards({ statsData }: { statsData: typeof defaultStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {statsData.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
        >
          <Card className="rounded-3xl border-stone-200/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-2xl bg-yellow-50 p-2.5 ring-1 ring-yellow-100">
                  <ArrowUpRight className="h-5 w-5 text-stone-900" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
                  {stat.change}
                </Badge>
                <span className="text-sm text-stone-500">{stat.sub}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function AnalyticsSection({ reportsData, t }: { reportsData: typeof defaultReports; t: Dictionary }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader className="pb-0">
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
        <CardContent className="pt-2">
          <MiniBarChart />
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-stone-950">{t.dashboard.leadSources}</CardTitle>
          <p className="text-sm text-stone-500">{t.dashboard.topChannels}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {reportsData.sources.map(([source, value]) => (
            <div key={source}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-stone-800">{source}</span>
                <span className="text-stone-500">{value}</span>
              </div>
              <div className="h-2 rounded-full bg-stone-100">
                <div className="h-2 rounded-full bg-stone-900" style={{ width: value }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function PipelineBoardCompact({ pipelineData, t }: { pipelineData: Record<string, { name: string; badge: string; score: string }[]>; t: Dictionary }) {
  const stageNameMap: Record<string, string> = {
    "New Lead": t.stages.newLead, Contacted: t.stages.contacted, Qualified: t.stages.qualified,
    Proposal: t.stages.proposal, Negotiation: t.stages.negotiation, Won: t.stages.won, Lost: t.stages.lost,
  };
  const stageObjMap: Record<string, string> = {
    "New Lead": t.stageObjectives.newLead, Contacted: t.stageObjectives.contacted, Qualified: t.stageObjectives.qualified,
    Proposal: t.stageObjectives.proposal, Negotiation: t.stageObjectives.negotiation, Won: t.stageObjectives.won,
  };
  const stageSlaMap: Record<string, string> = {
    "New Lead": t.stageSLAs.newLead, Contacted: t.stageSLAs.contacted, Qualified: t.stageSLAs.qualified,
    Proposal: t.stageSLAs.proposal, Negotiation: t.stageSLAs.negotiation, Won: t.stageSLAs.won,
  };

  const SNAPSHOT_COLORS: Record<string, string> = {
    stone: "border-stone-200 bg-stone-50", amber: "border-amber-200 bg-amber-50",
    yellow: "border-yellow-200 bg-yellow-50", orange: "border-orange-200 bg-orange-50",
    emerald: "border-emerald-200 bg-emerald-50", green: "border-lime-200 bg-lime-50",
  };
  const SNAPSHOT_STAGE_TONES: Record<string, string> = {
    "New Lead": "stone", Contacted: "amber", Qualified: "yellow", Proposal: "orange", Negotiation: "emerald", Won: "green",
  };

  const stages = Object.entries(pipelineData);
  const totalLeads = stages.reduce((s, [, items]) => s + items.length, 0);

  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg text-stone-950">{t.dashboard.pipelineSnapshot}</CardTitle>
            <p className="mt-1 text-sm text-stone-500">
              {t.dashboard.pipelineSub}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">{t.pipeline.stageBased}</Badge>
            <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">{t.pipeline.slaDriven}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stage Headers */}
        <div className="grid gap-3 xl:grid-cols-5">
          {stages.slice(0, 5).map(([stage, items], index) => {
            const tone = SNAPSHOT_STAGE_TONES[stage] || "stone";
            const colorClass = SNAPSHOT_COLORS[tone] || SNAPSHOT_COLORS.stone;
            const share = totalLeads > 0 ? Math.round((items.length / totalLeads) * 100) : 0;
            return (
              <div key={stage} className={`rounded-2xl border p-3 ${colorClass}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-60">Stage {index + 1}</p>
                    <p className="mt-0.5 text-sm font-semibold text-stone-900">{stageNameMap[stage] || stage}</p>
                  </div>
                  <span className="rounded-xl bg-white/70 px-2 py-0.5 text-sm font-semibold text-stone-900">{items.length}</span>
                </div>
                <p className="mt-1.5 text-xs text-stone-600">{stageObjMap[stage] || ""}</p>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <div className="rounded-lg bg-white/70 px-2 py-1">
                    <p className="text-[9px] uppercase tracking-wider text-stone-400">{t.pipeline.sla}</p>
                    <p className="text-[11px] font-medium text-stone-800">{stageSlaMap[stage] || ""}</p>
                  </div>
                  <div className="rounded-lg bg-white/70 px-2 py-1">
                    <p className="text-[9px] uppercase tracking-wider text-stone-400">{t.pipeline.share}</p>
                    <p className="text-[11px] font-medium text-stone-800">{share}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lead Cards */}
        <div className="grid gap-3 xl:grid-cols-5">
          {stages.slice(0, 5).map(([stage, items]) => {
            return (
              <div key={stage} className="rounded-3xl bg-stone-50 p-3">
                <div className="mb-2 flex items-start justify-between px-1">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{stageNameMap[stage] || stage}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{stageObjMap[stage] || ""}</p>
                  </div>
                  <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-stone-900">{item.name}</p>
                          <p className="mt-1 text-xs text-stone-500">{item.badge}</p>
                        </div>
                        <MoreHorizontal className="h-4 w-4 text-stone-400" />
                      </div>
                      <div className="mt-2">
                        <ScoreBadge value={item.score} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function LeadTableCompact({ leadsData, t }: { leadsData: typeof defaultLeads; t: Dictionary }) {
  const headerClass = "grid-cols-[1.2fr_1fr_0.9fr_0.8fr_0.8fr_1fr_0.7fr]";
  const filterLabels = [t.all, t.leads.owners, t.leads.guests, t.leads.investors, t.leads.hot];
  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg text-stone-950">{t.dashboard.recentLeads}</CardTitle>
            <p className="mt-1 text-sm text-stone-500">
              {t.dashboard.fastAccess}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterLabels.map((f, i) => (
              <Button
                key={f}
                variant={i === 0 ? "default" : "outline"}
                className={`rounded-2xl ${
                  i === 0 ? "bg-stone-950 text-white hover:bg-stone-800" : "border-stone-200"
                }`}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl border border-stone-200">
          <div
            className={`grid ${headerClass} gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500`}
          >
            <div>{t.leads.lead}</div>
            <div>{t.leads.type}</div>
            <div>{t.leads.source}</div>
            <div>{t.leads.city}</div>
            <div>{t.leads.budget}</div>
            <div>{t.createLead.nextFollowUp}</div>
            <div>{t.leads.score}</div>
          </div>
          {leadsData.map((lead) => (
            <div
              key={lead.name}
              className={`grid ${headerClass} gap-3 border-b border-stone-200 px-4 py-4 text-sm last:border-b-0 hover:bg-stone-50/70`}
            >
              <div>
                <p className="font-semibold text-stone-950">{lead.name}</p>
                <p className="mt-1 text-xs text-stone-500">{t.preview.agent}: {lead.agent}</p>
              </div>
              <div className="text-stone-700">{lead.type}</div>
              <div className="text-stone-700">{lead.source}</div>
              <div className="text-stone-700">{lead.city}</div>
              <div className="text-stone-700">{lead.budget}</div>
              <div className="text-stone-700">{lead.next}</div>
              <div>
                <ScoreBadge value={lead.score} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LeadProfileCard({ lead, t }: { lead?: SalesLead; t: Dictionary }) {
  const details: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Phone, label: t.createLead.mobileWhatsapp, value: lead?.phone || "+974 5555 1298" },
    { icon: Mail, label: t.createLead.emailAddress, value: lead?.email || "omar.hassan@email.com" },
    { icon: Globe, label: t.createLead.preferredLanguage, value: lead?.language || "Arabic / English" },
    { icon: BadgeDollarSign, label: t.createLead.expectedPrice, value: lead?.budget || "High-value owner" },
    { icon: MapPin, label: t.createLead.targetLocation, value: lead?.targetArea || "Lusail / The Pearl" },
    { icon: CalendarClock, label: t.createLead.nextFollowUp, value: lead?.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleString() : "Call today at 4:00 PM" },
  ];
  const displayName = lead?.name || "Omar Hassan";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 rounded-2xl">
              <AvatarFallback className="rounded-2xl bg-stone-950 text-base text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl text-stone-950">{displayName}</CardTitle>
              <p className="mt-1 text-sm text-stone-500">{lead?.type || "Property Owner"} • {lead?.source || "Meta Ads"} • {lead?.city || "Doha"}</p>
            </div>
          </div>
          <ScoreBadge value={lead?.score || "Priority"} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {details.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="rounded-2xl border border-stone-200 p-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-stone-100 p-2">
                    <Icon className="h-4 w-4 text-stone-700" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-stone-400">
                      {row.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-stone-900">{row.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Button className="rounded-2xl bg-stone-950 text-white hover:bg-stone-800">
            <Phone className="mr-2 h-4 w-4" /> {t.preview.call}
          </Button>
          <Button variant="outline" className="rounded-2xl border-stone-200">
            <MessageCircle className="mr-2 h-4 w-4" /> {t.preview.whatsapp}
          </Button>
          <Button variant="outline" className="rounded-2xl border-stone-200">
            <CheckSquare className="mr-2 h-4 w-4" /> {t.preview.addTask}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityTimeline({ t }: { t: Dictionary }) {
  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-stone-950">{t.dashboard.leadTimeline}</CardTitle>
        <p className="text-sm text-stone-500">{t.dashboard.allTouchpoints}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {timeline.map((item, i) => {
            const Icon = timelineIcons[item.iconName];
            return (
              <div key={item.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-950 text-white shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  {i < timeline.length - 1 && <div className="mt-2 h-full w-px bg-stone-200" />}
                </div>
                <div className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-stone-950">{item.title}</p>
                    <span className="text-xs text-stone-400">{item.time}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function RightRail({ tasksData, reportsData, t }: { tasksData: Record<string, { title: string; time: string; level: string; owner: string }[]>; reportsData: typeof defaultReports; t: Dictionary }) {
  return (
    <div className="space-y-4">
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-stone-950">{t.dashboard.todaysTasks}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(tasksData.Today || []).map((item) => (
            <div key={item.title} className="rounded-2xl border border-stone-200 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-stone-900">{item.title}</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                    <Clock3 className="h-3.5 w-3.5" /> {item.time}
                  </div>
                </div>
                <ScoreBadge value={item.level} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-stone-950">{t.dashboard.teamPerformance}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reportsData.team.map(([name, meta]) => (
            <div key={name} className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100">
                <UserRound className="h-5 w-5 text-stone-700" />
              </div>
              <div>
                <p className="font-medium text-stone-900">{name}</p>
                <p className="text-sm text-stone-500">{meta}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-stone-200/80 bg-gradient-to-br from-stone-950 to-stone-800 text-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-2.5">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Houseiana Standard</p>
              <p className="text-sm text-white/70">Operational clarity with premium control</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DashboardView() {
  const { t } = useLocale();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [apiLeads, setApiLeads] = useState<SalesLead[]>([]);
  const [apiPipeline, setApiPipeline] = useState<Record<string, SalesLead[]> | null>(null);
  const [apiTasks, setApiTasks] = useState<SalesTaskItem[]>([]);

  useEffect(() => {
    salesLeadsApi.getDashboard().then(setDashboard).catch(() => {});
    salesLeadsApi.getAll({ pageSize: "10" }).then((r) => setApiLeads(r.items)).catch(() => {});
    salesLeadsApi.getPipeline().then(setApiPipeline).catch(() => {});
    salesTasksApi.getAll({ status: "today" }).then(setApiTasks).catch(() => {});
  }, []);

  // Use API data when available, fall back to static
  const stats = dashboard
    ? [
        { label: t.dashboard.totalLeads, value: String(dashboard.totalLeads), change: "+12.4%", sub: t.dashboard.vsLastMonth },
        { label: t.dashboard.newToday, value: String(dashboard.newToday), change: "+8.1%", sub: t.dashboard.freshInbound },
        { label: t.dashboard.hotLeads, value: String(dashboard.hotLeads), change: "+21.0%", sub: t.dashboard.priorityFollowUp },
        { label: t.dashboard.conversionRate, value: `${dashboard.conversionRate}%`, change: "+2.3%", sub: t.dashboard.qualifiedToWon },
      ]
    : defaultStats;

  const leads = apiLeads.length > 0
    ? apiLeads.map((l) => ({
        name: l.name,
        type: l.type,
        source: l.source,
        city: l.city || "",
        budget: l.budget || "N/A",
        score: l.score,
        next: l.nextFollowUp ? new Date(l.nextFollowUp).toLocaleString() : "Not set",
        agent: l.assignedAgentName || t.leads.unassigned,
        language: l.language || "",
        status: l.stage,
      }))
    : defaultLeads;

  const reports = dashboard
    ? {
        sources: Object.entries(dashboard.sourceCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([s, c]) => [s, `${Math.round((c / Math.max(dashboard.totalLeads, 1)) * 100)}%`] as [string, string]),
        team: dashboard.teamStats.map(
          (ts) => [ts.name, `${ts.leadsHandled} ${t.reports.leadsHandled}`, `${ts.winRate}% ${t.reports.winRate}`] as [string, string, string]
        ),
      }
    : defaultReports;

  const pipeline = apiPipeline
    ? Object.fromEntries(
        Object.entries(apiPipeline).map(([stage, items]) => [
          stage,
          items.map((l) => ({ name: l.name, badge: l.source, score: l.score })),
        ])
      )
    : defaultPipeline;

  const tasks = apiTasks.length > 0
    ? {
        Today: apiTasks.filter((tk) => !tk.isCompleted).slice(0, 3).map((tk) => ({
          title: tk.title, time: tk.dueDate ? new Date(tk.dueDate).toLocaleTimeString() : "", level: tk.priority, owner: tk.owner,
        })),
      }
    : defaultTasks;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-stone-500">{t.dashboard.showingWorkspace}</p>
          <h2 className="text-xl font-semibold tracking-tight text-stone-950">{t.nav.dashboard}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {[`${t.dashboard.followupsDue}: ${dashboard?.tasksDueToday ?? 12}`, `${t.dashboard.missed}: ${dashboard?.overdueTasks ?? 3}`, `${t.dashboard.wonThisWeek}: 9`].map((item) => (
            <Badge key={item} className="rounded-full border border-stone-200 bg-white text-stone-700">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <StatCards statsData={stats} />
      <AnalyticsSection reportsData={reports} t={t} />
      <PipelineBoardCompact pipelineData={pipeline} t={t} />

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.45fr_0.9fr]">
        <LeadTableCompact leadsData={leads} t={t} />
        <RightRail tasksData={tasks} reportsData={reports} t={t} />
      </div>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[0.9fr_1.1fr]">
        <LeadProfileCard lead={apiLeads[0]} t={t} />
        <ActivityTimeline t={t} />
      </div>
    </div>
  );
}
