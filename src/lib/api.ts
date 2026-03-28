const API_BASE = "";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("crm_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options?.headers,
    },
    ...options,
  });
  if (res.status === 401 && typeof window !== "undefined" && !path.includes("/auth/")) {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `API error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth Types ──

export interface CrmUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: CrmUser;
}

// ── Auth API ──

export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<CrmUser>("/api/auth/me"),
};

export const teamApi = {
  getAll: () => request<CrmUser[]>("/api/team"),
  getById: (id: string) => request<CrmUser>(`/api/team/${id}`),
  create: (data: { email: string; password: string; name: string; role: string }) =>
    request<CrmUser>("/api/team", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: { email?: string; password?: string; name?: string; role?: string; isActive?: boolean }) =>
    request<CrmUser>(`/api/team/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/team/${id}`, { method: "DELETE" }),
  deactivate: (id: string) =>
    request<void>(`/api/team/${id}/deactivate`, { method: "PATCH" }),
};

// ── Types ──

export interface SalesLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: string;
  source: string;
  score: string;
  stage: string;
  city?: string;
  country?: string;
  language?: string;
  budget?: string;
  targetArea?: string;
  notes?: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  nextFollowUp?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  activityCount: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SalesTaskItem {
  id: string;
  title: string;
  description?: string;
  priority: string;
  owner: string;
  dueDate?: string;
  isCompleted: boolean;
  completedAt?: string;
  leadId?: string;
  leadName?: string;
  createdAt: string;
}

export interface ConversationItem {
  id: string;
  channel: string;
  leadId?: string;
  leadName?: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  unreadCount: number;
  messages: MessageItem[];
}

export interface MessageItem {
  id: string;
  content: string;
  senderName: string;
  isFromAgent: boolean;
  sentAt: string;
}

export interface SalesActivityItem {
  id: string;
  action: string;
  details?: string;
  performedBy?: string;
  leadId: string;
  leadName?: string;
  timestamp: string;
}

export interface DashboardData {
  totalLeads: number;
  newToday: number;
  hotLeads: number;
  conversionRate: number;
  pipelineCounts: Record<string, number>;
  sourceCounts: Record<string, number>;
  teamStats: { name: string; leadsHandled: number; wonCount: number; winRate: number }[];
  overdueTasks: number;
  tasksDueToday: number;
}

// ── API Functions ──

export const salesLeadsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<PagedResult<SalesLead>>(`/api/sales/leads${qs}`);
  },
  getById: (id: string) => request<SalesLead>(`/api/sales/leads/${id}`),
  create: (data: Partial<SalesLead>) =>
    request<SalesLead>("/api/sales/leads", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<SalesLead>) =>
    request<SalesLead>(`/api/sales/leads/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  updateStage: (id: string, stage: string) =>
    request<SalesLead>(`/api/sales/leads/${id}/stage`, { method: "PATCH", body: JSON.stringify({ stage }) }),
  updateScore: (id: string, score: string) =>
    request<SalesLead>(`/api/sales/leads/${id}/score`, { method: "PATCH", body: JSON.stringify({ score }) }),
  archive: (id: string) =>
    request<void>(`/api/sales/leads/${id}/archive`, { method: "PATCH" }),
  delete: (id: string) =>
    request<void>(`/api/sales/leads/${id}`, { method: "DELETE" }),
  getDashboard: () => request<DashboardData>("/api/sales/leads/dashboard"),
  getPipeline: () => request<Record<string, SalesLead[]>>("/api/sales/leads/pipeline"),
};

export const salesTasksApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<SalesTaskItem[]>(`/api/sales/tasks${qs}`);
  },
  getById: (id: string) => request<SalesTaskItem>(`/api/sales/tasks/${id}`),
  create: (data: { title: string; owner: string; priority?: string; dueDate?: string; leadId?: string; description?: string }) =>
    request<SalesTaskItem>("/api/sales/tasks", { method: "POST", body: JSON.stringify(data) }),
  toggle: (id: string) =>
    request<SalesTaskItem>(`/api/sales/tasks/${id}/toggle`, { method: "PATCH" }),
  delete: (id: string) =>
    request<void>(`/api/sales/tasks/${id}`, { method: "DELETE" }),
};

export const conversationsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<ConversationItem[]>(`/api/sales/conversations${qs}`);
  },
  getById: (id: string) => request<ConversationItem>(`/api/sales/conversations/${id}`),
  create: (data: { channel: string; leadId?: string }) =>
    request<ConversationItem>("/api/sales/conversations", { method: "POST", body: JSON.stringify(data) }),
  sendMessage: (id: string, data: { content: string; senderName: string; isFromAgent: boolean }) =>
    request<MessageItem>(`/api/sales/conversations/${id}/messages`, { method: "POST", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/sales/conversations/${id}`, { method: "DELETE" }),
};

export const salesActivitiesApi = {
  getByLead: (leadId: string) =>
    request<SalesActivityItem[]>(`/api/sales/activities?leadId=${leadId}`),
  create: (data: { action: string; details?: string; performedBy?: string; leadId: string }) =>
    request<SalesActivityItem>("/api/sales/activities", { method: "POST", body: JSON.stringify(data) }),
};
