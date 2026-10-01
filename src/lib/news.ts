import { Award, Megaphone, Newspaper, Trophy, type LucideIcon } from "lucide-react";

export const newsCategoryLabels: Record<string, string> = {
  announcement: "Announcement",
  award: "Award",
  press_release: "Press Release",
  achievement: "Achievement",
};

export const newsCategoryIcons: Record<string, LucideIcon> = {
  announcement: Megaphone,
  award: Award,
  press_release: Newspaper,
  achievement: Trophy,
};

export type NewsCategory = keyof typeof newsCategoryLabels;
