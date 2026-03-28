"use client";

import { useEffect, useState } from "react";
import {
  User,
  Building2,
  Globe,
  Phone,
  Mail,
  Languages,
  MapPin,
  Tag,
  Briefcase,
  Home,
  BarChart3,
  DollarSign,
  Settings2,
  Megaphone,
  Flame,
  UserCheck,
  CalendarClock,
  FileText,
  ChevronRight,
  Save,
  Clock,
  Send,
  Sparkles,
  Shield,
  Handshake,
  Key,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { salesLeadsApi, teamApi, type SalesLead, type CrmUser } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

/* ───────────────────────────── Constants ───────────────────────────── */

const LEAD_TYPES = [
  { value: "Listing Property Owner", icon: Home, desc: "Property listed on Houseiana platform" },
  { value: "Assets Management Owner", icon: Key, desc: "Full operations & management scope" },
  { value: "B2B Partner", icon: Handshake, desc: "Strategic partnership or channel" },
  { value: "Broker / Agent", icon: Shield, desc: "External broker or agency referral" },
  { value: "Guest Booking", icon: User, desc: "Short-term guest reservation" },
  { value: "Investor", icon: BarChart3, desc: "Investment or portfolio inquiry" },
];

const BUSINESS_LINES = [
  { value: "Houseiana Listing Properties", color: "bg-amber-50 border-amber-200 text-amber-900", icon: Home },
  { value: "Houseiana Assets Management", color: "bg-stone-100 border-stone-300 text-stone-900", icon: Layers },
  { value: "Houseiana B2B / Strategic Partnerships", color: "bg-yellow-50 border-yellow-200 text-yellow-900", icon: Handshake },
];

const ASSET_TYPES = [
  "Residential Apartment", "Villa / Compound", "Penthouse", "Townhouse",
  "Serviced Apartment", "Hotel Apartment", "Commercial Unit", "Retail Space",
  "Mixed-Use", "Land / Development", "Other",
];

const UNIT_READINESS = ["Furnished & Ready", "Partially Furnished", "Unfurnished", "Under Renovation", "Under Construction", "Needs Assessment"];

const MANAGEMENT_SCOPES = [
  { value: "Listing only", desc: "Houseiana lists and markets the property" },
  { value: "Full operations", desc: "End-to-end guest handling, pricing, maintenance" },
  { value: "Asset oversight", desc: "Portfolio monitoring, reporting, optimization" },
  { value: "Partnership", desc: "B2B channel, co-branding, or referral agreement" },
];

const SOURCES = [
  "Meta Ads", "Instagram", "TikTok", "WhatsApp", "Website", "Google Ads",
  "Direct Call", "Referral", "Partner", "Event", "Cold Outreach", "Other",
];

const SCORES = ["Hot", "Warm", "Cold", "Priority"];
const STAGES = ["New Lead", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
const LANGUAGES = ["Arabic", "English", "Arabic / English", "French", "Turkish", "Urdu", "Hindi", "Other"];

/* ───────────────────────────── Section Header ───────────────────────────── */

function SectionHeader({ step, title, subtitle, icon: Icon }: {
  step: number; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-4 pb-1">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-950 text-white shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Step {step}</span>
        </div>
        <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-stone-950">{title}</h3>
        <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>
      </div>
    </div>
  );
}

/* ───────────────────────────── Field Wrapper ───────────────────────────── */

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-stone-700">
        {label}
        {required && <span className="text-amber-600">*</span>}
        {!required && <span className="text-xs font-normal text-stone-400">Optional</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}
    </div>
  );
}

/* ───────────────────────────── Score Badge (inline) ───────────────────────────── */

const scoreColors: Record<string, string> = {
  Hot: "border-amber-200 bg-amber-50 text-amber-900",
  Warm: "border-stone-200 bg-stone-50 text-stone-800",
  Cold: "border-slate-200 bg-slate-50 text-slate-700",
  Priority: "border-yellow-200 bg-yellow-50 text-yellow-900",
};

/* ───────────────────────────── Main Component ───────────────────────────── */

