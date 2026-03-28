"use client";

import { useEffect, useState } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Pencil,
  Trash2,
  X,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { teamApi, type CrmUser } from "@/lib/api";

const ROLES = ["Admin", "Sales Manager", "Sales Agent", "Business Development", "View Only"];

const roleBadgeStyle: Record<string, string> = {
  Admin: "bg-yellow-100 text-yellow-900 border-yellow-200",
  "Sales Manager": "bg-blue-100 text-blue-900 border-blue-200",
  "Sales Agent": "bg-stone-100 text-stone-800 border-stone-200",
  "Business Development": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "View Only": "bg-slate-100 text-slate-700 border-slate-200",
};

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
          <button onClick={onClose} className="rounded-xl p-1 hover:bg-stone-100">
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function TeamView() {
  const { canManageTeam } = useAuth();
  const [members, setMembers] = useState<CrmUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState<CrmUser | null>(null);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    try {
      const data = await teamApi.getAll();
      setMembers(data);
    } catch {
      // fallback to empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    try {
      await teamApi.delete(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleToggleActive = async (member: CrmUser) => {
    try {
      if (member.isActive) {
        await teamApi.deactivate(member.id);
      } else {
        await teamApi.update(member.id, { isActive: true });
      }
      fetchMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const activeCount = members.filter((m) => m.isActive).length;
  const adminCount = members.filter((m) => m.role === "Admin").length;

  if (!canManageTeam) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-stone-300" />
          <p className="text-lg font-semibold text-stone-950">Admin access required</p>
          <p className="mt-1 text-sm text-stone-500">
            Only administrators can manage team members.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
          <button onClick={() => setError("")} className="ml-2 font-semibold">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {[
          ["Total Members", String(members.length), Users],
          ["Active Members", String(activeCount), UserRoundCheck],
          ["Administrators", String(adminCount), ShieldCheck],
        ].map(([title, value, Icon]) => {
          const IconComp = Icon as React.ComponentType<{ className?: string }>;
          return (
            <Card key={title as string} className="rounded-3xl border-stone-200/80 shadow-sm">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-stone-500">{title as string}</p>
                  <p className="mt-2 text-3xl font-semibold text-stone-950">{value as string}</p>
                </div>
                <div className="rounded-2xl bg-yellow-50 p-3 ring-1 ring-yellow-100">
                  <IconComp className="h-5 w-5 text-stone-900" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg text-stone-950">Team members</CardTitle>
              <p className="mt-1 text-sm text-stone-500">
                Manage accounts, roles, and access permissions
              </p>
            </div>
            <Button
              className="rounded-2xl bg-stone-950 text-white hover:bg-stone-800"
              onClick={() => setShowAdd(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-stone-500">Loading team...</p>
          ) : members.length === 0 ? (
            <p className="py-8 text-center text-sm text-stone-500">No team members yet.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-stone-200">
              <div className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.6fr_0.8fr] gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                <div>Member</div>
                <div>Email</div>
                <div>Role</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              {members.map((member) => {
                const initials = member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2);
                return (
                  <div
                    key={member.id}
                    className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.6fr_0.8fr] items-center gap-3 border-b border-stone-200 px-4 py-4 text-sm last:border-b-0 hover:bg-stone-50/70"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-xl">
                        <AvatarFallback className="rounded-xl bg-stone-950 text-xs text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-stone-950">{member.name}</p>
                        <p className="text-xs text-stone-500">
                          Joined {new Date(member.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="truncate text-stone-700">{member.email}</div>
                    <div>
                      <Badge
                        className={`rounded-full border ${roleBadgeStyle[member.role] || roleBadgeStyle["View Only"]}`}
                      >
                        {member.role}
                      </Badge>
                    </div>
                    <div>
                      <Badge
                        className={`rounded-full border ${
                          member.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-stone-200 bg-stone-100 text-stone-500"
                        }`}
                      >
                        {member.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditMember(member)}
                        className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(member)}
                        className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                        title={member.isActive ? "Deactivate" : "Activate"}
                      >
                        {member.isActive ? (
                          <UserRoundX className="h-4 w-4" />
                        ) : (
                          <UserRoundCheck className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="rounded-xl p-2 text-stone-400 hover:bg-rose-100 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role descriptions */}
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-stone-950">Role permissions</CardTitle>
          <p className="text-sm text-stone-500">What each role can do in Houseiana CRM</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            ["Admin", "Full access. Create/edit/delete leads, tasks, team members. Manage settings."],
            ["Sales Manager", "Edit and delete leads/tasks. View reports. Cannot manage team."],
            ["Sales Agent", "Create and edit leads/tasks. View pipeline and communications."],
            ["Business Development", "Create and edit leads. Focus on outreach and partnerships."],
            ["View Only", "Read-only access. Cannot create, edit, or delete any data."],
          ].map(([role, desc]) => (
            <div key={role} className="flex items-start gap-3 rounded-2xl border border-stone-200 p-4">
              <Badge className={`mt-0.5 shrink-0 rounded-full border ${roleBadgeStyle[role]}`}>
                {role}
              </Badge>
              <p className="text-sm leading-6 text-stone-600">{desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add Member Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add team member">
        <AddMemberForm
          onSuccess={() => {
            setShowAdd(false);
            fetchMembers();
          }}
        />
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        open={!!editMember}
        onClose={() => setEditMember(null)}
        title={`Edit ${editMember?.name || "member"}`}
      >
        {editMember && (
          <EditMemberForm
            member={editMember}
            onSuccess={() => {
              setEditMember(null);
              fetchMembers();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function AddMemberForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Sales Agent" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await teamApi.create(form);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Full Name</label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="h-11 rounded-2xl border-stone-200"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="h-11 rounded-2xl border-stone-200"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Password</label>
        <Input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="h-11 rounded-2xl border-stone-200"
          required
          minLength={6}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="h-11 w-full rounded-2xl border border-stone-200 bg-white px-3 text-sm text-stone-900"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-2xl bg-stone-950 text-white hover:bg-stone-800"
      >
        {loading ? "Creating..." : "Create Member"}
      </Button>
    </form>
  );
}

function EditMemberForm({
  member,
  onSuccess,
}: {
  member: CrmUser;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: member.name,
    email: member.email,
    role: member.role,
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data: Record<string, string> = {
        name: form.name,
        email: form.email,
        role: form.role,
      };
      if (form.password) data.password = form.password;
      await teamApi.update(member.id, data);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Full Name</label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="h-11 rounded-2xl border-stone-200"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="h-11 rounded-2xl border-stone-200"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          New Password <span className="font-normal text-stone-400">(leave blank to keep current)</span>
        </label>
        <Input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="h-11 rounded-2xl border-stone-200"
          placeholder="Enter new password"
          minLength={6}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="h-11 w-full rounded-2xl border border-stone-200 bg-white px-3 text-sm text-stone-900"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-2xl bg-stone-950 text-white hover:bg-stone-800"
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
