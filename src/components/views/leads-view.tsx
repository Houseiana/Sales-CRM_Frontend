"use client";

import { Users, Building2, UserPlus, Filter, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScoreBadge } from "@/components/score-badge";
import { leads } from "@/lib/data";
import type { LucideIcon } from "lucide-react";

function LeadTable() {
  const headerClass =
    "grid-cols-[1.2fr_1fr_0.9fr_0.8fr_0.8fr_0.8fr_1fr_0.8fr_0.7fr]";
  return (
    <Card className="rounded-3xl border-stone-200/80 shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg text-stone-950">All leads</CardTitle>
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
            <div>Language</div>
            <div>Budget</div>
            <div>Next Follow-up</div>
            <div>Status</div>
            <div>Score</div>
          </div>
          {leads.map((lead) => (
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
              <div className="text-stone-700">{lead.language}</div>
              <div className="text-stone-700">{lead.budget}</div>
              <div className="text-stone-700">{lead.next}</div>
              <div className="text-stone-700">{lead.status}</div>
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

export function LeadsView() {
  const leadSummary: [string, string, LucideIcon][] = [
    ["New Leads", "38", Users],
    ["Qualified Owners", "17", Building2],
    ["Need Assignment", "9", UserPlus],
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr_0.8fr]">
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

      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              "All Leads",
              "Owners",
              "Guests",
              "Investors",
              "Corporate",
              "Hot",
              "No Activity",
            ].map((item, i) => (
              <Button
                key={item}
                variant={i === 0 ? "default" : "outline"}
                className={`rounded-2xl ${
                  i === 0 ? "bg-stone-950 text-white hover:bg-stone-800" : "border-stone-200"
                }`}
              >
                {item}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-2xl border-stone-200">
              <Filter className="mr-2 h-4 w-4" /> Advanced Filters
            </Button>
            <Button variant="outline" className="rounded-2xl border-stone-200">
              <Bookmark className="mr-2 h-4 w-4" /> Saved Views
            </Button>
          </div>
        </CardContent>
      </Card>

      <LeadTable />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {leads.slice(0, 3).map((lead) => (
          <Card key={lead.name} className="rounded-3xl border-stone-200/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 rounded-2xl">
                    <AvatarFallback className="rounded-2xl bg-stone-950 text-white">
                      {lead.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-stone-950">{lead.name}</p>
                    <p className="text-sm text-stone-500">{lead.type}</p>
                  </div>
                </div>
                <ScoreBadge value={lead.score} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-stone-50 p-3">
                  <p className="text-stone-400">Source</p>
                  <p className="mt-1 font-medium text-stone-900">{lead.source}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3">
                  <p className="text-stone-400">Assigned</p>
                  <p className="mt-1 font-medium text-stone-900">{lead.agent}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3">
                  <p className="text-stone-400">City</p>
                  <p className="mt-1 font-medium text-stone-900">{lead.city}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3">
                  <p className="text-stone-400">Follow-up</p>
                  <p className="mt-1 font-medium text-stone-900">{lead.next}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
