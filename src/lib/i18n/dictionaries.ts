export type Locale = "en" | "ar";

export interface Dictionary {
  dir: "ltr" | "rtl";
  // ── Common ──
  appName: string;
  appSubtitle: string;
  workspace: string;
  signOut: string;
  signIn: string;
  signingIn: string;
  email: string;
  password: string;
  enterEmail: string;
  enterPassword: string;
  signInToAccount: string;
  loading: string;
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  create: string;
  search: string;
  searchPlaceholder: string;
  view: string;
  actions: string;
  confirm: string;
  dismiss: string;
  noData: string;
  optional: string;
  required: string;
  today: string;
  upcoming: string;
  completed: string;
  all: string;

  // ── Navigation ──
  nav: {
    dashboard: string;
    leads: string;
    pipeline: string;
    tasks: string;
    communications: string;
    reports: string;
    team: string;
    settings: string;
  };

  // ── View Meta ──
  viewMeta: Record<string, {
    eyebrow: string;
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
  }>;

  // ── Dashboard ──
  dashboard: {
    totalLeads: string;
    newToday: string;
    hotLeads: string;
    conversionRate: string;
    vsLastMonth: string;
    freshInbound: string;
    priorityFollowUp: string;
    qualifiedToWon: string;
    leadFlowThisWeek: string;
    leadFlowSub: string;
    leadSources: string;
    topChannels: string;
    pipelineSnapshot: string;
    pipelineSub: string;
    recentLeads: string;
    fastAccess: string;
    todaysTasks: string;
    teamPerformance: string;
    leadTimeline: string;
    allTouchpoints: string;
    followupsDue: string;
    missed: string;
    wonThisWeek: string;
    showingWorkspace: string;
    todaysFocus: string;
    todaysFocusText: string;
    openTasks: string;
  };

  // ── Leads ──
  leads: {
    newLeads: string;
    qualified: string;
    unassigned: string;
    addLead: string;
    allLeads: string;
    owners: string;
    guests: string;
    investors: string;
    corporate: string;
    hot: string;
    searchLeads: string;
    lead: string;
    type: string;
    source: string;
    city: string;
    budget: string;
    stage: string;
    score: string;
    loadingLeads: string;
    noLeadsFound: string;
    deleteLead: string;
    nextFollowUp: string;
  };

  // ── Pipeline ──
  pipeline: {
    totalInPipeline: string;
    proposals: string;
    won: string;
    qualified: string;
    professionalFunnel: string;
    funnelSub: string;
    stageBased: string;
    slaDriven: string;
    bestPractice: string;
    clickToPreview: string;
    stageRules: string;
    stageRulesSub: string;
    performanceTrend: string;
    performanceTrendSub: string;
    noLeads: string;
    moveTo: string;
    current: string;
    objective: string;
    sla: string;
    share: string;
  };

  // ── Pipeline Stage Names ──
  stages: {
    newLead: string;
    contacted: string;
    qualified: string;
    proposal: string;
    negotiation: string;
    won: string;
    lost: string;
  };

  // ── Pipeline Stage Objectives ──
  stageObjectives: {
    newLead: string;
    contacted: string;
    qualified: string;
    proposal: string;
    negotiation: string;
    won: string;
    lost: string;
  };

  // ── Pipeline Stage SLAs ──
  stageSLAs: {
    newLead: string;
    contacted: string;
    qualified: string;
    proposal: string;
    negotiation: string;
    won: string;
    lost: string;
  };

  // ── Tasks ──
  tasks: {
    pending: string;
    dueToday: string;
    taskList: string;
    taskListSub: string;
    newTask: string;
    focusToday: string;
    focusTodaySub: string;
    urgentTasks: string;
    immediateAction: string;
    highPriority: string;
    completeToday: string;
    greatProgress: string;
    getStarted: string;
    executionRhythm: string;
    dailyCadence: string;
    leadReview: string;
    ownerFollowUp: string;
    proposalWindow: string;
    endOfDay: string;
    title: string;
    priority: string;
    owner: string;
    dueDate: string;
    description: string;
    createTask: string;
    creating: string;
    noTasks: string;
    deleteTask: string;
  };

  // ── Communications ──
  comms: {
    conversations: string;
    recentInteractions: string;
    typeMessage: string;
    channelOverview: string;
    activityBreakdown: string;
    whatsapp: string;
    calls: string;
    emailChannel: string;
    inbox: string;
    active: string;
    threads: string;
    unread: string;
  };

