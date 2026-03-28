"use client";

import {
  LayoutDashboard,
  Users,
  Funnel,
  CheckSquare,
  MessageSquare,
  BarChart3,
  Settings,
  UsersRound,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
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
  UsersRound,
};

const navItems: { label: ViewName; iconName: string; adminOnly?: boolean }[] = [
  { label: "Dashboard", iconName: "LayoutDashboard" },
  { label: "Leads", iconName: "Users" },
  { label: "Pipeline", iconName: "Funnel" },
  { label: "Tasks", iconName: "CheckSquare" },
  { label: "Communications", iconName: "MessageSquare" },
  { label: "Reports", iconName: "BarChart3" },
  { label: "Team", iconName: "UsersRound", adminOnly: true },
  { label: "Settings", iconName: "Settings" },
];

export function SideNav({
  view,
  setView,
}: {
  view: ViewName;
  setView: (v: ViewName) => void;
}) {
  const { user, logout, canManageTeam } = useAuth();
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ME";

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
          {navItems
            .filter((item) => !item.adminOnly || canManageTeam)
            .map((item) => {
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

      {/* User info + logout */}
      <div className="border-t border-stone-200/80 px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-2xl">
            <AvatarFallback className="rounded-2xl bg-stone-950 text-xs text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-stone-950">{user?.name}</p>
            <p className="truncate text-xs text-stone-500">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
