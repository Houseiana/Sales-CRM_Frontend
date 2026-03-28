"use client";

import { useMemo } from "react";

export function MiniBarChart() {
  const bars = useMemo(() => [42, 64, 51, 72, 48, 83, 67], []);
  return (
    <div className="flex h-40 items-end gap-3 pt-6">
      {bars.map((h, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-2xl rounded-b-md bg-stone-900/90"
            style={{ height: `${h * 1.2}px` }}
          />
          <span className="text-xs text-stone-500">
            {["M", "T", "W", "T", "F", "S", "S"][i]}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MiniLineChart() {
  const points = [30, 48, 40, 66, 54, 73, 62];
  const chartPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * 52 + 8} ${120 - p}`)
    .join(" ");

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-4">
      <svg viewBox="0 0 340 130" className="h-40 w-full">
        <path
          d={chartPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-stone-900"
        />
        {points.map((p, i) => (
          <circle key={i} cx={i * 52 + 8} cy={120 - p} r="4" className="fill-stone-900" />
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}