  // ── Reports ──
  reports: {
    leadSourceBreakdown: string;
    channelPerformance: string;
    teamOutput: string;
    agentPerformance: string;
    leadsHandled: string;
    winRate: string;
    conversionTrend: string;
    weeklyConversion: string;
  };

  // ── Team ──
  teamView: {
    teamMembers: string;
    manageTeam: string;
    addMember: string;
    name: string;
    role: string;
    status: string;
    active: string;
    inactive: string;
    deactivate: string;
    activate: string;
    editMember: string;
    createMember: string;
    roles: {
      admin: string;
      salesManager: string;
      salesAgent: string;
      businessDev: string;
      viewOnly: string;
    };
  };

  // ── Settings ──
  settingsView: {
    teamRoles: string;
    teamRolesDesc: string;
    leadScoring: string;
    leadScoringDesc: string;
    automations: string;
    automationsDesc: string;
    pipelineRules: string;
    pipelineRulesDesc: string;
    configure: string;
    systemPrefs: string;
    systemPrefsSub: string;
    defaultAssignment: string;
    defaultAssignmentDesc: string;
    inactivityAlert: string;
    inactivityAlertDesc: string;
    dataRetention: string;
    dataRetentionDesc: string;
  };

  // ── Lead Preview Drawer ──
  preview: {
    call: string;
    whatsapp: string;
    addTask: string;
    moveStage: string;
    openFullLead: string;
    leadDetails: string;
    notes: string;
    quickTask: string;
    agent: string;
  };

  // ── Create Lead Form ──
  createLead: {
    houseianaAcquisition: string;
    createNewLead: string;
    createSub: string;
    primaryContact: string;
    primaryContactSub: string;
    contactName: string;
    companyName: string;
    emailAddress: string;
    mobileWhatsapp: string;
    preferredLanguage: string;
    country: string;
    cityLabel: string;
    leadClassification: string;
    leadClassificationSub: string;
    leadType: string;
    businessLine: string;
    propertyScope: string;
    propertyScopeSub: string;
    propertyCount: string;
    assetType: string;
    targetLocation: string;
    unitReadiness: string;
    expectedPrice: string;
    managementScope: string;
    acquisitionQualification: string;
    acquisitionSub: string;
    leadSource: string;
    campaignRef: string;
    pipelineStage: string;
    priorityScore: string;
    assignedAgent: string;
    nextFollowUp: string;
    internalNotes: string;
    internalNotesSub: string;
    saveAsDraft: string;
    assignLater: string;
    createHouseianaLead: string;
    saving: string;
    allFieldsSaved: string;
  };

  // ── Score Labels ──
  scores: {
    hot: string;
    warm: string;
    cold: string;
    priority: string;
    won: string;
    urgent: string;
    high: string;
    medium: string;
    low: string;
    done: string;
  };
}

/* ═══════════════════ ENGLISH ═══════════════════ */

