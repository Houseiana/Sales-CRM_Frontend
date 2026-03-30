"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  CalendarClock,
  Flame,
  CircleDot,
  MoreHorizontal,
  MapPin,
  BadgeDollarSign,
  Clock3,
  UserRound,
  CheckSquare,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScoreBadge } from "@/components/score-badge";
import { MiniBarChart } from "@/components/charts";
import {
  salesLeadsApi,
  salesTasksApi,
  salesActivitiesApi,
  type SalesLead,
  type DashboardData,
  type SalesTaskItem,
  type SalesActivityItem,
} from "@/lib/api";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { LucideIcon } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type StatItem   = { label: string; value: string; sub: string };
type ReportsData = { sources: [string, string][]; team: [string, string, string][] };
type TaskItem   = { id: string; title: string; time: string; level: string; owner: string };
type LeadRow    = { id: string; name: string; type: string; source: string; city: string; budget: string; score: string; next: string; agent: string };

// ── Stat Cards ─────────────────────────────────────────────────────────────────

function StatCards({ statsData, loading }: { statsData: StatItem[]; loading: boolean }) {
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
                  {loading ? (
                    <div className="mt-2 h-9 w-20 animate-pulse rounded-xl bg-stone-100" />
                  ) : (
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">{stat.value}</p>
                  )}
                </div>
                <div className="rounded-2xl bg-yellow-50 p-2.5 ring-1 ring-yellow-100">
                  <ArrowUpRight className="h-5 w-5 text-stone-900" />
                </div>
              </div>
              {stat.sub && (
                <p className="mt-3 text-sm text-stone-400">{stat.sub}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// ── Analytics / Lead Flow Section ──────────────────────────────────────────────

function AnalyticsSection({ dashboard, t }: { dashboard: DashboardData | null; t: Dictionary }) {
  // Use pipeline counts as real bar data (leads per stage)
  const STAGE_ORDER = ["New Lead", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
  const barData  = dashboard ? STAGE_ORDER.map((s) => dashboard.pipelineCounts[s] ?? 0) : undefined;
  const barLabels = STAGE_ORDER.map((s) => s.split(" ")[0]); // abbreviate

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg text-stone-950">{t.dashboard.pipelineSnapshot}</CardTitle>
              <p className="mt-1 text-sm text-stone-500">{t.dashboard.pipelineSub}</p>
            </div>
            <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">
              {dashboard ? `${Object.values(dashboard.pipelineCounts).reduce((a, b) => a + b, 0)} ${t.leads.lead}` : "—"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <MiniBarChart data={barData} labels={barLabels} />
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-stone-950">{t.dashboard.leadSources}</CardTitle>
          <p className="text-sm text-stone-500">{t.dashboard.topChannels}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!dashboard ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 animate-pulse rounded-full bg-stone-100" />
              ))}
            </div>
          ) : dashboard.sourceCounts && Object.keys(dashboard.sourceCounts).length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-400">{t.leads.noLeadsFound}</p>
          ) : (
            Object.entries(dashboard.sourceCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([source, count]) => {
                const pct = Math.round((count / Math.max(dashboard.totalLeads, 1)) * 100);
                return (
                  <div key={source}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-stone-800">{source}</span>
                      <span className="text-stone-500">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-100">
                      <div className="h-2 rounded-full bg-stone-900 transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Pipeline Snapshot (compact) ────────────────────────────────────────────────

function PipelineSummary({ dashboard, t }: { dashboard: DashboardData | null; t: Dictionary }) {
  const STAGE_TONES: Record<string, string> = {
    "New Lead": "border-stone-200 bg-stone-50 text-stone-900",
    Contacted:  "border-amber-200 bg-amber-50 text-amber-900",
    Qualified:  "border-yellow-200 bg-yellow-50 text-yellow-900",
    Proposal:   "border-orange-200 bg-orange-50 text-orange-900",
    Negotiation:"border-emerald-200 bg-emerald-50 text-emerald-900",
    Won:        "border-lime-200 bg-lime-50 text-lime-900",
    Lost:       "border-red-200 bg-red-50 text-red-900",
  };
  const stageNameMap: Record<string, string> = {
    "New Lead": t.stages.newLead, Contacted: t.stages.contacted, Qualified: t.stages.qualified,
    Proposal: t.stages.proposal, Negotiation: t.stages.negotiation, Won: t.stages.won, Lost: t.stages.lost,
  };
  const STAGES = ["New Lead", "Contacted", "Qualified", "Proposal", "Negotiation", "Won"];

  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg text-stone-950">{t.pipeline.totalInPipeline}</CardTitle>
            <p className="mt-1 text-sm text-stone-500">{t.dashboard.pipelineSub}</p>
          </div>
          <div className="flex gap-2">
            <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">{t.pipeline.stageBased}</Badge>
            <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">{t.pipeline.slaDriven}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!dashboard ? (
          <div className="grid gap-3 xl:grid-cols-6">
            {STAGES.map((s) => (
              <div key={s} className="h-20 animate-pulse rounded-2xl bg-stone-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-6">
            {STAGES.map((stage) => {
              const count = dashboard.pipelineCounts[stage] ?? 0;
              const total = Object.values(dashboard.pipelineCounts).reduce((a, b) => a + b, 0);
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const tone = STAGE_TONES[stage] || STAGE_TONES["New Lead"];
              return (
                <div key={stage} className={`rounded-2xl border p-3 ${tone}`}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest opacity-60">{stageNameMap[stage] || stage}</p>
                  <p className="mt-2 text-2xl font-bold">{count}</p>
                  <p className="mt-1 text-xs opacity-60">{pct}%</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Recent Leads Table ─────────────────────────────────────────────────────────

function LeadTableCompact({ leadsData, loading, t }: { leadsData: LeadRow[]; loading: boolean; t: Dictionary }) {
  const cols = "grid-cols-[1.2fr_1fr_0.9fr_0.8fr_0.8fr_1fr_0.7fr]";
  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <div>
          <CardTitle className="text-lg text-stone-950">{t.dashboard.recentLeads}</CardTitle>
          <p className="mt-1 text-sm text-stone-500">{t.dashboard.fastAccess}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl border border-stone-200">
          <div className={`grid ${cols} gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500`}>
            <div>{t.leads.lead}</div>
            <div>{t.leads.type}</div>
            <div>{t.leads.source}</div>
            <div>{t.leads.city}</div>
            <div>{t.leads.budget}</div>
            <div>{t.leads.nextFollowUp}</div>
            <div>{t.leads.score}</div>
          </div>
          {loading ? (
            <div className="space-y-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`grid ${cols} gap-3 border-b border-stone-100 px-4 py-4 last:border-0`}>
                  {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                    <div key={j} className="h-4 animate-pulse rounded-full bg-stone-100" />
                  ))}
                </div>
              ))}
            </div>
          ) : leadsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-2xl bg-stone-100 p-4 mb-3"><Users className="h-5 w-5 text-stone-400" /></div>
              <p className="text-sm text-stone-500">{t.leads.noLeadsFound}</p>
            </div>
          ) : (
            leadsData.map((lead) => (
              <div key={lead.id} className={`grid ${cols} gap-3 border-b border-stone-200 px-4 py-4 text-sm last:border-b-0 hover:bg-stone-50/70`}>
                <div>
                  <p className="font-semibold text-stone-950">{lead.name}</p>
                  <p className="mt-1 text-xs text-stone-500">{t.preview.agent}: {lead.agent}</p>
                </div>
                <div className="text-stone-700">{lead.type}</div>
                <div className="text-stone-700">{lead.source}</div>
                <div className="text-stone-700">{lead.city || "—"}</div>
                <div className="text-stone-700">{lead.budget}</div>
                <div className="text-stone-700">{lead.next}</div>
                <div><ScoreBadge value={lead.score} /></div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Lead Profile Card ──────────────────────────────────────────────────────────

function LeadProfileCard({ lead, t }: { lead?: SalesLead; t: Dictionary }) {
  if (!lead) {
    return (
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-2xl bg-stone-100 p-4 mb-3"><UserRound className="h-6 w-6 text-stone-400" /></div>
          <p className="text-sm text-stone-500">{t.leads.noLeadsFound}</p>
        </CardContent>
      </Card>
    );
  }

  const details: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Phone,          label: t.createLead.mobileWhatsapp,   value: lead.phone       || "—" },
    { icon: Mail,           label: t.createLead.emailAddress,      value: lead.email       || "—" },
    { icon: Globe,          label: t.createLead.preferredLanguage, value: lead.language    || "—" },
    { icon: BadgeDollarSign,label: t.createLead.expectedPrice,     value: lead.budget      || "—" },
    { icon: MapPin,         label: t.createLead.targetLocation,    value: lead.targetArea  || "—" },
    { icon: CalendarClock,  label: t.createLead.nextFollowUp,      value: lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleString() : "—" },
  ];
  const initials = lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 rounded-2xl">
              <AvatarFallback className="rounded-2xl bg-stone-950 text-base text-white">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl text-stone-950">{lead.name}</CardTitle>
              <p className="mt-1 text-sm text-stone-500">{lead.type} · {lead.source} · {lead.city || "—"}</p>
            </div>
          </div>
          <ScoreBadge value={lead.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {details.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="rounded-2xl border border-stone-200 p-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-stone-100 p-2"><Icon className="h-4 w-4 text-stone-700" /></div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-stone-400">{row.label}</p>
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

// ── Activity Timeline ──────────────────────────────────────────────────────────

const ACTIVITY_ICON_MAP: Record<string, LucideIcon> = {
  call: Phone, whatsapp: MessageCircle, email: Mail, task: CheckSquare,
  note: CircleDot, hot: Flame, stage: MoreHorizontal, default: CircleDot,
};

function ActivityTimeline({ leadId, t }: { leadId?: string; t: Dictionary }) {
  const [activities, setActivities] = useState<SalesActivityItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!leadId) return;
    setLoading(true);
    salesActivitiesApi.getByLead(leadId)
      .then(setActivities)
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [leadId]);

  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-stone-950">{t.dashboard.leadTimeline}</CardTitle>
        <p className="text-sm text-stone-500">{t.dashboard.allTouchpoints}</p>
      </CardHeader>
      <CardContent>
        {!leadId ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-2xl bg-stone-100 p-4 mb-3"><CircleDot className="h-6 w-6 text-stone-400" /></div>
            <p className="text-sm text-stone-500">{t.leads.noLeadsFound}</p>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 animate-pulse rounded-2xl bg-stone-100 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-1/2 animate-pulse rounded-full bg-stone-100" />
                  <div className="h-3 w-3/4 animate-pulse rounded-full bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-2xl bg-stone-100 p-4 mb-3"><CircleDot className="h-6 w-6 text-stone-400" /></div>
            <p className="text-sm text-stone-500">{t.dashboard.noActivity}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {activities.slice(0, 8).map((item, i) => {
              const key = Object.keys(ACTIVITY_ICON_MAP).find((k) => item.action.toLowerCase().includes(k)) || "default";
              const Icon = ACTIVITY_ICON_MAP[key];
              return (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-950 text-white shadow-sm flex-shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    {i < activities.slice(0, 8).length - 1 && <div className="mt-2 h-full w-px bg-stone-200" />}
                  </div>
                  <div className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-stone-950">{item.action}</p>
                      <span className="text-xs text-stone-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    {item.details && <p className="mt-1 text-sm leading-6 text-stone-600">{item.details}</p>}
                    {item.performedBy && <p className="mt-0.5 text-xs text-stone-400">{t.preview.agent}: {item.performedBy}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Right Rail ─────────────────────────────────────────────────────────────────

function RightRail({ tasks, reportsData, loading, t }: { tasks: TaskItem[]; reportsData: ReportsData; loading: boolean; t: Dictionary }) {
  return (
    <div className="space-y-4">
      {/* Today's Tasks */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-stone-950">{t.dashboard.todaysTasks}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-stone-100" />)}
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-2xl bg-stone-100 p-3 mb-2"><CheckSquare className="h-5 w-5 text-stone-400" /></div>
              <p className="text-sm text-stone-400">{t.leads.noLeadsFound}</p>
            </div>
          ) : (
            tasks.map((item) => (
              <div key={item.id} className="rounded-2xl border border-stone-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-stone-900">{item.title}</p>
                    {item.time && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                        <Clock3 className="h-3.5 w-3.5" /> {item.time}
                      </div>
                    )}
                  </div>
                  <ScoreBadge value={item.level} />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-stone-950">{t.dashboard.teamPerformance}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-14 animate-pulse rounded-2xl bg-stone-100" />)}
            </div>
          ) : reportsData.team.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-2xl bg-stone-100 p-3 mb-2"><Users className="h-5 w-5 text-stone-400" /></div>
              <p className="text-sm text-stone-400">{t.leads.noLeadsFound}</p>
            </div>
          ) : (
            reportsData.team.map(([name, meta]) => (
              <div key={name} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100">
                  <UserRound className="h-5 w-5 text-stone-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">{name}</p>
                  <p className="text-sm text-stone-500">{meta}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Houseiana Brand Card */}
      <Card className="rounded-3xl border-stone-200/80 bg-gradient-to-br from-stone-950 to-stone-800 text-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-2.5">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{t.nav.dashboard}</p>
              <p className="text-sm text-white/70">{t.dashboard.showingWorkspace}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export function DashboardView() {
  const { t } = useLocale();
  const [dashboard, setDashboard]     = useState<DashboardData | null>(null);
  const [apiLeads, setApiLeads]       = useState<SalesLead[]>([]);
  const [apiTasks, setApiTasks]       = useState<SalesTaskItem[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      salesLeadsApi.getDashboard().then(setDashboard),
      salesLeadsApi.getAll({ pageSize: "10" }).then((r) => setApiLeads(r.items)),
      salesTasksApi.getAll({ status: "today" }).then(setApiTasks),
    ]).finally(() => setLoading(false));
  }, []);

  // ── Derived data — never use hardcoded fallbacks ──────────────────────────

  const stats: StatItem[] = [
    { label: t.dashboard.totalLeads,    value: dashboard ? String(dashboard.totalLeads)          : "—", sub: t.dashboard.vsLastMonth      },
    { label: t.dashboard.newToday,      value: dashboard ? String(dashboard.newToday)             : "—", sub: t.dashboard.freshInbound      },
    { label: t.dashboard.hotLeads,      value: dashboard ? String(dashboard.hotLeads)             : "—", sub: t.dashboard.priorityFollowUp  },
    { label: t.dashboard.conversionRate,value: dashboard ? `${dashboard.conversionRate}%`         : "—", sub: t.dashboard.qualifiedToWon    },
  ];

  const leads: LeadRow[] = apiLeads.map((l) => ({
    id:     l.id,
    name:   l.name,
    type:   l.type,
    source: l.source,
    city:   l.city   || "—",
    budget: l.budget  || "—",
    score:  l.score,
    next:   l.nextFollowUp ? new Date(l.nextFollowUp).toLocaleDateString() : "—",
    agent:  l.assignedAgentName || t.leads.unassigned,
  }));

  const reports: ReportsData = dashboard
    ? {
        sources: Object.entries(dashboard.sourceCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([s, c]) => [s, `${Math.round((c / Math.max(dashboard.totalLeads, 1)) * 100)}%`]),
        team: dashboard.teamStats.map((ts) => [
          ts.name,
          `${ts.leadsHandled} ${t.reports.leadsHandled}`,
          `${ts.winRate}% ${t.reports.winRate}`,
        ]),
      }
    : { sources: [], team: [] };

  const todayTasks: TaskItem[] = apiTasks
    .filter((tk) => !tk.isCompleted)
    .slice(0, 5)
    .map((tk) => ({
      id:    tk.id,
      title: tk.title,
      time:  tk.dueDate ? new Date(tk.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
      level: tk.priority,
      owner: tk.owner,
    }));

  const topLead = apiLeads[0];

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-stone-500">{t.dashboard.showingWorkspace}</p>
          <h2 className="text-xl font-semibold tracking-tight text-stone-950">{t.nav.dashboard}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">
            {t.dashboard.followupsDue}: {dashboard?.tasksDueToday ?? "—"}
          </Badge>
          <Badge className="rounded-full border border-red-100 bg-red-50 text-red-700">
            {t.dashboard.missed}: {dashboard?.overdueTasks ?? "—"}
          </Badge>
          <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
            {t.dashboard.wonThisWeek}: {dashboard ? dashboard.teamStats.reduce((a, ts) => a + ts.wonCount, 0) : "—"}
          </Badge>
        </div>
      </div>

      <StatCards statsData={stats} loading={loading} />
      <AnalyticsSection dashboard={dashboard} t={t} />
      <PipelineSummary dashboard={dashboard} t={t} />

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.45fr_0.9fr]">
        <LeadTableCompact leadsData={leads} loading={loading} t={t} />
        <RightRail tasks={todayTasks} reportsData={reports} loading={loading} t={t} />
      </div>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[0.9fr_1.1fr]">
        <LeadProfileCard lead={topLead} t={t} />
        <ActivityTimeline leadId={topLead?.id} t={t} />
      </div>
    </div>
  );
}
