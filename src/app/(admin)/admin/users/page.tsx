"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "viewer" | "contributor" | "editor" | "admin";
  createdAt: string;
  songCount: number;
}

const ROLE_FLOW: Array<User["role"]> = [
  "viewer",
  "contributor",
  "editor",
  "admin",
];

const ROLE_LABELS: Record<User["role"], string> = {
  viewer: "Viewer",
  contributor: "Contributor",
  editor: "Editor",
  admin: "Admin",
};

const ROLE_COLORS: Record<User["role"], string> = {
  viewer: "text-text-primary/50 border-text-primary/20",
  contributor: "text-blue-400 border-blue-400/40",
  editor: "text-amber-400 border-amber-400/40",
  admin: "text-red-400 border-red-400/40",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Confirmation dialog
  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  const [confirmNewRole, setConfirmNewRole] = useState<User["role"] | null>(
    null,
  );
  const [updating, setUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        if (res.status === 403) throw new Error("Access denied. Admins only.");
        throw new Error("Failed to load users");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers =
    roleFilter === "all"
      ? users
      : users.filter((u) => u.role === roleFilter);

  function getNextRole(
    current: User["role"],
    direction: "up" | "down",
  ): User["role"] | null {
    const idx = ROLE_FLOW.indexOf(current);
    if (direction === "up" && idx < ROLE_FLOW.length - 1) {
      return ROLE_FLOW[idx + 1];
    }
    if (direction === "down" && idx > 0) {
      return ROLE_FLOW[idx - 1];
    }
    return null;
  }

  function handlePromote(user: User) {
    const next = getNextRole(user.role, "up");
    if (!next) return;
    setConfirmUser(user);
    setConfirmNewRole(next);
  }

  function handleDemote(user: User) {
    const prev = getNextRole(user.role, "down");
    if (!prev) return;
    setConfirmUser(user);
    setConfirmNewRole(prev);
  }

  async function confirmRoleChange() {
    if (!confirmUser || !confirmNewRole) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: confirmUser._id,
          role: confirmNewRole,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === confirmUser._id ? { ...u, role: confirmNewRole! } : u,
        ),
      );
      setConfirmUser(null);
      setConfirmNewRole(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating role");
    } finally {
      setUpdating(false);
    }
  }

  function formatDate(dateStr: string) {
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  }

  // ─── Error state ───────────────────────────────────────────
  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-xl border border-red-accent/30 bg-red-accent/5 p-8 text-center">
          <p className="text-lg font-semibold text-red-accent">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={fetchUsers}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
        <p className="mt-1 text-sm text-text-primary/60">
          Manage user roles and permissions
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium text-text-primary/70">
          Filter by role:
        </label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className={[
            "rounded-lg border border-gold/20 bg-bg-mid px-3 py-2 text-sm",
            "text-text-primary focus:outline-2 focus:outline-gold",
          ].join(" ")}
        >
          <option value="all">All Roles</option>
          {ROLE_FLOW.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        <span className="text-xs text-text-primary/40">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Users table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="inline-block h-6 w-6 rounded-full border-2 border-gold border-r-transparent animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-xl border border-gold/10 bg-bg-mid/50 p-12 text-center">
          <p className="text-text-primary/50">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gold/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gold/10 bg-bg-mid/80">
                <th className="px-4 py-3 font-semibold text-text-primary/70">
                  Name
                </th>
                <th className="px-4 py-3 font-semibold text-text-primary/70">
                  Email
                </th>
                <th className="px-4 py-3 font-semibold text-text-primary/70">
                  Role
                </th>
                <th className="px-4 py-3 font-semibold text-text-primary/70">
                  Registered
                </th>
                <th className="px-4 py-3 font-semibold text-text-primary/70">
                  Songs
                </th>
                <th className="px-4 py-3 font-semibold text-text-primary/70">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr
                  key={user._id}
                  className={[
                    "border-b border-gold/5 transition-colors",
                    idx % 2 === 0 ? "bg-bg-deep" : "bg-bg-mid/30",
                    "hover:bg-gold/[0.02]",
                  ].join(" ")}
                >
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {user.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-text-primary/60">
                    {user.email || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-block rounded-md border px-2.5 py-0.5 text-xs font-medium",
                        ROLE_COLORS[user.role],
                      ].join(" ")}
                    >
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-primary/50">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-text-primary/60">
                    {user.songCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {/* Demote */}
                      {getNextRole(user.role, "down") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDemote(user)}
                        >
                          Demote
                        </Button>
                      )}
                      {/* Promote */}
                      {getNextRole(user.role, "up") && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePromote(user)}
                        >
                          Promote
                        </Button>
                      )}
                      {!getNextRole(user.role, "up") &&
                        !getNextRole(user.role, "down") && (
                          <span className="text-xs text-text-primary/30">
                            —
                          </span>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation modal */}
      <Modal
        open={!!confirmUser}
        onClose={() => {
          if (!updating) {
            setConfirmUser(null);
            setConfirmNewRole(null);
          }
        }}
        title="Confirm Role Change"
      >
        {confirmUser && confirmNewRole && (
          <div className="space-y-4">
            <p className="text-sm text-text-primary/80">
              Change{" "}
              <span className="font-semibold text-text-primary">
                {confirmUser.name || confirmUser.email}
              </span>
              {" from "}
              <span className="font-medium text-amber-400">
                {ROLE_LABELS[confirmUser.role]}
              </span>
              {" to "}
              <span className="font-medium text-amber-400">
                {ROLE_LABELS[confirmNewRole]}
              </span>
              ?
            </p>

            {confirmNewRole === "admin" && (
              <p className="rounded-lg bg-amber-400/10 p-3 text-xs text-amber-400">
                This user will gain full administrative access to the system.
              </p>
            )}

            {confirmUser.role === "admin" && confirmNewRole !== "admin" && (
              <p className="rounded-lg bg-red-accent/10 p-3 text-xs text-red-accent">
                This user will lose all administrative privileges.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setConfirmUser(null);
                  setConfirmNewRole(null);
                }}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                loading={updating}
                onClick={confirmRoleChange}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
