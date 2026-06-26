"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api-base";

export type PortalData = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    company?: string | null;
    points: number;
    communityMember: boolean;
  };
  stats: {
    activeProjects: number;
    pendingInvoices: number;
    unreadNotifications: number;
    points: number;
    totalOrders: number;
    totalSolutions: number;
    totalIdeas: number;
    avgRatingGiven: number | null;
    blogsPending: number;
    blogsPublished: number;
  };
  projects: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    description?: string | null;
    milestones: Array<{ title: string; completed: boolean; dueDate?: string | null; description?: string | null }>;
  }>;
  orders: Array<{
    id: string;
    productTitle: string;
    plan: string;
    status: string;
    createdAt: string;
  }>;
  solutions: Array<{
    id: string;
    problem: string;
    status: string;
    industry: string;
    createdAt: string;
  }>;
  invoices: Array<{
    id: string;
    number: string;
    amount: number;
    currency: string;
    status: string;
    dueDate?: string | null;
    projectName: string;
    source?: string;
    issuerName?: string;
    issuerTitle?: string;
    paymentMethod?: string | null;
    notes?: string | null;
    signed?: boolean;
    workflowId?: string | null;
  }>;
  receipts?: Array<{
    id: string;
    number: string;
    amount: number;
    currency: string;
    invoiceRef?: string | null;
    paidAt?: string | null;
    paymentMethod?: string | null;
    issuerName?: string;
    issuerTitle?: string;
    signed?: boolean;
  }>;
  tickets: Array<{
    id: string;
    subject: string;
    message: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    phone: string;
    description: string;
    accountReference: string;
    referenceType: string;
    status: string;
    mpesaReceiptNumber: string | null;
    createdAt: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    projectName: string;
    createdAt: string;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
  ratings: Array<{
    id: string;
    targetType: string;
    targetRef: string;
    targetTitle: string;
    rating: number;
    comment?: string | null;
  }>;
  blogs: Array<{
    id: string;
    title: string;
    status: string;
    slug: string;
    createdAt: string;
  }>;
  ideas: Array<{
    id: string;
    title: string;
    status: string;
    category: string;
    createdAt: string;
  }>;
  workflows?: Array<{
    id: string;
    type?: string;
    sourceId?: string;
    status?: string;
    projectNumber: string | null;
    title: string;
    summary: string;
    progress: number;
    hodBrief?: string | null;
    financeTotal?: number | null;
    financeDocId?: string | null;
    depositPercent?: number | null;
    clientAgreed?: boolean;
    clientDeclined?: boolean;
    depositPaid?: boolean;
    workStarted?: boolean;
    workStartedAt?: string | null;
    financeStages?: unknown;
    createdAt: string;
    updatedAt: string;
    department?: { name: string } | null;
  }>;
  recentActivity: Array<{ text: string; date: string; type: string }>;
};

export function usePortalData() {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl("/api/me/portal"), { credentials: "include" })
      .then(async (r) => {
        const payload = await r.json().catch(() => ({}));
        if (!r.ok) {
          const msg =
            typeof payload.error === "string"
              ? payload.error
              : r.status === 401
                ? "Session expired — sign in again."
                : r.status === 503
                  ? "Portal service unavailable. The backend may be waking up — refresh in a moment."
                  : "Failed to load portal";
          throw new Error(msg);
        }
        return payload;
      })
      .then((payload) =>
        setData({
          ...payload,
          payments: payload.payments ?? [],
          receipts: payload.receipts ?? [],
          workflows: payload.workflows ?? [],
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, refresh: () => {
    setLoading(true);
    fetch(apiUrl("/api/me/portal"), { credentials: "include" })
      .then((r) => r.json().catch(() => ({})))
      .then((payload) =>
        setData({
          ...payload,
          payments: payload.payments ?? [],
          receipts: payload.receipts ?? [],
          workflows: payload.workflows ?? [],
        })
      )
      .finally(() => setLoading(false));
  }};
}

export function formatPortalDate(value: string) {
  return new Date(value).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function statusBadge(status: string) {
  const colors: Record<string, string> = {
    pending: "text-yellow-400",
    APPROVED: "text-life-green",
    PENDING: "text-yellow-400",
    REJECTED: "text-red-400",
    IN_PROGRESS: "text-gold",
    COMPLETED: "text-life-green",
    open: "text-gold",
    paid: "text-life-green",
  };
  return colors[status] || "text-muted-foreground";
}
