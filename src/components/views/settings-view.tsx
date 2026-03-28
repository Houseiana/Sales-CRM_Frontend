"use client";

import { ShieldCheck, Sparkles, Bot, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Sparkles,
  Bot,
  SlidersHorizontal,
};

export function SettingsView() {
  const { t } = useLocale();

  const settingsCards = [
    {
      title: t.settingsView.teamRoles,
      text: t.settingsView.teamRolesDesc,
      iconName: "ShieldCheck",
    },
    {
      title: t.settingsView.leadScoring,
      text: t.settingsView.leadScoringDesc,
      iconName: "Sparkles",
    },
    {
      title: t.settingsView.automations,
      text: t.settingsView.automationsDesc,
      iconName: "Bot",
    },
    {
      title: t.settingsView.pipelineRules,
      text: t.settingsView.pipelineRulesDesc,
      iconName: "SlidersHorizontal",
    },
  ];

  const preferences = [
    [t.settingsView.defaultAssignment, t.settingsView.defaultAssignmentDesc],
    [t.settingsView.inactivityAlert, t.settingsView.inactivityAlertDesc],
    [t.settingsView.dataRetention, t.settingsView.dataRetentionDesc],
    ["Timezone", "Asia/Qatar (GMT+3)"],
  ];

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
                    {t.settingsView.configure}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-stone-950">{t.settingsView.systemPrefs}</CardTitle>
          <p className="text-sm text-stone-500">
            {t.settingsView.systemPrefsSub}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {preferences.map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-stone-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-stone-950">{title}</p>
                  <p className="mt-1 text-sm text-stone-500">{text}</p>
                </div>
                <Button variant="outline" className="shrink-0 rounded-2xl border-stone-200">
                  {t.edit}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
