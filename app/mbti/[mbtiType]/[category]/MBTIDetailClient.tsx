"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, Lightbulb, MessageCircle, TrendingUp } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { categoryInfo, type CategoryKey } from "@/app/mbti/_content/categoryInfo";
import { mbtiDescriptions } from "@/app/mbti/_content/mbtiMeta";
import { cognitiveFunctions } from "@/app/mbti/_content/cognitiveFunctions";
import { cognitiveGlossary } from "@/app/mbti/_content/cognitiveGlossary";
import { buildFaqs, buildFaqJsonLd } from "@/app/mbti/_content/mbtiFaq";

import {
  getMbtiCategorySections,
  type SectionIconKey,
} from "@/app/mbti/_content/mbtiCategorySections";

// ✅ 이벤트 훅 포인트 (GTM/GA 붙일 때 여기만 바꾸면 됨)
function track(event: string, payload?: Record<string, unknown>) {
  console.log("[track]", event, payload ?? {});
}

const ICON_MAP: Record<SectionIconKey, React.ComponentType<{ className?: string }>> = {
  Heart,
  MessageCircle,
  Lightbulb,
  TrendingUp,
};

export default function MBTIDetailClient() {
  const params = useParams<{ mbtiType: string; category: string }>();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const mbtiType = (params?.mbtiType ?? "").toString();
  const categoryRaw = (params?.category ?? "dating").toString();

  const mbtiUpperCase = mbtiType.toUpperCase();
  const category = (["marriage", "dating", "crush"].includes(categoryRaw) ? categoryRaw : "dating") as CategoryKey;

  const currentCategory = categoryInfo[category];
  const currentMBTI =
    mbtiDescriptions[mbtiUpperCase] || { name: "MBTI 유형", traits: [], oneLiner: "" };

  // ✅ 카테고리별 + MBTI별 섹션
  const sections = getMbtiCategorySections(mbtiUpperCase, category);
  const otherCategories = (Object.keys(categoryInfo) as CategoryKey[]).filter((k) => k !== category);

  // ✅ FAQ 계산 (가변 질문)
  const faqs = buildFaqs({
    mbtiUpperCase,
    category,
    categoryTitle: currentCategory.title,
    sections,
  });

  // ✅ FAQPage JSON-LD
  const faqJsonLd = buildFaqJsonLd(faqs);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* ✅ SEO: FAQPage JSON-LD */}
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      )}

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* back */}
          <button
            type="button"
            onClick={() => {
              track("mbti_back_to_home", { mbtiType: mbtiUpperCase, category });
              router.push("/");
            }}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            홈으로 돌아가기
          </button>

          {/* Hero */}
          <div className={`bg-gradient-to-br ${currentCategory.bg} rounded-3xl p-8 md:p-12 mb-12`}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl mb-4">{currentCategory.emoji}</div>

              <h1 className="mb-3 text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                {mbtiUpperCase} × {currentCategory.title}
              </h1>

              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-2">
                {currentMBTI.name}
                {currentMBTI.oneLiner ? ` · ${currentMBTI.oneLiner}` : ""}{" "}
                <span className="text-gray-500 dark:text-gray-400">({currentCategory.title} 가이드)</span>
              </p>

              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6">
                MBTI 기반으로 {currentCategory.title}에서 자주 나타나는 흐름을 간단히 정리했어요.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {currentMBTI.traits.map((trait: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/90 dark:bg-white/10 rounded-full text-gray-800 dark:text-gray-100 shadow-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 mb-12">
              <h2 className="mb-3 text-white text-2xl font-bold">
                {mbtiUpperCase}의 {currentCategory.title} 흐름을 한 번에 정리해요
              </h2>
              <p className="text-purple-100 leading-relaxed">
                {mbtiUpperCase}의 대표 키워드({currentMBTI.traits.join(", ")})를 기준으로{" "}
                {currentCategory.title}에서 자주 생기는 패턴과 도움이 되는 방향을 정리했어요.
              </p>
            </div>

            {/* ✅ 섹션 카드 */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {sections.map((section, index) => {
                const Icon = ICON_MAP[section.icon];
                return (
                  <button
                    key={index}
                    type="button"
                    className="text-left bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    onClick={() =>
                      track("mbti_section_click", {
                        mbtiType: mbtiUpperCase,
                        category,
                        section: section.title,
                      })
                    }
                    aria-label={`${section.title} 섹션 보기`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${currentCategory.color} text-white mb-4`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{section.content}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other Categories */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-center mb-8 text-lg font-bold text-gray-900 dark:text-gray-100">
              {mbtiUpperCase}의 다른 관계 가이드도 확인해보세요
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {otherCategories.map((key) => {
                const info = categoryInfo[key];
                return (
                  <Link
                    key={key}
                    href={`/mbti/${mbtiType}/${key}`}
                    onClick={() =>
                      track("mbti_other_category_click", {
                        mbtiType: mbtiUpperCase,
                        from: category,
                        to: key,
                      })
                    }
                    className={`block p-8 rounded-2xl bg-gradient-to-br ${info.bg} hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-center`}
                  >
                    <div className="text-4xl mb-3">{info.emoji}</div>
                    <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">{info.title}</h4>
                    <p className="text-gray-700 dark:text-gray-200">
                      {mbtiUpperCase}의 {info.title} 가이드 보기
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* SEO Content (FAQ Accordion + JSON-LD) */}
          {faqs.length > 0 && (
            <div className="max-w-4xl mx-auto mt-12">
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {mbtiUpperCase} {currentCategory.title} - 자주 묻는 질문
                </h2>

                <div className="mt-6 space-y-3">
                  {faqs.map((f, idx) => (
                    <details
                      key={idx}
                      className="group bg-white dark:bg-neutral-950 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4"
                    >
                      <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                          {f.q}
                        </h3>
                        <span className="mt-1 text-gray-400 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>

                      <div className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">{f.a}</div>
                    </details>
                  ))}
                </div>

                <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                  ※ MBTI 성향 기반 참고용 요약이며, 개인차가 있을 수 있어요.
                </p>
              </div>
            </div>
          )}

          {/* Cognitive Functions (Optional / Advanced) */}
          {cognitiveFunctions[mbtiUpperCase] && (
            <div className="max-w-4xl mx-auto mt-12">
              <details className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    심화 · {mbtiUpperCase}의 인지 기능으로 보는 관계 패턴
                  </h2>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>

                <div className="mt-6 space-y-6 text-gray-700 dark:text-gray-200">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ※ 아래 내용은 성향을 이해하기 위한 참고용 설명이에요.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">주기능 · 보조기능</h4>
                      <p className="mt-2 text-sm">
                        {cognitiveFunctions[mbtiUpperCase].dominant},{" "}
                        {cognitiveFunctions[mbtiUpperCase].auxiliary}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold">3차 · 열등기능</h4>
                      <p className="mt-2 text-sm">
                        {cognitiveFunctions[mbtiUpperCase].tertiary},{" "}
                        {cognitiveFunctions[mbtiUpperCase].inferior}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 space-y-4">
                    <p>
                      <strong>관계에서의 강점</strong>
                      <br />
                      {cognitiveFunctions[mbtiUpperCase].summary.strength}
                    </p>

                    <p>
                      <strong>흔히 생기는 오해</strong>
                      <br />
                      {cognitiveFunctions[mbtiUpperCase].summary.risk}
                    </p>

                    <p>
                      <strong>관계를 위한 작은 팁</strong>
                      <br />
                      {cognitiveFunctions[mbtiUpperCase].summary.tip}
                    </p>
                  </div>

                  {/* ℹ️ 인지 기능 안내 박스 */}
                  <div className="rounded-xl border border-purple-100/70 dark:border-purple-300/20 bg-purple-50 dark:bg-purple-500/10 p-4 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5">ℹ️</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">인지 기능이란?</p>
                        <p className="mt-1 text-gray-600 dark:text-gray-300 leading-relaxed">
                          MBTI를 더 깊이 이해하기 위한 참고 설명이에요.
                          <br />
                          연애/관계에서 자주 나타나는 생각과 감정 패턴을 이해하는 데 도움을 줘요.
                        </p>

                        <details className="mt-3">
                          <summary className="cursor-pointer select-none text-purple-700 dark:text-purple-200 font-medium hover:underline">
                            용어를 쉽게 보기
                          </summary>

                          <div className="mt-3 grid gap-3 md:grid-cols-2 text-gray-600 dark:text-gray-300">
                            {cognitiveGlossary.items.map((g) => (
                              <div
                                key={g.key}
                                className="rounded-lg bg-white dark:bg-neutral-950 p-3 border border-purple-100/70 dark:border-white/10"
                              >
                                <p className="font-semibold text-gray-900 dark:text-gray-100">{g.title}</p>
                                <p className="mt-1 text-sm">{g.desc}</p>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
