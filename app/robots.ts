import { MetadataRoute } from "next";

// 환경변수 변경 필요
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",          // 메인
          "/mbti/",     // MBTI 콘텐츠
          "/faq",       // FAQ (정보성 콘텐츠)
          "/terms",     // 약관
        ],
        disallow: [
          "/admin",     // 관리자
          "/chat",      // 개인 대화
          "/my",        // 마이페이지
          "/login",     // 로그인
          "/inquiry",   // 1:1 문의 (SEO 가치 낮음)
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
