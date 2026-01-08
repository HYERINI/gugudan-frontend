// app/mbti/[mbtiType]/[category]/faq/[topic]/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

import { categoryInfo, type CategoryKey } from "@/app/mbti/_content/categoryInfo";
import { mbtiDescriptions } from "@/app/mbti/_content/mbtiMeta";
import { buildFaqJsonLd } from "@/app/mbti/_content/mbtiFaq";
import { safeTopicKey, getTopicDef } from "@/app/mbti/_content/faqTopics";
import { getFaqsByMbtiCategoryTopic } from "@/app/mbti/_content/faqDatabase";

type Params = { mbtiType: string; category: string; topic: string };

const VALID_CATEGORIES: CategoryKey[] = ["marriage", "dating", "crush"];
const VALID_MBTI = new Set(Object.keys(mbtiDescriptions));

function safeCategory(raw: string): CategoryKey {
  return VALID_CATEGORIES.includes(raw as CategoryKey) ? (raw as CategoryKey) : "dating";
}

function safeMbtiUpper(raw: string): string {
  const up = (raw ?? "").toString().toUpperCase();
  return VALID_MBTI.has(up) ? up : "MBTI";
}

function safeMbtiSlug(raw: string): string {
  return (raw ?? "").toString().toLowerCase();
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { mbtiType, category: categoryRaw, topic: topicRaw } = await params;

  const mbtiUpper = safeMbtiUpper(mbtiType);
  const mbtiSlug = safeMbtiSlug(mbtiType);
  const category = safeCategory(categoryRaw);

  const categoryTitle = categoryInfo[category]?.title ?? "연애";
  const topicKey = safeTopicKey(topicRaw);
  const topic = getTopicDef(topicKey);

  const title = `${mbtiUpper} ${categoryTitle} FAQ - ${topic.title}`;
  const description = `${mbtiUpper} ${categoryTitle}에서 자주 나오는 질문(${topic.title})을 정리했어요.`;

  const canonical = `/mbti/${mbtiSlug}/${category}/faq/${topicKey}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description },
  };
}

export default async function MbtiFaqTopicPage(
  { params }: { params: Promise<Params> }
) {
  const { mbtiType, category: categoryRaw, topic: topicRaw } = await params;

  const mbtiUpper = safeMbtiUpper(mbtiType);
  const mbtiSlug = safeMbtiSlug(mbtiType);
  const category = safeCategory(categoryRaw);

  const topicKey = safeTopicKey(topicRaw);
  const topic = getTopicDef(topicKey);

  const basePath = `/mbti/${mbtiSlug}/${category}`;
  const currentCategory = categoryInfo[category];

  const currentMBTI =
    mbtiDescriptions[mbtiUpper] || { name: "MBTI 유형", traits: [], oneLiner: "" };

  const faqs = getFaqsByMbtiCategoryTopic(mbtiUpper, category, topicKey);
  const finalFaqs = faqs.map(f => ({ q: f.q, a: f.a }));
  const faqJsonLd = buildFaqJsonLd(finalFaqs);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {finalFaqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      )}

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back */}
          <div className="mb-8 flex flex-wrap gap-3 items-center">
            <Link
              href={`${basePath}/faq`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:text-purple-600 hover:bg-purple-50 shadow-sm hover:shadow-md transition-all border border-gray-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              주제 선택으로
            </Link>

            <span className="text-gray-300 dark:text-gray-700">/</span>

            <Link
              href={basePath}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:text-purple-600 hover:bg-purple-50 shadow-sm hover:shadow-md transition-all border border-gray-200"
            >
              {mbtiUpper} × {currentCategory.title} 가이드로
            </Link>
          </div>

          {/* Header - 밝은 배경 → 검은 텍스트 */}
          <div className={`bg-gradient-to-br ${currentCategory.bg} rounded-3xl p-8 md:p-10 mb-8`}>
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">
              {mbtiUpper} × {currentCategory.title} FAQ
            </h1>

            <p className="mt-2 text-gray-800">
              주제: <span className="font-semibold">{topic.title}</span>
            </p>

            <p className="mt-2 text-sm text-gray-700">
              {currentMBTI.name}
              {currentMBTI.oneLiner ? ` · ${currentMBTI.oneLiner}` : ""}
            </p>

            {finalFaqs.length === 0 && (
              <p className="mt-3 text-xs text-gray-700">
                * 이 주제에 해당하는 질문이 아직 충분치 않아, 전체 FAQ를 보여드려요.
              </p>
            )}
          </div>

          {/* FAQ list */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900">
              질문 목록
            </h2>

            <div className="mt-6 space-y-3">
              {finalFaqs.map((f, idx) => (
                <details
                  key={idx}
                  className="group bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-gray-900 leading-relaxed">
                      {f.q}
                    </h3>
                    <span className="mt-1 text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>

                  <div className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>

            <p className="mt-6 text-xs text-gray-500">
              ※ MBTI 성향 기반 참고용 요약이며, 개인차가 있을 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}