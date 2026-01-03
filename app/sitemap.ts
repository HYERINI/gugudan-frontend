import { MetadataRoute } from "next";

// 환경변수 변경 필요
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const MBTI_TYPES = [
  "intj","intp","entj","entp",
  "infj","infp","enfj","enfp",
  "istj","isfj","estj","esfj",
  "istp","isfp","estp","esfp",
] as const;

const CATEGORIES = ["dating", "marriage", "crush"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const mbtiPages: MetadataRoute.Sitemap = MBTI_TYPES.flatMap((mbti) =>
    CATEGORIES.map((category) => ({
      url: `${BASE_URL}/mbti/${mbti}/${category}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }))
  );

  return [...staticPages, ...mbtiPages];
}
