"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface LiveStats {
  projectsDelivered: number;
  industriesServed: number;
  ideasValidated: number;
  clientSatisfaction: number;
  ideasSubmitted: number;
  ideasApproved: number;
  productsLaunched: number;
  activeInnovators: number;
}

const defaultStats: LiveStats = {
  projectsDelivered: 500,
  industriesServed: 35,
  ideasValidated: 200,
  clientSatisfaction: 99.9,
  ideasSubmitted: 1200,
  ideasApproved: 340,
  productsLaunched: 85,
  activeInnovators: 500,
};

const StatsContext = createContext<LiveStats>(defaultStats);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<LiveStats>(defaultStats);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(defaultStats));

    const interval = setInterval(() => {
      fetch("/api/stats")
        .then((r) => r.json())
        .then(setStats)
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>;
}

export function useLiveStats() {
  return useContext(StatsContext);
}
