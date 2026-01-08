import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Smooth scroll to element by ID
 */
export function scrollToId(id: string): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Common CSS class patterns
 */
export const commonStyles = {
  pageGradient: "bg-gradient-to-b from-purple-50 to-pink-50",
  container: "max-w-6xl mx-auto px-4",
  section: "max-w-6xl mx-auto px-4 pt-20 pb-28",
} as const;