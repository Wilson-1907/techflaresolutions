"use client";

import { useState } from "react";
import { PortalHeader } from "./PortalHeader";
import { PortalSidebar } from "./PortalSidebar";

export function PortalShell({
  type,
  children,
}: {
  type: "client" | "innovation" | "employee";
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader
        type={type}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((v) => !v)}
      />
      <div className="flex pt-14 lg:pt-14">
        <PortalSidebar
          type={type}
          open={menuOpen}
          onNavigate={() => setMenuOpen(false)}
        />
        <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
