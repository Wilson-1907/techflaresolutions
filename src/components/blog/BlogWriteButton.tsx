"use client";

import { useEffect, useState } from "react";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiUrl } from "@/lib/api-base";

export function BlogWriteButton({ variant = "primary" as "primary" | "outline", size = "sm" as "sm" | "md" | "lg" }) {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(apiUrl("/api/auth/me"), { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.authenticated))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) return null;
  if (!authed) {
    return (
      <Button href="/login?redirect=/blog/write" variant={variant} size={size}>
        <PenLine className="h-4 w-4" /> Sign In to Write
      </Button>
    );
  }

  return (
    <Button href="/blog/write" variant={variant} size={size}>
      <PenLine className="h-4 w-4" /> Write a Post
    </Button>
  );
}