export const en: Dictionary = {
  dir: "ltr",
  appName: "Houseiana CRM",
  appSubtitle: "Lead Control Center",
  workspace: "Workspace",
  signOut: "Sign out",
  signIn: "Sign in",
  signingIn: "Signing in...",
  email: "Email",
  password: "Password",
  enterEmail: "Enter your email",
  enterPassword: "Enter your password",
  signInToAccount: "Sign in to your account",
  loading: "Loading...",
  cancel: "Cancel",
  save: "Save",
  delete: "Delete",
  edit: "Edit",
  create: "Create",
  search: "Search",
  searchPlaceholder: "Search leads, phone, campaign...",
  view: "View",
  actions: "Actions",
  confirm: "Confirm",
  dismiss: "Dismiss",
  noData: "No data",
  optional: "Optional",
  required: "*",
  today: "Today",
  upcoming: "Upcoming",
  completed: "Completed",
  all: "All",

  nav: {
    dashboard: "Dashboard",
    leads: "Leads",
    pipeline: "Pipeline",
    tasks: "Tasks",
    communications: "Communications",
    reports: "Reports",
    team: "Team",
    settings: "Settings",
  },

  viewMeta: {
    Dashboard: { eyebrow: "Overview", title: "Lead dashboard", subtitle: "Executive visibility across performance, follow-up, and conversion momentum.", primary: "+ New Lead", secondary: "Export" },
    Leads: { eyebrow: "Lead management", title: "Leads workspace", subtitle: "Search, qualify, assign, and move every Houseiana opportunity with clarity.", primary: "+ Add Lead", secondary: "Filters" },
    Pipeline: { eyebrow: "Conversion flow", title: "Pipeline board", subtitle: "A structured funnel built around qualification, proposal control, negotiation discipline, and clean handoff.", primary: "+ Create Stage", secondary: "Pipeline Rules" },
    Tasks: { eyebrow: "Execution layer", title: "Tasks & follow-ups", subtitle: "Stay on top of every reminder, overdue follow-up, and handoff task.", primary: "+ New Task", secondary: "Calendar View" },
    Communications: { eyebrow: "Unified interactions", title: "Communications hub", subtitle: "Calls, emails, WhatsApp, and social conversations in one premium workspace.", primary: "+ Log Activity", secondary: "Channels" },
    Reports: { eyebrow: "Business intelligence", title: "Reports & analytics", subtitle: "Measure channel quality, agent output, and funnel efficiency.", primary: "Export Report", secondary: "Date Range" },
    Settings: { eyebrow: "System controls", title: "CRM settings", subtitle: "Configure permissions, automations, lead logic, and Houseiana workflow rules.", primary: "Save Changes", secondary: "Security" },
    Team: { eyebrow: "People management", title: "Team workspace", subtitle: "Manage roles, access, and team member assignments.", primary: "+ Add Member", secondary: "Roles" },
  },

  dashboard: {
    totalLeads: "Total Leads", newToday: "New Today", hotLeads: "Hot Leads", conversionRate: "Conversion Rate",
    vsLastMonth: "vs last month", freshInbound: "fresh inbound leads", priorityFollowUp: "priority follow-up", qualifiedToWon: "qualified to won",
    leadFlowThisWeek: "Lead flow this week", leadFlowSub: "Capture, qualification, and follow-up momentum",
    leadSources: "Lead sources", topChannels: "Top performing channels this month",
    pipelineSnapshot: "Sales funnel snapshot", pipelineSub: "Move opportunities through clear gates instead of a loose lead list.",
    recentLeads: "Recent leads", fastAccess: "Fast access to the highest priority opportunities",
    todaysTasks: "Today's tasks", teamPerformance: "Team performance",
    leadTimeline: "Lead timeline", allTouchpoints: "All touchpoints in one operational view",
    followupsDue: "Follow-ups Due", missed: "Missed", wonThisWeek: "Won This Week",
    showingWorkspace: "Showing the current workspace",
    todaysFocus: "Today's focus", todaysFocusText: "follow-ups are due today. hot leads need immediate action.",
    openTasks: "Open Tasks",
  },

  leads: {
    newLeads: "New Leads", qualified: "Qualified", unassigned: "Unassigned",
    addLead: "Add Lead", allLeads: "All leads", owners: "Owners", guests: "Guests",
    investors: "Investors", corporate: "Corporate", hot: "Hot", searchLeads: "Search leads...",
    lead: "Lead", type: "Type", source: "Source", city: "City", budget: "Budget",
    stage: "Stage", score: "Score", loadingLeads: "Loading leads...", noLeadsFound: "No leads found.",
    deleteLead: "Delete this lead?", nextFollowUp: "Next Follow-up",
  },

  pipeline: {
    totalInPipeline: "Total in Pipeline", proposals: "Proposals", won: "Won", qualified: "Qualified",
    professionalFunnel: "Professional sales funnel",
    funnelSub: "Click any lead card to open the preview panel.",
    stageBased: "Stage-based process", slaDriven: "SLA driven", bestPractice: "Best-practice flow",
    clickToPreview: "Click to preview",
    stageRules: "Stage rules", stageRulesSub: "Houseiana-specific pipeline logic for premium lead handling",
    performanceTrend: "Pipeline performance trend", performanceTrendSub: "Movement speed from first contact to proposal and close",
    noLeads: "No leads", moveTo: "Move to stage", current: "Current",
    objective: "Objective", sla: "SLA", share: "Share",
  },

  stages: { newLead: "New Lead", contacted: "Contacted", qualified: "Qualified", proposal: "Proposal", negotiation: "Negotiation", won: "Won", lost: "Lost" },
  stageObjectives: {
    newLead: "Capture and verify the opportunity", contacted: "Make first contact and confirm fit",
    qualified: "Validate budget, location, and service fit", proposal: "Send offer, package, or commercial proposal",
    negotiation: "Resolve objections and align on terms", won: "Confirm, hand off, and start onboarding", lost: "Document reason and archive",
  },
  stageSLAs: {
    newLead: "Respond in 15 min", contacted: "Same day follow-up", qualified: "Move within 24h",
    proposal: "Within 24h of qualification", negotiation: "Daily touchpoint", won: "Immediate handoff", lost: "Post-mortem review",
  },

  tasks: {
    pending: "Pending", dueToday: "Due Today", taskList: "Task list", taskListSub: "All follow-ups, calls, proposals, and actions in one view",
    newTask: "New Task", focusToday: "Focus today", focusTodaySub: "What must happen for pipeline health",
    urgentTasks: "urgent task", immediateAction: "Immediate action needed",
    highPriority: "high-priority task", completeToday: "Complete today",
    greatProgress: "Great progress", getStarted: "Get started",
    executionRhythm: "Execution rhythm", dailyCadence: "Daily operational cadence",
    leadReview: "Lead review and assignment", ownerFollowUp: "Owner follow-up block",
    proposalWindow: "Proposal and negotiation window", endOfDay: "End-of-day performance check",
    title: "Title", priority: "Priority", owner: "Owner", dueDate: "Due Date", description: "Description",
    createTask: "Create Task", creating: "Creating...", noTasks: "No tasks yet. Create your first task to get started.",
    deleteTask: "Delete this task?",
  },

  comms: {
    conversations: "Conversations", recentInteractions: "Recent interactions", typeMessage: "Type a message...",
    channelOverview: "Channel overview", activityBreakdown: "Activity breakdown across all communication channels",
    whatsapp: "WhatsApp", calls: "Calls", emailChannel: "Email", inbox: "Inbox",
    active: "active", threads: "threads", unread: "unread",
  },

  reports: {
    leadSourceBreakdown: "Lead source breakdown", channelPerformance: "Channel performance this month",
    teamOutput: "Team output", agentPerformance: "Agent performance and workload",
    leadsHandled: "leads handled", winRate: "win rate",
    conversionTrend: "Conversion trend", weeklyConversion: "Weekly conversion rate",
  },

  teamView: {
    teamMembers: "Team members", manageTeam: "Manage your team", addMember: "Add Member",
    name: "Name", role: "Role", status: "Status", active: "Active", inactive: "Inactive",
    deactivate: "Deactivate", activate: "Activate", editMember: "Edit member", createMember: "Create member",
    roles: { admin: "Admin", salesManager: "Sales Manager", salesAgent: "Sales Agent", businessDev: "Business Development", viewOnly: "View Only" },
  },

  settingsView: {
    teamRoles: "Team & Roles", teamRolesDesc: "Manage Admin, Sales Manager, Sales Agent, Business Development, and view-only roles.",
    leadScoring: "Lead Scoring", leadScoringDesc: "Configure hot, warm, cold, and priority scoring rules by source, budget, and urgency.",
    automations: "Automations", automationsDesc: "Create reminders, task triggers, round-robin assignment, and inactivity alerts.",
    pipelineRules: "Pipeline Rules", pipelineRulesDesc: "Customize lead stages for owners, guests, investors, and B2B partnership flows.",
    configure: "Configure",
    systemPrefs: "System preferences", systemPrefsSub: "Global Houseiana CRM settings and integrations",
    defaultAssignment: "Default lead assignment", defaultAssignmentDesc: "Round-robin between active agents with language match",
    inactivityAlert: "Inactivity alert", inactivityAlertDesc: "Trigger notification after 4 hours with no action on hot lead",
    dataRetention: "Data retention", dataRetentionDesc: "Archive leads inactive for 90+ days",
  },

  preview: {
    call: "Call", whatsapp: "WhatsApp", addTask: "Add Task", moveStage: "Move Stage",
    openFullLead: "Open Full Lead", leadDetails: "Lead details", notes: "Notes", quickTask: "Quick task", agent: "Agent",
  },

  createLead: {
    houseianaAcquisition: "Houseiana Lead Acquisition", createNewLead: "Create new lead",
    createSub: "Capture and qualify a new opportunity for Houseiana Listing, Assets Management, or B2B Partnerships.",
    primaryContact: "Primary Contact", primaryContactSub: "Decision-maker or operational contact for this opportunity",
    contactName: "Contact Name", companyName: "Company / Portfolio Name", emailAddress: "Email Address",
    mobileWhatsapp: "Mobile / WhatsApp", preferredLanguage: "Preferred Language", country: "Country", cityLabel: "City",
    leadClassification: "Lead Classification", leadClassificationSub: "Define the opportunity type and Houseiana business line",
    leadType: "Lead Type", businessLine: "Business Line",
    propertyScope: "Property or Account Scope", propertyScopeSub: "Capture property details, portfolio size, or account scope for larger opportunities",
    propertyCount: "Property Count / Portfolio Size", assetType: "Asset / Property Type",
    targetLocation: "Target Location", unitReadiness: "Unit Readiness", expectedPrice: "Expected Price / Monthly Target",
    managementScope: "Management Scope",
    acquisitionQualification: "Acquisition & Qualification",
    acquisitionSub: "Qualify the opportunity with source tracking, scoring, and pipeline assignment",
    leadSource: "Lead Source", campaignRef: "Campaign / Reference", pipelineStage: "Pipeline Stage",
    priorityScore: "Priority Score", assignedAgent: "Assigned Agent", nextFollowUp: "Next Follow-up",
    internalNotes: "Internal Qualification Notes", internalNotesSub: "Operational context, urgency, blockers, and next actions for the team",
    saveAsDraft: "Save as Draft", assignLater: "Assign Later", createHouseianaLead: "Create Houseiana Lead",
    saving: "Saving...", allFieldsSaved: "All fields are saved to the Houseiana CRM pipeline.",
  },

  scores: { hot: "Hot", warm: "Warm", cold: "Cold", priority: "Priority", won: "Won", urgent: "Urgent", high: "High", medium: "Medium", low: "Low", done: "Done" },
};

