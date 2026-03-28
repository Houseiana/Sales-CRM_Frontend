"use client";

import { AlertCircle, Flame, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/score-badge";
import { tasks } from "@/lib/data";
import type { LucideIcon } from "lucide-react";

export function TasksView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {Object.entries(tasks).map(([section, items]) => (
          <Card key={section} className="rounded-3xl border-stone-200/80 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-stone-950">{section}</CardTitle>
                <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">
                  {items.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-stone-950">{item.title}</p>
                      <p className="mt-1 text-sm text-stone-500">
                        {item.owner} &bull; {item.time}
                      </p>
                    </div>
                    <ScoreBadge value={item.level} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">Follow-up priorities</CardTitle>
            <p className="text-sm text-stone-500">
              What must happen today for pipeline health
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {(
              [
                ["4 hot leads waiting > 2 hours", "Immediate review needed", AlertCircle],
                ["3 missed follow-ups", "Risk of lead drop-off", Flame],
                ["6 proposals pending reply", "Schedule second touchpoint", Send],
              ] as [string, string, LucideIcon][]
            ).map(([title, text, Icon]) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-2xl border border-stone-200 p-4"
              >
                <div className="rounded-2xl bg-stone-100 p-2">
                  <Icon className="h-4 w-4 text-stone-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-950">{title}</p>
                  <p className="mt-1 text-sm text-stone-500">{text}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">Daily execution rhythm</CardTitle>
            <p className="text-sm text-stone-500">
              A clean view for sales, business development, and management
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "09:00 - Lead review and assignment",
              "11:00 - Owner follow-up block",
              "14:00 - Proposal and negotiation window",
              "17:00 - End-of-day performance check",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
