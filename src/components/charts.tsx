"use client";

import { BarChart3, TrendingUp } from "lucide-react";

// ── Bar Chart ─────────────────────────────────────────────────────────────────
// Pass real `data` (array of numbers) from the API.
// When data is absent or all-zero, renders a placeholder skeleton instead.

interface MiniBarChartProps {
  data?: number[];
  labels?: string[];
}

export function MiniBarChart({ data, labels }: MiniBarChartProps) {
  const hasData = data && data.length > 0 && data.some((v) => v > 0);

  if (!hasData) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-200 bg-stone-50">
        <BarChart3 className="h-6 w-6 text-stone-300" />
        <p className="text-xs text-stone-400">No data yet</p>
      </div>
    );
  }

  const max = Math.max(...data);
  const defaultLabels = data.map((_, i) => String(i + 1));
  const axisLabels = labels ?? defaultLabels;

  return (
    <div className="flex h-40 items-end gap-2 pt-4">
      {data.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-xl rounded-b-md bg-stone-900/90 transition-all duration-500"
            style={{ height: `${max > 0 ? Math.round((v / max) * 100) : 0}%`, minHeight: v > 0 ? "4px" : "0" }}
          />
          <span className="truncate text-[10px] text-stone-500">{axisLabels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Line Chart ────────────────────────────────────────────────────────────────
// Pass real `data` (array of numbers). No data → placeholder.

interface MiniLineChartProps {
  data?: number[];
  labels?: string[];
}

export function MiniLineChart({ data, labels }: MiniLineChartProps) {
  const hasData = data && data.length >= 2 && data.some((v) => v > 0);

  if (!hasData) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-200 bg-stone-50">
        <TrendingUp className="h-6 w-6 text-stone-300" />
        <p className="text-xs text-stone-400">No data yet</p>
      </div>
    );
  }

  const max = Math.max(...data!);
  const W = 340;
  const H = 120;
  const step = (W - 16) / (data!.length - 1);
  const chartPath = data!
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step + 8} ${H - Math.round((p / max) * (H - 8))}`)
    .join(" ");
  const defaultLabels = data!.map((_, i) => String(i + 1));
  const axisLabels = labels ?? defaultLabels;

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-4">
      <svg viewBox={`0 0 ${W} ${H + 10}`} className="h-32 w-full">
        <path d={chartPath} fill="none" stroke="currentColor" strokeWidth="2.5" className="text-stone-900" />
        {data!.map((p, i) => (
          <circle key={i} cx={i * step + 8} cy={H - Math.round((p / max) * (H - 8))} r="3.5" className="fill-stone-900" />
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400">
        {axisLabels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}
