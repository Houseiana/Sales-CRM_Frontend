"use client";

import { Badge } from "@/components/ui/badge";

const styles: Record<string, string> = {
  Hot: "bg-amber-100 text-amber-900 border-amber-200",
  Warm: "bg-stone-100 text-stone-800 border-stone-200",
  Cold: "bg-slate-100 text-slate-700 border-slate-200",
  Priority: "bg-yellow-100 text-yellow-900 border-yellow-200",
  Won: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Urgent: "bg-rose-100 text-rose-800 border-rose-200",
  High: "bg-orange-100 text-orange-800 border-orange-200",
  Medium: "bg-stone-100 text-stone-800 border-stone-200",
  Low: "bg-slate-100 text-slate-700 border-slate-200",
  Done: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function ScoreBadge({ value }: { value: string }) {
  return (
    <Badge className={`rounded-full border ${styles[value] || styles.Warm}`}>
      {value}
    </Badge>
  );
}
