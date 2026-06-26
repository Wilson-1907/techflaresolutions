"use client";

import { useEffect } from "react";

export function useMpesaPaymentPoll(
  paymentId: string | null,
  onUpdate: (status: "completed" | "failed" | "pending", receipt?: string | null) => void
) {
  useEffect(() => {
    if (!paymentId) return;

    let active = true;
    let attempts = 0;

    async function poll() {
      while (active && attempts < 60) {
        attempts += 1;
        try {
          const res = await fetch(`/api/payments/mpesa/${paymentId}`);
          if (res.ok) {
            const data = await res.json();
            const status = data.payment?.status as string | undefined;
            if (status === "completed") {
              onUpdate("completed", data.payment?.mpesaReceiptNumber);
              return;
            }
            if (status === "failed") {
              onUpdate("failed", null);
              return;
            }
          }
        } catch {
          /* retry */
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    poll();
    return () => {
      active = false;
    };
  }, [paymentId, onUpdate]);
}
