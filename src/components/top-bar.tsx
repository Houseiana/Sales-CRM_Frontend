"use client";

import {
  Search, Bell, Filter, CalendarClock, Sparkles, Plus,
  CheckSquare, MessageCircle, ShieldCheck, UsersRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import type { ViewName } from "@/lib/data";
import type { LucideIcon } from "lucide-react";

function UserAvatar() {
  const { user } = useAuth();
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "ME";
  return (
    <Avatar className="h-11 w-11 rounded-2xl">
      <AvatarFallback className="rounded-2xl bg-stone-950 text-white">{initials}</AvatarFallback>
    </Avatar>
  );
}

const primaryAction: Partial<Record<ViewName, ViewName>> = {
  Dashboard: "Leads", Reports: "Leads", Settings: "Settings", Team: "Team",
};

export function TopBar({ view, setView }: { view: ViewName; setView: (v: ViewName) => void }) {
  const { t, isRTL } = useLocale();
  const meta = t.viewMeta[view] || { eyebrow: "", title: view, subtitle: "", primary: "", secondary: "" };

  const secondaryIconMap: Record<string, LucideIcon> = { Leads: Filter, Reports: CalendarClock, Settings: ShieldCheck, Team: UsersRound };
  const primaryIconMap: Record<string, LucideIcon> = { Tasks: CheckSquare, Communications: MessageCircle };
  const SecondaryIcon = secondaryIconMap[view] || Sparkles;
  const PrimaryIcon = primaryIconMap[view] || Plus;

  const handlePrimary = () => {
    const target = primaryAction[view];
    if (target && target !== view) setView(target);
    window.dispatchEvent(new CustomEvent("crm:primary-action", { detail: view }));
  };

  const iconPos = isRTL ? "ml-2" : "mr-2";

  return (
    <div className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/80 px-4 py-4 backdrop-blur md:px-6 xl:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-stone-500">{meta.eyebrow}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-950">{meta.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-stone-500">{meta.subtitle}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-[260px]">
            <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400`} />
            <Input placeholder={t.searchPlaceholder} className={`h-11 rounded-2xl border-stone-200 ${isRTL ? "pr-9" : "pl-9"}`} />
          </div>
          <Button variant="outline" className="h-11 rounded-2xl border-stone-200">
            <SecondaryIcon className={`h-4 w-4 ${iconPos}`} /> {meta.secondary}
          </Button>
          <Button onClick={handlePrimary} className="h-11 rounded-2xl bg-stone-950 text-white hover:bg-stone-800">
            <PrimaryIcon className={`h-4 w-4 ${iconPos}`} /> {meta.primary}
          </Button>
          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white">
            <Bell className="h-5 w-5 text-stone-700" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-yellow-400" />
          </button>
          <UserAvatar />
        </div>
      </div>
    </div>
  );
}
