"use client";

import {
  Search,
  Bell,
  Filter,
  CalendarClock,
  Sparkles,
  Plus,
  CheckSquare,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { viewMeta, type ViewName } from "@/lib/data";
import type { LucideIcon } from "lucide-react";

export function TopBar({ view }: { view: ViewName }) {
  const meta = viewMeta[view];

  const secondaryIconMap: Record<string, LucideIcon> = {
    Leads: Filter,
    Reports: CalendarClock,
    Settings: ShieldCheck,
  };
  const primaryIconMap: Record<string, LucideIcon> = {
    Tasks: CheckSquare,
    Communications: MessageCircle,
  };

  const SecondaryIcon = secondaryIconMap[view] || Sparkles;
  const PrimaryIcon = primaryIconMap[view] || Plus;

  return (
    <div className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/80 px-4 py-4 backdrop-blur md:px-6 xl:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-stone-500">{meta.eyebrow}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-950">
            {meta.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-stone-500">{meta.subtitle}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              placeholder="Search leads, phone, campaign..."
              className="h-11 rounded-2xl border-stone-200 pl-9"
            />
          </div>
          <Button variant="outline" className="h-11 rounded-2xl border-stone-200">
            <SecondaryIcon className="mr-2 h-4 w-4" /> {meta.secondary}
          </Button>
          <Button className="h-11 rounded-2xl bg-stone-950 text-white hover:bg-stone-800">
            <PrimaryIcon className="mr-2 h-4 w-4" /> {meta.primary}
          </Button>
          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white">
            <Bell className="h-5 w-5 text-stone-700" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-yellow-400" />
          </button>
          <Avatar className="h-11 w-11 rounded-2xl">
            <AvatarFallback className="rounded-2xl bg-stone-950 text-white">ME</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
