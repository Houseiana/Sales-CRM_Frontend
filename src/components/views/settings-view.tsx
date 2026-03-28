"use client";

import { ShieldCheck, Sparkles, Bot, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Sparkles,
  Bot,
  SlidersHorizontal,
};

const settingsCards = [
  {
    title: "Team & Roles",
    text: "Manage Admin, Sales Manager, Sales Agent, Business Development, and view-only roles.",
    iconName: "ShieldCheck",
  },
  {
    title: "Lead Scoring",
    text: "Configure hot, warm, cold, and priority scoring rules by source, budget, and urgency.",
    iconName: "Sparkles",
  },
  {
    title: "Automations",
    text: "Create reminders, task triggers, round-robin assignment, and inactivity alerts.",
    iconName: "Bot",
  },
  {
    title: "Pipeline Rules",
    text: "Customize lead stages for owners, guests, investors, and B2B partnership flows.",
    iconName: "SlidersHorizontal",
  },
];

export function SettingsView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {settingsCards.map((card) => {
          const Icon = iconMap[card.iconName];
          return (
            <Card key={card.title} className="rounded-3xl border-stone-200/80 shadow-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-2xl bg-yellow-50 p-3 ring-1 ring-yellow-100">
                  <Icon className="h-5 w-5 text-stone-900" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-stone-950">{card.title}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-500">{card.text}</p>
                  <Button variant="outline" className="mt-4 rounded-2xl border-stone-200">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-stone-950">System preferences</CardTitle>
          <p className="text-sm text-stone-500">
            Global Houseiana CRM settings and integrations
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            [
              "Default lead assignment",
              "Round-robin between active agents with language match",
            ],
            ["Inactivity alert", "Trigger notification after 4 hours with no action on hot lead"],
            ["Data retention", "Archive leads inactive for 90+ days"],
            ["Timezone", "Asia/Qatar (GMT+3)"],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-stone-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-stone-950">{title}</p>
                  <p className="mt-1 text-sm text-stone-500">{text}</p>
                </div>
                <Button variant="outline" className="shrink-0 rounded-2xl border-stone-200">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
