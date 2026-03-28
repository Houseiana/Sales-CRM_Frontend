"use client";

import {
  LayoutDashboard,
  Users,
  Funnel,
  CheckSquare,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ViewName } from "@/lib/data";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Funnel,
  CheckSquare,
  MessageSquare,
  BarChart3,
  Settings,
};

const navItems: { label: ViewName; iconName: string }[] = [
  { label: "Dashboard", iconName: "LayoutDashboard" },
  { label: "Leads", iconName: "Users" },
  { label: "Pipeline", iconName: "Funnel" },
  { label: "Tasks", iconName: "CheckSquare" },
  { label: "Communications", iconName: "MessageSquare" },
  { label: "Reports", iconName: "BarChart3" },
  { label: "Settings", iconName: "Settings" },
];

export function SideNav({
  view,
  setView,
}: {
  view: ViewName;
  setView: (v: ViewName) => void;
}) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-stone-200/80 bg-white xl:flex xl:flex-col">
      <div className="border-b border-stone-200/80 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-sm font-semibold text-white shadow-sm">
            H
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-stone-950">Houseiana CRM</p>
            <p className="text-sm text-stone-500">Lead Control Center</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-5">
        <div className="mb-3 px-3 text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          Workspace
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = iconMap[item.iconName];
            const active = item.label === view;
            return (
              <button
                key={item.label}
                onClick={() => setView(item.label)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  active
                    ? "bg-yellow-50 text-stone-950 shadow-sm ring-1 ring-yellow-200"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-950"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="m-4 rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-white p-4 shadow-sm">
        <p className="mb-1 text-sm font-semibold text-stone-950">Today&apos;s focus</p>
        <p className="text-sm leading-6 text-stone-600">
          12 follow-ups are due today. 4 hot leads need immediate action.
        </p>
        <Button
          className="mt-4 w-full rounded-2xl bg-stone-950 text-white hover:bg-stone-800"
          onClick={() => setView("Tasks")}
        >
          Open Tasks
        </Button>
      </div>
    </aside>
  );
}