export function CreateLeadForm({ onSuccess, onCancel }: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState("");
  const [agents, setAgents] = useState<CrmUser[]>([]);

  // ── Form State ──
  const [form, setForm] = useState({
    // Primary Contact
    name: "",
    companyName: "",
    email: "",
    phone: "",
    language: "Arabic / English",
    country: "",
    city: "",
    // Lead Classification
    type: "Listing Property Owner",
    businessLine: "Houseiana Listing Properties",
    // Property / Account Scope
    propertyCount: "",
    assetType: "",
    targetArea: "",
    unitReadiness: "",
    budget: "",
    managementScope: "Full operations",
    // Acquisition & Qualification
    source: "Meta Ads",
    campaignReference: "",
    score: "Warm",
    stage: "New Lead",
    assignedAgentName: "",
    nextFollowUp: "",
    // Notes
    notes: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    teamApi.getAll().then(setAgents).catch(() => {});
  }, []);

  const handleSubmit = async (isDraft = false) => {
    if (!form.name.trim()) { setError("Contact name is required"); return; }
    if (!form.phone.trim()) { setError("Mobile / WhatsApp is required"); return; }

    const setter = isDraft ? setSavingDraft : setSaving;
    setter(true);
    setError("");

    try {
      await salesLeadsApi.create({
        ...form,
        stage: isDraft ? "New Lead" : form.stage,
        assignedAgentName: isDraft ? "" : form.assignedAgentName,
      } as unknown as Partial<SalesLead>);
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create lead");
    } finally {
      setter(false);
    }
  };

  const inputClass = "h-11 rounded-2xl border-stone-200 bg-white px-4 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-1 focus:ring-stone-300";
  const selectClass = "h-11 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-900 shadow-sm";

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-950 text-xs font-bold text-white">H</div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Houseiana Lead Acquisition</span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">Create new lead</h2>
          <p className="mt-1 text-sm text-stone-500">
            Capture and qualify a new opportunity for Houseiana Listing, Assets Management, or B2B Partnerships.
          </p>
        </div>
        <Button variant="outline" onClick={onCancel} className="rounded-2xl border-stone-200 text-stone-600">
          Cancel
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-800">
          {error}
          <button onClick={() => setError("")} className="ml-3 font-semibold underline">Dismiss</button>
        </div>
      )}

      {/* ══════════════ SECTION 1 · Primary Contact ══════════════ */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="space-y-5 p-6">
          <SectionHeader step={1} title="Primary Contact" subtitle="Decision-maker or operational contact for this opportunity" icon={User} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Contact Name" required>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name of the decision-maker" className={inputClass} />
            </Field>
            <Field label="Company / Portfolio Name" hint="Organization, holding, or portfolio if applicable">
              <Input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Al-Nakheel Group, Hassan Properties..." className={inputClass} />
            </Field>
            <Field label="Email Address" hint="Primary business email">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="contact@company.com" className={`${inputClass} pl-10`} />
              </div>
            </Field>
            <Field label="Mobile / WhatsApp" required hint="Include country code">
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+974 5XXX XXXX" className={`${inputClass} pl-10`} />
              </div>
            </Field>
            <Field label="Preferred Language">
              <div className="relative">
                <Languages className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <select value={form.language} onChange={(e) => set("language", e.target.value)} className={`${selectClass} pl-10`}>
                  {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Country">
                <Input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="Qatar" className={inputClass} />
              </Field>
              <Field label="City">
                <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Doha" className={inputClass} />
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════ SECTION 2 · Lead Classification ══════════════ */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <SectionHeader step={2} title="Lead Classification" subtitle="Define the opportunity type and Houseiana business line" icon={Tag} />

          {/* Lead Type Cards */}
          <div>
            <p className="mb-3 text-sm font-medium text-stone-700">Lead Type <span className="text-amber-600">*</span></p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {LEAD_TYPES.map((lt) => {
                const active = form.type === lt.value;
                const Icon = lt.icon;
                return (
                  <button
                    key={lt.value}
                    type="button"
                    onClick={() => set("type", lt.value)}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-stone-900 bg-stone-950 text-white shadow-md"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <div className={`mt-0.5 rounded-xl p-2 ${active ? "bg-white/15" : "bg-stone-100"}`}>
                      <Icon className={`h-4 w-4 ${active ? "text-white" : "text-stone-600"}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${active ? "text-white" : "text-stone-900"}`}>{lt.value}</p>
                      <p className={`mt-0.5 text-xs ${active ? "text-white/70" : "text-stone-500"}`}>{lt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Line */}
          <div>
            <p className="mb-3 text-sm font-medium text-stone-700">Business Line <span className="text-amber-600">*</span></p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {BUSINESS_LINES.map((bl) => {
                const active = form.businessLine === bl.value;
                const Icon = bl.icon;
                return (
                  <button
                    key={bl.value}
                    type="button"
                    onClick={() => set("businessLine", bl.value)}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition ${
                      active
                        ? "border-stone-900 bg-stone-50 shadow-sm"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className={`rounded-xl p-2 ${active ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-600"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{bl.value}</p>
                      {active && <ChevronRight className="mt-0.5 h-3 w-3 text-stone-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════ SECTION 3 · Property / Account Scope ══════════════ */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="space-y-5 p-6">
          <SectionHeader step={3} title="Property or Account Scope" subtitle="Capture property details, portfolio size, or account scope for larger opportunities" icon={Building2} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Property Count / Portfolio Size" hint="Number of units or assets under consideration">
              <Input value={form.propertyCount} onChange={(e) => set("propertyCount", e.target.value)} placeholder="e.g. 3 units, 1 villa, portfolio of 12" className={inputClass} />
            </Field>
            <Field label="Asset / Property Type">
              <select value={form.assetType} onChange={(e) => set("assetType", e.target.value)} className={selectClass}>
                <option value="">Select property type</option>
                {ASSET_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Target Location" hint="Area, district, or building where the property is located">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input value={form.targetArea} onChange={(e) => set("targetArea", e.target.value)} placeholder="Lusail, The Pearl, West Bay..." className={`${inputClass} pl-10`} />
              </div>
            </Field>
            <Field label="Unit Readiness">
              <select value={form.unitReadiness} onChange={(e) => set("unitReadiness", e.target.value)} className={selectClass}>
                <option value="">Select readiness status</option>
                {UNIT_READINESS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Expected Price / Monthly Target" hint="Listing price, rental target, or investment value">
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="QAR 8,000/month or QAR 1.2M" className={`${inputClass} pl-10`} />
              </div>
            </Field>
          </div>

          {/* Management Scope Cards */}
          <div>
            <p className="mb-3 text-sm font-medium text-stone-700">Management Scope</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {MANAGEMENT_SCOPES.map((ms) => {
                const active = form.managementScope === ms.value;
                return (
                  <button
                    key={ms.value}
                    type="button"
                    onClick={() => set("managementScope", ms.value)}
                    className={`rounded-2xl border-2 p-4 text-left transition ${
                      active
                        ? "border-stone-900 bg-stone-50 shadow-sm"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${active ? "text-stone-950" : "text-stone-700"}`}>{ms.value}</p>
                    <p className="mt-1 text-xs text-stone-500">{ms.desc}</p>
                    {active && (
                      <div className="mt-2">
                        <Badge className="rounded-full border border-stone-300 bg-stone-950 text-xs text-white">Selected</Badge>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════ SECTION 4 · Acquisition & Qualification ══════════════ */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="space-y-5 p-6">
          <SectionHeader step={4} title="Acquisition & Qualification" subtitle="Qualify the opportunity with source tracking, scoring, and pipeline assignment" icon={Sparkles} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Lead Source" required>
              <div className="relative">
                <Megaphone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <select value={form.source} onChange={(e) => set("source", e.target.value)} className={`${selectClass} pl-10`}>
                  {SOURCES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </Field>
            <Field label="Campaign / Reference" hint="Campaign name, referral code, or event tag">
              <Input value={form.campaignReference} onChange={(e) => set("campaignReference", e.target.value)} placeholder="Q1-Meta-Lusail, REF-Ahmad..." className={inputClass} />
            </Field>
            <Field label="Pipeline Stage">
              <select value={form.stage} onChange={(e) => set("stage", e.target.value)} className={selectClass}>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          {/* Priority Score Cards */}
          <div>
            <p className="mb-3 text-sm font-medium text-stone-700">Priority Score</p>
            <div className="flex flex-wrap gap-2">
              {SCORES.map((s) => {
                const active = form.score === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("score", s)}
                    className={`flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "border-stone-900 bg-stone-950 text-white shadow-sm"
                        : `border-stone-200 ${scoreColors[s]} hover:border-stone-300`
                    }`}
                  >
                    {s === "Hot" && <Flame className="h-3.5 w-3.5" />}
                    {s === "Priority" && <Sparkles className="h-3.5 w-3.5" />}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Assigned Agent">
              <div className="relative">
                <UserCheck className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <select value={form.assignedAgentName} onChange={(e) => set("assignedAgentName", e.target.value)} className={`${selectClass} pl-10`}>
                  <option value="">Assign later</option>
                  {agents.filter((a) => a.isActive).map((a) => (
                    <option key={a.id} value={a.name}>{a.name} — {a.role}</option>
                  ))}
                </select>
              </div>
            </Field>
            <Field label="Next Follow-up" hint="Schedule the first touchpoint">
              <div className="relative">
                <CalendarClock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input type="datetime-local" value={form.nextFollowUp} onChange={(e) => set("nextFollowUp", e.target.value)} className={`${inputClass} pl-10`} />
              </div>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════ SECTION 5 · Internal Qualification Notes ══════════════ */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <SectionHeader step={5} title="Internal Qualification Notes" subtitle="Operational context, urgency, blockers, and next actions for the team" icon={FileText} />

          <div>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-1 focus:ring-stone-300"
              placeholder="Owner has 2 furnished units in Lusail and wants full Houseiana Assets Management including pricing, guest handling, reporting, and maintenance coordination. High urgency — wants to start within 2 weeks. No operational blockers. Previously managed independently. Referred by an existing Houseiana owner."
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Urgency", "Operational blockers", "Property readiness", "Commercial interest", "Next action", "Relationship context"].map((tag) => (
                <Badge key={tag} className="cursor-default rounded-full border border-stone-200 bg-stone-50 text-xs text-stone-500">{tag}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════ ACTION BAR ══════════════ */}
      <div className="sticky bottom-0 -mx-4 border-t border-stone-200/80 bg-white/90 px-4 py-4 backdrop-blur md:-mx-6 md:px-6 xl:-mx-8 xl:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-500">
            All fields are saved to the Houseiana CRM pipeline.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={savingDraft || saving}
              className="h-11 rounded-2xl border-stone-200 px-6 text-stone-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {savingDraft ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-11 rounded-2xl border-stone-200 px-6 text-stone-700"
            >
              <Clock className="mr-2 h-4 w-4" />
              Assign Later
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={saving || savingDraft}
              className="h-11 rounded-2xl bg-stone-950 px-8 text-white shadow-sm hover:bg-stone-800"
            >
              <Send className="mr-2 h-4 w-4" />
              {saving ? "Creating..." : "Create Houseiana Lead"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
