"use client";

import { useCallback, useEffect, useState } from "react";

export type EmployeeInvoiceRef = {
  id: string;
  number: string;
  status: string;
  total: number;
  docDate: string | null;
} | null;

export type EmployeeWorkflow = {
  id: string;
  projectNumber: string | null;
  type: string;
  title: string;
  summary: string;
  status: string;
  progress: number;
  hodBrief?: string | null;
  hodBudget?: number | null;
  hodStages?: unknown;
  financeNotes?: string | null;
  financeTotal?: number | null;
  financeStages?: unknown;
  financeDocId?: string | null;
  depositPaid?: boolean;
  depositPaidAt?: string | null;
  workStarted?: boolean;
  workStartedAt?: string | null;
  clientAgreed?: boolean;
  clientAgreedAt?: string | null;
  clientDeclined?: boolean;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: { firstName: string; lastName: string; email?: string };
  department?: { name: string; code: string } | null;
  invoice?: EmployeeInvoiceRef;
  receipt?: {
    id: string;
    number: string;
    status: string;
    total: number;
    docDate: string;
    paidAt: string | null;
    invoiceRef: string | null;
    paymentMethod: string | null;
  } | null;
};

export type EmployeeBillingInvoice = {
  id: string;
  number: string;
  status: string;
  total: number;
  docDate: string;
  workflowId: string;
  projectTitle: string;
  projectNumber: string | null;
  clientName: string | null;
};

export type EmployeeBillingReceipt = {
  id: string;
  number: string;
  total: number;
  docDate: string;
  paidAt: string | null;
  invoiceRef: string | null;
  paymentMethod: string | null;
  workflowId: string;
  projectTitle: string;
  projectNumber: string | null;
  clientName: string | null;
};

export type EmployeeDepositEvent = {
  workflowId: string;
  projectTitle: string;
  projectNumber: string | null;
  clientName: string | null;
  paidAt: string | null;
  invoiceNumber: string | null;
  receiptNumber: string | null;
  amount: number | null;
};

export type EmployeePortalData = {
  user: { firstName: string; lastName: string; role: string };
  profile?: {
    workId: string;
    position: string;
    isHod: boolean;
    department?: { name: string } | null;
  } | null;
  notifications: Array<{ id: string; title: string; message: string; createdAt: string }>;
  departmentWorkflows: EmployeeWorkflow[];
  completedWorkflows?: EmployeeWorkflow[];
  activeWorkflows?: EmployeeWorkflow[];
  executiveReviewQueue?: EmployeeWorkflow[];
  budgetQueue?: EmployeeWorkflow[];
  departments?: Array<{ id: string; name: string }>;
  invoices?: EmployeeBillingInvoice[];
  receipts?: EmployeeBillingReceipt[];
  depositEvents?: EmployeeDepositEvent[];
};

export function useEmployeePortalData() {
  const [data, setData] = useState<EmployeePortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return fetch("/api/me/employee-portal", { credentials: "include" })
      .then(async (r) => {
        const payload = await r.json();
        if (!r.ok) throw new Error(payload.error || "Unable to load employee portal");
        return payload as EmployeePortalData;
      })
      .then(setData)
      .catch((e: Error) => {
        setData(null);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

export function useEmployeeProject(projectId: string) {
  const [project, setProject] = useState<EmployeeWorkflow | null>(null);
  const [profile, setProfile] = useState<EmployeePortalData["profile"]>(null);
  const [user, setUser] = useState<EmployeePortalData["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return fetch(`/api/me/employee-portal?projectId=${encodeURIComponent(projectId)}`, {
      credentials: "include",
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Project not found");
        return r.json() as Promise<{
          project: EmployeeWorkflow;
          profile: EmployeePortalData["profile"];
          user: EmployeePortalData["user"];
        }>;
      })
      .then((json) => {
        setProject(json.project);
        setProfile(json.profile);
        setUser(json.user);
      })
      .catch((e: Error) => {
        setProject(null);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { project, profile, user, loading, error, refresh };
}

export async function employeeWorkflowAction(workflowId: string, body: Record<string, unknown>) {
  const res = await fetch("/api/me/employee-portal", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ workflowId, ...body }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Action failed");
  return json;
}

export function formatWorkflowStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

export function invoiceStatusLabel(status: string | undefined) {
  if (!status) return "not prepared";
  if (status === "draft") return "draft (finance)";
  if (status === "sent") return "sent to client";
  if (status === "paid") return "paid";
  return status;
}
