export const stats = [
  { label: "Total Leads", value: "1,284", change: "+12.4%", sub: "vs last month" },
  { label: "New Today", value: "38", change: "+8.1%", sub: "fresh inbound leads" },
  { label: "Hot Leads", value: "94", change: "+21.0%", sub: "priority follow-up" },
  { label: "Conversion Rate", value: "18.7%", change: "+2.3%", sub: "qualified to won" },
];

export const leads = [
  {
    name: "Omar Hassan",
    type: "Property Owner",
    source: "Meta Ads",
    city: "Doha",
    budget: "QAR 12,000+",
    score: "Hot",
    next: "Today, 4:00 PM",
    agent: "Mariam",
    language: "Arabic / English",
    status: "Qualified",
  },
  {
    name: "Sara Adel",
    type: "Guest Booking",
    source: "WhatsApp",
    city: "Cairo",
    budget: "QAR 6,500",
    score: "Warm",
    next: "Tomorrow, 10:30 AM",
    agent: "Youssef",
    language: "Arabic",
    status: "Contacted",
  },
  {
    name: "Abdullah Fahad",
    type: "Investor",
    source: "Referral",
    city: "Riyadh",
    budget: "High Value",
    score: "Priority",
    next: "Today, 6:15 PM",
    agent: "Nadine",
    language: "Arabic / English",
    status: "Proposal",
  },
  {
    name: "Mona Salah",
    type: "Property Listing",
    source: "Website",
    city: "Alexandria",
    budget: "N/A",
    score: "Warm",
    next: "Monday, 11:00 AM",
    agent: "Mariam",
    language: "Arabic",
    status: "New Lead",
  },
  {
    name: "Khaled Al-Kuwari",
    type: "Corporate Booking",
    source: "Direct Call",
    city: "Lusail",
    budget: "QAR 22,000",
    score: "Hot",
    next: "Today, 3:15 PM",
    agent: "Nadine",
    language: "English",
    status: "Negotiation",
  },
  {
    name: "Farah Magdy",
    type: "Property Owner",
    source: "Instagram",
    city: "North Coast",
    budget: "N/A",
    score: "Warm",
    next: "Tuesday, 12:00 PM",
    agent: "Youssef",
    language: "Arabic",
    status: "Interested",
  },
];

export const pipeline: Record<string, { name: string; badge: string; score: string }[]> = {
  "New Lead": [
    { name: "Khaled Mostafa", badge: "Website", score: "Warm" },
    { name: "Rana Ali", badge: "Instagram", score: "Hot" },
    { name: "Hana Mourad", badge: "Referral", score: "Priority" },
  ],
  Contacted: [
    { name: "Laila Samir", badge: "WhatsApp", score: "Warm" },
    { name: "Ahmed Tarek", badge: "Meta Ads", score: "Cold" },
  ],
  Qualified: [
    { name: "Noura Al-Hajri", badge: "Referral", score: "Priority" },
    { name: "Ziad Adel", badge: "Website", score: "Hot" },
  ],
  Proposal: [
    { name: "Majed Salem", badge: "Direct Call", score: "Hot" },
    { name: "Omar Hassan", badge: "Meta Ads", score: "Priority" },
  ],
  Won: [{ name: "Yousef Karim", badge: "Partner", score: "Won" }],
};

export const timeline = [
  {
    title: "WhatsApp inquiry received",
    time: "10:14 AM",
    text: "Lead requested property management details for a 2BR apartment in Lusail.",
    iconName: "MessageCircle" as const,
  },
  {
    title: "Call scheduled",
    time: "11:05 AM",
    text: "Sales follow-up booked for today at 4:00 PM with Mariam.",
    iconName: "Phone" as const,
  },
  {
    title: "Lead marked Hot",
    time: "11:22 AM",
    text: "High intent, suitable area, asked about contract and expected monthly return.",
    iconName: "Flame" as const,
  },
  {
    title: "Proposal task added",
    time: "11:47 AM",
    text: "Prepare owner acquisition package and send after call.",
    iconName: "CheckSquare" as const,
  },
];

export const tasks: Record<string, { title: string; time: string; level: string; owner: string }[]> = {
  Today: [
    { title: "Call Omar Hassan", time: "4:00 PM", level: "Urgent", owner: "Mariam" },
    { title: "Send owner proposal", time: "5:30 PM", level: "High", owner: "Nadine" },
    { title: "Review lost reasons", time: "6:00 PM", level: "Medium", owner: "Youssef" },
  ],
  Upcoming: [
    { title: "Investor meeting prep", time: "Tomorrow", level: "High", owner: "Nadine" },
    { title: "Warm lead re-engagement", time: "Monday", level: "Medium", owner: "Mariam" },
    { title: "Campaign source audit", time: "Tuesday", level: "Low", owner: "Marketing" },
  ],
  Completed: [
    { title: "Imported website leads", time: "9:10 AM", level: "Done", owner: "System" },
    { title: "Assigned TikTok inquiry", time: "9:45 AM", level: "Done", owner: "Admin" },
  ],
};

export const conversations = [
  {
    name: "Omar Hassan",
    channel: "WhatsApp",
    preview: "Can Houseiana fully manage the unit?",
    time: "2m ago",
    unread: 2,
    active: true,
  },
  {
    name: "Sara Adel",
    channel: "Email",
    preview: "Need 2-bedroom stay for Eid period.",
    time: "18m ago",
    unread: 0,
    active: false,
  },
  {
    name: "Abdullah Fahad",
    channel: "Call Note",
    preview: "Interested in investor meeting next week.",
    time: "43m ago",
    unread: 0,
    active: false,
  },
  {
    name: "Farah Magdy",
    channel: "Instagram",
    preview: "What documents are required to start?",
    time: "1h ago",
    unread: 1,
    active: false,
  },
];

export const reports = {
  sources: [
    ["Meta Ads", "34%"],
    ["WhatsApp", "26%"],
    ["Website", "19%"],
    ["Referral", "12%"],
    ["Instagram", "9%"],
  ] as [string, string][],
  team: [
    ["Mariam", "28 leads handled", "22% win rate"],
    ["Youssef", "19 follow-ups today", "14% win rate"],
    ["Nadine", "6 proposals sent", "31% win rate"],
  ] as [string, string, string][],
};

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
