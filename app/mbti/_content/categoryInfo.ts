export type CategoryKey = "marriage" | "dating" | "crush";

export const categoryInfo: Record<
  CategoryKey,
  { title: string; emoji: string; color: string; bg: string }
> = {
  marriage: {
    title: "결혼",
    emoji: "💍",
    color: "from-pink-500 to-pink-600",
    bg: "from-pink-50 to-pink-100",
  },
  dating: {
    title: "연애",
    emoji: "💕",
    color: "from-purple-500 to-purple-600",
    bg: "from-purple-50 to-purple-100",
  },
  crush: {
    title: "썸",
    emoji: "💫",
    color: "from-amber-500 to-amber-600",
    bg: "from-amber-50 to-amber-100",
  },
};