/* ═══════════════════ ARABIC ═══════════════════ */

export const ar: Dictionary = {
  dir: "rtl",
  appName: "هاوسيانا CRM",
  appSubtitle: "مركز إدارة العملاء المحتملين",
  workspace: "مساحة العمل",
  signOut: "تسجيل الخروج",
  signIn: "تسجيل الدخول",
  signingIn: "جارٍ تسجيل الدخول...",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  enterEmail: "أدخل بريدك الإلكتروني",
  enterPassword: "أدخل كلمة المرور",
  signInToAccount: "تسجيل الدخول إلى حسابك",
  loading: "جارٍ التحميل...",
  cancel: "إلغاء",
  save: "حفظ",
  delete: "حذف",
  edit: "تعديل",
  create: "إنشاء",
  search: "بحث",
  searchPlaceholder: "ابحث عن عميل، هاتف، حملة...",
  view: "عرض",
  actions: "إجراءات",
  confirm: "تأكيد",
  dismiss: "إغلاق",
  noData: "لا توجد بيانات",
  optional: "اختياري",
  required: "*",
  today: "اليوم",
  upcoming: "القادم",
  completed: "مكتمل",
  all: "الكل",

  nav: {
    dashboard: "لوحة التحكم",
    leads: "العملاء المحتملين",
    pipeline: "مسار المبيعات",
    tasks: "المهام",
    communications: "التواصل",
    reports: "التقارير",
    team: "الفريق",
    settings: "الإعدادات",
  },

  viewMeta: {
    Dashboard: { eyebrow: "نظرة عامة", title: "لوحة تحكم العملاء", subtitle: "رؤية شاملة للأداء والمتابعة وزخم التحويل.", primary: "+ عميل جديد", secondary: "تصدير" },
    Leads: { eyebrow: "إدارة العملاء", title: "مساحة العملاء المحتملين", subtitle: "ابحث وصنّف وعيّن وانقل كل فرصة في هاوسيانا بوضوح.", primary: "+ إضافة عميل", secondary: "فلاتر" },
    Pipeline: { eyebrow: "مسار التحويل", title: "لوحة مسار المبيعات", subtitle: "مسار مبيعات منظم مبني على التأهيل والتفاوض والتسليم.", primary: "+ إنشاء مرحلة", secondary: "قواعد المسار" },
    Tasks: { eyebrow: "طبقة التنفيذ", title: "المهام والمتابعات", subtitle: "تابع كل تذكير ومتابعة متأخرة ومهمة تسليم.", primary: "+ مهمة جديدة", secondary: "عرض التقويم" },
    Communications: { eyebrow: "التواصل الموحد", title: "مركز التواصل", subtitle: "المكالمات والبريد والواتساب ومحادثات السوشيال في مساحة واحدة.", primary: "+ تسجيل نشاط", secondary: "القنوات" },
    Reports: { eyebrow: "ذكاء الأعمال", title: "التقارير والتحليلات", subtitle: "قياس جودة القنوات وإنتاجية الفريق وكفاءة المسار.", primary: "تصدير التقرير", secondary: "نطاق التاريخ" },
    Settings: { eyebrow: "إعدادات النظام", title: "إعدادات CRM", subtitle: "ضبط الصلاحيات والأتمتة وقواعد العمل في هاوسيانا.", primary: "حفظ التغييرات", secondary: "الأمان" },
    Team: { eyebrow: "إدارة الأفراد", title: "مساحة الفريق", subtitle: "إدارة الأدوار والصلاحيات وتعيينات أعضاء الفريق.", primary: "+ إضافة عضو", secondary: "الأدوار" },
  },

  dashboard: {
    totalLeads: "إجمالي العملاء", newToday: "جديد اليوم", hotLeads: "عملاء ساخنين", conversionRate: "معدل التحويل",
    vsLastMonth: "مقارنة بالشهر الماضي", freshInbound: "عملاء واردين جدد", priorityFollowUp: "متابعة ذات أولوية", qualifiedToWon: "مؤهل إلى فائز",
    leadFlowThisWeek: "تدفق العملاء هذا الأسبوع", leadFlowSub: "الاستحواذ والتأهيل وزخم المتابعة",
    leadSources: "مصادر العملاء", topChannels: "أفضل القنوات أداءً هذا الشهر",
    pipelineSnapshot: "لمحة مسار المبيعات", pipelineSub: "حرّك الفرص عبر بوابات واضحة بدلاً من قائمة عشوائية.",
    recentLeads: "أحدث العملاء", fastAccess: "وصول سريع لأعلى الفرص أولوية",
    todaysTasks: "مهام اليوم", teamPerformance: "أداء الفريق",
    leadTimeline: "الجدول الزمني للعميل", allTouchpoints: "جميع نقاط التواصل في عرض واحد",
    followupsDue: "متابعات مستحقة", missed: "فائتة", wonThisWeek: "فائز هذا الأسبوع",
    showingWorkspace: "عرض مساحة العمل الحالية",
    todaysFocus: "تركيز اليوم", todaysFocusText: "متابعات مستحقة اليوم. عملاء ساخنين يحتاجون إجراء فوري.",
    openTasks: "فتح المهام",
  },

  leads: {
    newLeads: "عملاء جدد", qualified: "مؤهلين", unassigned: "غير معيّنين",
    addLead: "إضافة عميل", allLeads: "جميع العملاء", owners: "ملّاك", guests: "ضيوف",
    investors: "مستثمرين", corporate: "شركات", hot: "ساخن", searchLeads: "ابحث عن عملاء...",
    lead: "العميل", type: "النوع", source: "المصدر", city: "المدينة", budget: "الميزانية",
    stage: "المرحلة", score: "التقييم", loadingLeads: "جارٍ تحميل العملاء...", noLeadsFound: "لا يوجد عملاء.",
    deleteLead: "هل تريد حذف هذا العميل؟", nextFollowUp: "المتابعة القادمة",
  },

  pipeline: {
    totalInPipeline: "إجمالي المسار", proposals: "العروض", won: "فائز", qualified: "مؤهل",
    professionalFunnel: "مسار مبيعات احترافي",
    funnelSub: "اضغط على بطاقة العميل لفتح لوحة المعاينة.",
    stageBased: "مبني على المراحل", slaDriven: "مدفوع بالـ SLA", bestPractice: "أفضل الممارسات",
    clickToPreview: "اضغط للمعاينة",
    stageRules: "قواعد المراحل", stageRulesSub: "قواعد مسار هاوسيانا المخصصة للتعامل المتميز مع العملاء",
    performanceTrend: "اتجاه أداء المسار", performanceTrendSub: "سرعة الانتقال من أول تواصل إلى العرض والإغلاق",
    noLeads: "لا يوجد عملاء", moveTo: "نقل إلى مرحلة", current: "الحالي",
    objective: "الهدف", sla: "SLA", share: "الحصة",
  },

  stages: { newLead: "عميل جديد", contacted: "تم التواصل", qualified: "مؤهل", proposal: "عرض", negotiation: "تفاوض", won: "فائز", lost: "خسارة" },
  stageObjectives: {
    newLead: "استحواذ والتحقق من الفرصة", contacted: "إجراء أول تواصل وتأكيد الملاءمة",
    qualified: "التحقق من الميزانية والموقع وملاءمة الخدمة", proposal: "إرسال عرض أو حزمة تجارية",
    negotiation: "حل الاعتراضات والاتفاق على الشروط", won: "التأكيد والتسليم وبدء التهيئة", lost: "توثيق السبب والأرشفة",
  },
  stageSLAs: {
    newLead: "الرد خلال 15 دقيقة", contacted: "متابعة في نفس اليوم", qualified: "الانتقال خلال 24 ساعة",
    proposal: "خلال 24 ساعة من التأهيل", negotiation: "تواصل يومي", won: "تسليم فوري", lost: "مراجعة ما بعد الخسارة",
  },

  tasks: {
    pending: "قيد الانتظار", dueToday: "مستحقة اليوم", taskList: "قائمة المهام",
    taskListSub: "جميع المتابعات والمكالمات والعروض والإجراءات في عرض واحد",
    newTask: "مهمة جديدة", focusToday: "تركيز اليوم", focusTodaySub: "ما يجب أن يحدث لصحة المسار",
    urgentTasks: "مهمة عاجلة", immediateAction: "إجراء فوري مطلوب",
    highPriority: "مهمة عالية الأولوية", completeToday: "أكمل اليوم",
    greatProgress: "تقدم ممتاز", getStarted: "ابدأ الآن",
    executionRhythm: "إيقاع التنفيذ", dailyCadence: "الإيقاع التشغيلي اليومي",
    leadReview: "مراجعة العملاء والتعيين", ownerFollowUp: "فترة متابعة الملّاك",
    proposalWindow: "نافذة العروض والتفاوض", endOfDay: "فحص الأداء نهاية اليوم",
    title: "العنوان", priority: "الأولوية", owner: "المسؤول", dueDate: "تاريخ الاستحقاق", description: "الوصف",
    createTask: "إنشاء مهمة", creating: "جارٍ الإنشاء...", noTasks: "لا توجد مهام بعد. أنشئ أول مهمة للبدء.",
    deleteTask: "هل تريد حذف هذه المهمة؟",
  },

  comms: {
    conversations: "المحادثات", recentInteractions: "التفاعلات الأخيرة", typeMessage: "اكتب رسالة...",
    channelOverview: "نظرة عامة على القنوات", activityBreakdown: "تحليل النشاط عبر جميع قنوات التواصل",
    whatsapp: "واتساب", calls: "مكالمات", emailChannel: "بريد إلكتروني", inbox: "صندوق الوارد",
    active: "نشط", threads: "محادثات", unread: "غير مقروء",
  },

  reports: {
    leadSourceBreakdown: "تحليل مصادر العملاء", channelPerformance: "أداء القنوات هذا الشهر",
    teamOutput: "إنتاجية الفريق", agentPerformance: "أداء الوكلاء وحجم العمل",
    leadsHandled: "عملاء تم التعامل معهم", winRate: "معدل الفوز",
    conversionTrend: "اتجاه التحويل", weeklyConversion: "معدل التحويل الأسبوعي",
  },

  teamView: {
    teamMembers: "أعضاء الفريق", manageTeam: "إدارة فريقك", addMember: "إضافة عضو",
    name: "الاسم", role: "الدور", status: "الحالة", active: "نشط", inactive: "غير نشط",
    deactivate: "إلغاء التفعيل", activate: "تفعيل", editMember: "تعديل العضو", createMember: "إنشاء عضو",
    roles: { admin: "مدير النظام", salesManager: "مدير المبيعات", salesAgent: "وكيل مبيعات", businessDev: "تطوير الأعمال", viewOnly: "عرض فقط" },
  },

  settingsView: {
    teamRoles: "الفريق والأدوار", teamRolesDesc: "إدارة أدوار المدير ومدير المبيعات ووكيل المبيعات وتطوير الأعمال والعرض فقط.",
    leadScoring: "تقييم العملاء", leadScoringDesc: "ضبط قواعد التقييم الساخن والدافئ والبارد والأولوية حسب المصدر والميزانية.",
    automations: "الأتمتة", automationsDesc: "إنشاء تذكيرات ومحفزات المهام والتعيين الدوري وتنبيهات عدم النشاط.",
    pipelineRules: "قواعد المسار", pipelineRulesDesc: "تخصيص مراحل العملاء للملّاك والضيوف والمستثمرين وشراكات B2B.",
    configure: "ضبط",
    systemPrefs: "تفضيلات النظام", systemPrefsSub: "إعدادات هاوسيانا CRM العامة والتكاملات",
    defaultAssignment: "التعيين الافتراضي للعملاء", defaultAssignmentDesc: "توزيع دوري بين الوكلاء النشطين مع مطابقة اللغة",
    inactivityAlert: "تنبيه عدم النشاط", inactivityAlertDesc: "إرسال إشعار بعد 4 ساعات بدون إجراء على عميل ساخن",
    dataRetention: "الاحتفاظ بالبيانات", dataRetentionDesc: "أرشفة العملاء غير النشطين لأكثر من 90 يوم",
  },

  preview: {
    call: "اتصال", whatsapp: "واتساب", addTask: "إضافة مهمة", moveStage: "نقل المرحلة",
    openFullLead: "فتح العميل بالكامل", leadDetails: "تفاصيل العميل", notes: "ملاحظات", quickTask: "مهمة سريعة", agent: "الوكيل",
  },

  createLead: {
    houseianaAcquisition: "استحواذ عملاء هاوسيانا", createNewLead: "إنشاء عميل جديد",
    createSub: "استحواذ وتأهيل فرصة جديدة لإدراج هاوسيانا أو إدارة الأصول أو شراكات B2B.",
    primaryContact: "جهة الاتصال الرئيسية", primaryContactSub: "صانع القرار أو جهة الاتصال التشغيلية لهذه الفرصة",
    contactName: "اسم جهة الاتصال", companyName: "اسم الشركة / المحفظة", emailAddress: "البريد الإلكتروني",
    mobileWhatsapp: "الجوال / واتساب", preferredLanguage: "اللغة المفضلة", country: "الدولة", cityLabel: "المدينة",
    leadClassification: "تصنيف العميل", leadClassificationSub: "تحديد نوع الفرصة وخط أعمال هاوسيانا",
    leadType: "نوع العميل", businessLine: "خط الأعمال",
    propertyScope: "نطاق العقار أو الحساب", propertyScopeSub: "تفاصيل العقار وحجم المحفظة أو نطاق الحساب للفرص الكبيرة",
    propertyCount: "عدد العقارات / حجم المحفظة", assetType: "نوع الأصل / العقار",
    targetLocation: "الموقع المستهدف", unitReadiness: "جاهزية الوحدة", expectedPrice: "السعر المتوقع / الهدف الشهري",
    managementScope: "نطاق الإدارة",
    acquisitionQualification: "الاستحواذ والتأهيل",
    acquisitionSub: "تأهيل الفرصة مع تتبع المصدر والتقييم وتعيين المسار",
    leadSource: "مصدر العميل", campaignRef: "الحملة / المرجع", pipelineStage: "مرحلة المسار",
    priorityScore: "تقييم الأولوية", assignedAgent: "الوكيل المعيّن", nextFollowUp: "المتابعة القادمة",
    internalNotes: "ملاحظات التأهيل الداخلية", internalNotesSub: "السياق التشغيلي والإلحاح والعوائق والإجراءات القادمة للفريق",
    saveAsDraft: "حفظ كمسودة", assignLater: "تعيين لاحقاً", createHouseianaLead: "إنشاء عميل هاوسيانا",
    saving: "جارٍ الحفظ...", allFieldsSaved: "يتم حفظ جميع الحقول في مسار هاوسيانا CRM.",
  },

  scores: { hot: "ساخن", warm: "دافئ", cold: "بارد", priority: "أولوية", won: "فائز", urgent: "عاجل", high: "عالي", medium: "متوسط", low: "منخفض", done: "مكتمل" },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ar };
