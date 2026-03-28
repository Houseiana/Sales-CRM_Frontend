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

function AnalyticsSection({ reportsData }: { reportsData: typeof defaultReports }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg text-stone-950">Lead flow this week</CardTitle>
              <p className="mt-1 text-sm text-stone-500">
                Capture, qualification, and follow-up momentum
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
          <CardTitle className="text-lg text-stone-950">Lead sources</CardTitle>
          <p className="text-sm text-stone-500">Top performing channels this month</p>
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

const SNAPSHOT_STAGE_META: Record<string, { objective: string; sla: string; tone: string }> = {
  "New Lead": { objective: "Capture and verify", sla: "15 min response", tone: "stone" },
  Contacted: { objective: "First contact and fit", sla: "Same day", tone: "amber" },
  Qualified: { objective: "Validate budget and fit", sla: "Within 24h", tone: "yellow" },
  Proposal: { objective: "Send offer or package", sla: "Within 24h", tone: "orange" },
  Negotiation: { objective: "Align on terms", sla: "Daily touchpoint", tone: "emerald" },
  Won: { objective: "Confirm and onboard", sla: "Immediate", tone: "green" },
};

const SNAPSHOT_COLORS: Record<string, string> = {
  stone: "border-stone-200 bg-stone-50", amber: "border-amber-200 bg-amber-50",
  yellow: "border-yellow-200 bg-yellow-50", orange: "border-orange-200 bg-orange-50",
  emerald: "border-emerald-200 bg-emerald-50", green: "border-lime-200 bg-lime-50",
};

function PipelineBoardCompact({ pipelineData }: { pipelineData: Record<string, { name: string; badge: string; score: string }[]> }) {
  const stages = Object.entries(pipelineData);
  const totalLeads = stages.reduce((s, [, items]) => s + items.length, 0);

  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg text-stone-950">Sales funnel snapshot</CardTitle>
            <p className="mt-1 text-sm text-stone-500">
              Move opportunities through clear gates instead of a loose lead list.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">Stage-based</Badge>
            <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">SLA driven</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stage Headers */}
        <div className="grid gap-3 xl:grid-cols-5">
          {stages.slice(0, 5).map(([stage, items], index) => {
            const meta = SNAPSHOT_STAGE_META[stage] || { objective: "", sla: "", tone: "stone" };
            const colorClass = SNAPSHOT_COLORS[meta.tone] || SNAPSHOT_COLORS.stone;
            const share = totalLeads > 0 ? Math.round((items.length / totalLeads) * 100) : 0;
            return (
              <div key={stage} className={`rounded-2xl border p-3 ${colorClass}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-60">Stage {index + 1}</p>
                    <p className="mt-0.5 text-sm font-semibold text-stone-900">{stage}</p>
                  </div>
                  <span className="rounded-xl bg-white/70 px-2 py-0.5 text-sm font-semibold text-stone-900">{items.length}</span>
                </div>
                <p className="mt-1.5 text-xs text-stone-600">{meta.objective}</p>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <div className="rounded-lg bg-white/70 px-2 py-1">
                    <p className="text-[9px] uppercase tracking-wider text-stone-400">SLA</p>
                    <p className="text-[11px] font-medium text-stone-800">{meta.sla}</p>
                  </div>
                  <div className="rounded-lg bg-white/70 px-2 py-1">
                    <p className="text-[9px] uppercase tracking-wider text-stone-400">Share</p>
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
            const meta = SNAPSHOT_STAGE_META[stage] || { objective: "", sla: "", tone: "stone" };
            return (
              <div key={stage} className="rounded-3xl bg-stone-50 p-3">
                <div className="mb-2 flex items-start justify-between px-1">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{stage}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{meta.objective}</p>
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

function LeadTableCompact({ leadsData }: { leadsData: typeof defaultLeads }) {
  const headerClass = "grid-cols-[1.2fr_1fr_0.9fr_0.8fr_0.8fr_1fr_0.7fr]";
  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg text-stone-950">Recent leads</CardTitle>
            <p className="mt-1 text-sm text-stone-500">
              Fast access to the highest priority opportunities
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Owners", "Guests", "Investors", "Hot"].map((f, i) => (
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
            <div>Lead</div>
            <div>Type</div>
            <div>Source</div>
            <div>City</div>
            <div>Budget</div>
            <div>Next Follow-up</div>
            <div>Score</div>
          </div>
          {leadsData.map((lead) => (
            <div
              key={lead.name}
              className={`grid ${headerClass} gap-3 border-b border-stone-200 px-4 py-4 text-sm last:border-b-0 hover:bg-stone-50/70`}
            >
              <div>
                <p className="font-semibold text-stone-950">{lead.name}</p>
                <p className="mt-1 text-xs text-stone-500">Assigned to {lead.agent}</p>
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

function LeadProfileCard({ lead }: { lead?: SalesLead }) {
  const details: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Phone, label: "Phone", value: lead?.phone || "+974 5555 1298" },
    { icon: Mail, label: "Email", value: lead?.email || "omar.hassan@email.com" },
    { icon: Globe, label: "Language", value: lead?.language || "Arabic / English" },
    { icon: BadgeDollarSign, label: "Estimated Value", value: lead?.budget || "High-value owner" },
    { icon: MapPin, label: "Target Area", value: lead?.targetArea || "Lusail / The Pearl" },
    { icon: CalendarClock, label: "Next Action", value: lead?.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleString() : "Call today at 4:00 PM" },
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
            <Phone className="mr-2 h-4 w-4" /> Call
          </Button>
          <Button variant="outline" className="rounded-2xl border-stone-200">
            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
          </Button>
          <Button variant="outline" className="rounded-2xl border-stone-200">
            <CheckSquare className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityTimeline() {
  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-stone-950">Lead timeline</CardTitle>
        <p className="text-sm text-stone-500">All touchpoints in one operational view</p>
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

function RightRail({ tasksData, reportsData }: { tasksData: Record<string, { title: string; time: string; level: string; owner: string }[]>; reportsData: typeof defaultReports }) {
  return (
    <div className="space-y-4">
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-stone-950">Today&apos;s tasks</CardTitle>
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
          <CardTitle className="text-lg text-stone-950">Team performance</CardTitle>
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
        { label: "Total Leads", value: String(dashboard.totalLeads), change: "+12.4%", sub: "vs last month" },
        { label: "New Today", value: String(dashboard.newToday), change: "+8.1%", sub: "fresh inbound leads" },
        { label: "Hot Leads", value: String(dashboard.hotLeads), change: "+21.0%", sub: "priority follow-up" },
        { label: "Conversion Rate", value: `${dashboard.conversionRate}%`, change: "+2.3%", sub: "qualified to won" },
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
        agent: l.assignedAgentName || "Unassigned",
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
          (t) => [t.name, `${t.leadsHandled} leads handled`, `${t.winRate}% win rate`] as [string, string, string]
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
        Today: apiTasks.filter((t) => !t.isCompleted).slice(0, 3).map((t) => ({
          title: t.title, time: t.dueDate ? new Date(t.dueDate).toLocaleTimeString() : "", level: t.priority, owner: t.owner,
        })),
      }
    : defaultTasks;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-stone-500">Showing the current workspace</p>
          <h2 className="text-xl font-semibold tracking-tight text-stone-950">Dashboard</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {[`Follow-ups Due: ${dashboard?.tasksDueToday ?? 12}`, `Missed: ${dashboard?.overdueTasks ?? 3}`, "Won This Week: 9"].map((item) => (
            <Badge key={item} className="rounded-full border border-stone-200 bg-white text-stone-700">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <StatCards statsData={stats} />
      <AnalyticsSection reportsData={reports} />
      <PipelineBoardCompact pipelineData={pipeline} />

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.45fr_0.9fr]">
        <LeadTableCompact leadsData={leads} />
        <RightRail tasksData={tasks} reportsData={reports} />
      </div>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[0.9fr_1.1fr]">
        <LeadProfileCard lead={apiLeads[0]} />
        <ActivityTimeline />
      </div>
    </div>
  );
}
