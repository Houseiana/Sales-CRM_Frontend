"use client";

import { useState } from "react";
import { SideNav } from "@/components/side-nav";
import { TopBar } from "@/components/top-bar";
import { DashboardView } from "@/components/views/dashboard-view";
import { LeadsView } from "@/components/views/leads-view";
import { PipelineView } from "@/components/views/pipeline-view";
import { TasksView } from "@/components/views/tasks-view";
import { CommunicationsView } from "@/components/views/communications-view";
import { ReportsView } from "@/components/views/reports-view";
import { SettingsView } from "@/components/views/settings-view";
import type { ViewName } from "@/lib/data";

const views: Record<ViewName, React.ComponentType> = {
  Dashboard: DashboardView,
  Leads: LeadsView,
  Pipeline: PipelineView,
  Tasks: TasksView,
  Communications: CommunicationsView,
  Reports: ReportsView,
  Settings: SettingsView,
};

export default function Home() {
  const [view, setView] = useState<ViewName>("Dashboard");
  const ActiveView = views[view];

  return (
    <div className="flex h-screen bg-stone-50">
      <SideNav view={view} setView={setView} />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <TopBar view={view} />
        <main className="flex-1 px-4 py-6 md:px-6 xl:px-8">
          <ActiveView />
        </main>
      </div>
    </div>
  );
}
