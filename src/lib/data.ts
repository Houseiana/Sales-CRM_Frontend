// ── UI Metadata only — no mock/sample data ──────────────────────────────────

export type ViewName = "Dashboard" | "Leads" | "Pipeline" | "Tasks" | "Communications" | "Reports" | "Settings" | "Team";

export const viewMeta: Record<
  ViewName,
  { eyebrow: string; title: string; subtitle: string; primary: string; secondary: string }
> = {
  Dashboard: {
    eyebrow: "Saturday overview",
    title: "Lead dashboard",
    subtitle: "Executive visibility across performance, follow-up, and conversion momentum.",
    primary: "+ New Lead",
    secondary: "Export",
  },
  Leads: {
    eyebrow: "Lead management",
    title: "Leads workspace",
    subtitle: "Search, qualify, assign, and move every Houseiana opportunity with clarity.",
    primary: "+ Add Lead",
    secondary: "Filters",
  },
  Pipeline: {
    eyebrow: "Conversion flow",
    title: "Pipeline board",
    subtitle: "Track owner, guest, investor, and corporate leads through every sales stage.",
    primary: "+ Create Stage",
    secondary: "Pipeline Rules",
  },
  Tasks: {
    eyebrow: "Execution layer",
    title: "Tasks & follow-ups",
    subtitle: "Stay on top of every reminder, overdue follow-up, and handoff task.",
    primary: "+ New Task",
    secondary: "Calendar View",
  },
  Communications: {
    eyebrow: "Unified interactions",
    title: "Communications hub",
    subtitle: "Calls, emails, WhatsApp, and social conversations in one premium workspace.",
    primary: "+ Log Activity",
    secondary: "Channels",
  },
  Reports: {
    eyebrow: "Business intelligence",
    title: "Reports & analytics",
    subtitle: "Measure channel quality, agent output, and funnel efficiency.",
    primary: "Export Report",
    secondary: "Date Range",
  },
  Settings: {
    eyebrow: "System controls",
    title: "CRM settings",
    subtitle: "Configure permissions, automations, lead logic, and Houseiana workflow rules.",
    primary: "Save Changes",
    secondary: "Security",
  },
  Team: {
    eyebrow: "Admin controls",
    title: "Team management",
    subtitle: "Create accounts, assign roles, and manage team member access.",
    primary: "+ Add Member",
    secondary: "Roles",
  },
};

export const navItems = [
  { label: "Dashboard" as ViewName, iconName: "LayoutDashboard" as const },
  { label: "Leads" as ViewName, iconName: "Users" as const },
  { label: "Pipeline" as ViewName, iconName: "Funnel" as const },
  { label: "Tasks" as ViewName, iconName: "CheckSquare" as const },
  { label: "Communications" as ViewName, iconName: "MessageSquare" as const },
  { label: "Reports" as ViewName, iconName: "BarChart3" as const },
  { label: "Settings" as ViewName, iconName: "Settings" as const },
];

export const settingsCards = [
  {
    title: "Team & Roles",
    text: "Manage Admin, Sales Manager, Sales Agent, Business Development, and view-only roles.",
    iconName: "ShieldCheck" as const,
  },
  {
    title: "Lead Scoring",
    text: "Configure hot, warm, cold, and priority scoring rules by source, budget, and urgency.",
    iconName: "Sparkles" as const,
  },
  {
    title: "Automations",
    text: "Create reminders, task triggers, round-robin assignment, and inactivity alerts.",
    iconName: "Bot" as const,
  },
  {
    title: "Pipeline Rules",
    text: "Customize lead stages for owners, guests, investors, and B2B partnership flows.",
    iconName: "SlidersHorizontal" as const,
  },
];
