"use client";

import {
  LayoutDashboard, Users, Funnel, CheckSquare, MessageSquare,
  BarChart3, Settings, UsersRound, LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { ViewName } from "@/lib/data";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { LayoutDashboard, Users, Funnel, CheckSquare, MessageSquare, BarChart3, Settings, UsersRound };

const navItems: { key: string; label: ViewName; iconName: string; adminOnly?: boolean }[] = [
  { key: "dashboard", label: "Dashboard", iconName: "LayoutDashboard" },
  { key: "leads", label: "Leads", iconName: "Users" },
  { key: "pipeline", label: "Pipeline", iconName: "Funnel" },
  { key: "tasks", label: "Tasks", iconName: "CheckSquare" },
  { key: "communications", label: "Communications", iconName: "MessageSquare" },
  { key: "reports", label: "Reports", iconName: "BarChart3" },
  { key: "team", label: "Team", iconName: "UsersRound", adminOnly: true },
  { key: "settings", label: "Settings", iconName: "Settings" },
];

export function SideNav({ view, setView }: { view: ViewName; setView: (v: ViewName) => void }) {
  const { user, logout, canManageTeam } = useAuth();
  const { t } = useLocale();
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "ME";

  const navLabel = (key: string) => (t.nav as Record<string, string>)[key] || key;

  return (
    <aside className="hidden w-72 shrink-0 border-r border-stone-200/80 bg-white xl:flex xl:flex-col">
      <div className="border-b border-stone-200/80 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-sm font-semibold text-white shadow-sm">H</div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-stone-950">{t.appName}</p>
            <p className="text-sm text-stone-500">{t.appSubtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-5">
        <div className="mb-3 px-3 text-xs font-medium uppercase tracking-[0.18em] text-stone-400">{t.workspace}</div>
        <nav className="space-y-1.5">
          {navItems.filter((item) => !item.adminOnly || canManageTeam).map((item) => {
            const Icon = iconMap[item.iconName];
            const active = item.label === view;
            return (
              <button key={item.label} onClick={() => setView(item.label)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  active ? "bg-yellow-50 text-stone-950 shadow-sm ring-1 ring-yellow-200" : "text-stone-600 hover:bg-stone-50 hover:text-stone-950"
                }`}>
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{navLabel(item.key)}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Language + User */}
      <div className="border-t border-stone-200/80 px-4 py-4 space-y-3">
        <LanguageSwitcher />
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-2xl">
            <AvatarFallback className="rounded-2xl bg-stone-950 text-xs text-white">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-stone-950">{user?.name}</p>
            <p className="truncate text-xs text-stone-500">{user?.role}</p>
          </div>
          <button onClick={logout} className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700" title={t.signOut}>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
