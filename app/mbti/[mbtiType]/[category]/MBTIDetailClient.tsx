"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, Lightbulb, MessageCircle, TrendingUp } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { categoryInfo, type CategoryKey } from "@/app/mbti/_content/categoryInfo";
import { mbtiDescriptions } from "@/app/mbti/_content/mbtiMeta";
import { cognitiveFunctions } from "@/app/mbti/_content/cognitiveFunctions";
import { buildFaqs, buildFaqJsonLd } from "@/app/mbti/_content/mbtiFaq";
import { getTopicsByCategory } from "@/app/mbti/_content/faqTopics";

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

function safeCategory(raw: string): CategoryKey {
  return (["marriage", "dating", "crush"].includes(raw) ? raw : "dating") as CategoryKey;
}

export default function MBTIDetailClient() {
  const params = useParams<{ mbtiType?: string; category?: string }>();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
// 컴포넌트 내부 상단
const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

// 카테고리별 예시 데이터 함수
function getCategoryExamples(category: string) {
  const examples = {
    thinking: [
      {
        key: "Ti",
        icon: "🤔",
        type: "논리 분석",
        reaction: "왜 헤어졌어? 원인이 뭐였어?",
        explanation: "내 머릿속 논리로 상황을 분석하려고 해요",
        borderColor: "border-purple-400 ",
        bgGradient: "from-purple-50/50 to-transparent",
        badgeStyle: "bg-purple-100 text-purple-700"
      },
      {
        key: "Te",
        icon: "📊",
        type: "해결책 제시",
        reaction: "그래서 이제 어떻게 할 거야?",
        explanation: "실질적인 다음 행동에 집중해요",
        borderColor: "border-blue-400",
        bgGradient: "from-blue-50/50 to-transparent ",
        badgeStyle: "bg-blue-100 text-blue-700"
      }
    ],
    feeling: [
      {
        key: "Fi",
        icon: "💭",
        type: "내 경험 공감",
        reaction: "너 진짜 힘들겠다... 나도 그랬었어",
        explanation: "내 감정과 경험을 기반으로 공감해요",
        borderColor: "border-pink-400",
        bgGradient: "from-pink-50/50 to-transparent",
        badgeStyle: "bg-pink-100 text-pink-700 "
      },
      {
        key: "Fe",
        icon: "🤗",
        type: "즉각 위로",
        reaction: "괜찮아? 울어도 돼, 내가 옆에 있을게",
        explanation: "상대의 감정에 즉시 반응하고 위로해요",
        borderColor: "border-rose-400 ",
        bgGradient: "from-rose-50/50 to-transparent",
        badgeStyle: "bg-rose-100 text-rose-700"
      }
    ],
    intuition: [
      {
        key: "Ni",
        icon: "🔮",
        type: "의미 찾기",
        reaction: "이번 일로 네가 뭘 깨달았을까?",
        explanation: "경험의 깊은 의미와 통찰을 찾아요",
        borderColor: "border-indigo-400",
        bgGradient: "from-indigo-50/50 to-transparent",
        badgeStyle: "bg-indigo-100 text-indigo-700"
      },
      {
        key: "Ne",
        icon: "🌈",
        type: "가능성 제시",
        reaction: "혼자 여행도 가보고, 새로운 사람도 만나고!",
        explanation: "다양한 가능성과 새로운 방향을 제시해요",
        borderColor: "border-sky-400",
        bgGradient: "from-sky-50/50 to-transparent",
        badgeStyle: "bg-sky-100 text-sky-700"
      }
    ],
    sensing: [
      {
        key: "Si",
        icon: "📚",
        type: "과거 회상",
        reaction: "너희 처음 만났을 때 얼마나 좋아했는데...",
        explanation: "과거의 구체적인 기억을 떠올려요",
        borderColor: "border-amber-400 ",
        bgGradient: "from-amber-50/50 to-transparent",
        badgeStyle: "bg-amber-100 text-amber-700"
      },
      {
        key: "Se",
        icon: "⚡",
        type: "즉시 행동",
        reaction: "오늘 저녁이나 먹으러 가자, 맛있는 거 먹으면서 풀어",
        explanation: "지금 당장 할 수 있는 행동에 집중해요",
        borderColor: "border-red-400",
        bgGradient: "from-red-50/50 to-transparent ",
        badgeStyle: "bg-red-100 text-red-700 "
      }
    ]
  };

  return examples[category as keyof typeof examples] || [];
}
  // ✅ params는 "가끔" 첫 렌더에 비어있을 수 있어서 안전 처리
  const mbtiType = (params?.mbtiType ?? "").toString();
  const categoryRaw = (params?.category ?? "dating").toString();

  // ✅ mbtiType이 비면 화면을 억지로 그리지 말고 안전하게 리턴
  if (!mbtiType) {
    return (
      <div className="bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="rounded-2xl border border-gray-200  p-6 text-gray-600">
              페이지 정보를 불러오는 중...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mbtiUpperCase = mbtiType.toUpperCase();
  const category = safeCategory(categoryRaw);

  const currentCategory = categoryInfo[category];
  const currentMBTI = mbtiDescriptions[mbtiUpperCase] || {
    name: "MBTI 유형",
    traits: [],
    oneLiner: "",
  };

  const basePath = useMemo(() => `/mbti/${mbtiType}/${category}`, [mbtiType, category]);
  const faqIndexPath = useMemo(() => `${basePath}/faq`, [basePath]);

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

  const handleBack = () => {
    track("mbti_back", { mbtiType: mbtiUpperCase, category });

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* ✅ SEO: FAQPage JSON-LD */}
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      )}

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero */}
          <div className={`bg-gradient-to-br ${currentCategory.bg} rounded-3xl p-8 md:p-12 mb-12`}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl mb-4">{currentCategory.emoji}</div>

              <h1 className="mb-3 text-3xl md:text-5xl font-extrabold text-gray-900">
                {mbtiUpperCase} × {currentCategory.title}
              </h1>

              <p className="text-lg md:text-xl text-gray-800 mb-2">
                {currentMBTI.name}
                {currentMBTI.oneLiner ? ` · ${currentMBTI.oneLiner}` : ""}{" "}
                <span className="text-gray-700">({currentCategory.title} 가이드)</span>
              </p>

              <p className="text-sm md:text-base text-gray-700 mb-6">
                MBTI 기반으로 {currentCategory.title}에서 자주 나타나는 흐름을 간단히 정리했어요.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {currentMBTI.traits.map((trait: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/90 rounded-full text-gray-900 shadow-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 가상 대화 진입 배너*/}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="group relative p-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-lg transition-all hover:shadow-purple-500/20">
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-white  rounded-[15px]">                 
                <div className="flex items-center gap-5">
                  <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform duration-500">
                    <MessageCircle className="w-7 h-7" />
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                      실전 대화가 걱정된다면?
                      <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-purple-100 text-purple-700 rounded-md">AI 연습모드</span>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                      {mbtiUpperCase} 상대와 {currentCategory.title} 상황 시뮬레이션을 시작해보세요.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    track("start_simulation_chat", { mbtiType: mbtiUpperCase, category });
                    router.push(`/chat?mbti=${mbtiUpperCase}&topic=${category}&mode=simulation`);
                  }}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl active:scale-95 shrink-0"
                >
                  가상 대화 시작하기
                </button>
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
                    className="text-left bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                    <h3 className="mb-3 text-lg font-bold text-gray-900">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{section.content}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other Categories */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-center mb-8 text-lg font-bold text-gray-900">
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
                    <h4 className="mb-2 text-lg font-bold text-gray-900">{info.title}</h4>
                    <p className="text-gray-800">
                      {mbtiUpperCase}의 {info.title} 가이드 보기
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* FAQ Preview */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {mbtiUpperCase} {currentCategory.title} - 자주 묻는 질문
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    토픽을 눌러서 바로 확인해보세요.
                  </p>
                </div>

                <Link
                  href={`/mbti/${mbtiType}/${category}/faq`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:from-purple-700 hover:to-pink-700 hover:gap-3 transition-all shadow-md hover:shadow-lg shrink-0"
                  onClick={() => track("mbti_faq_all_click", { mbtiType: mbtiUpperCase, category })}
                >
                  전체 FAQ 보기
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* ✅ 카테고리별 토픽 칩 */}
              <div className="mt-5 flex flex-wrap gap-2">
                {getTopicsByCategory(category).map((t) => (
                  <Link
                    key={t.key}
                    href={`/mbti/${mbtiType}/${category}/faq/${t.key}`}
                    className="px-3 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-800 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 hover:shadow-md transition-all"
                    onClick={() =>
                      track("mbti_faq_topic_click", { mbtiType: mbtiUpperCase, category, topic: t.key })
                    }
                    aria-label={`${t.title} FAQ 보기`}
                  >
                    {t.title}
                  </Link>
                ))}
              </div>
              
              <p className="mt-6 text-xs text-gray-500">
                ※ MBTI 성향 기반 참고용 요약이며, 개인차가 있을 수 있어요.
              </p>
            </div>
          </div>

          {/* Cognitive Functions (Optional / Advanced) */}
          {cognitiveFunctions[mbtiUpperCase] && (
            <div className="max-w-4xl mx-auto mt-12">
              <details className="group bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <summary className="cursor-pointer list-none flex items-center justify-between p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      💡
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 ">
                        심화 · {mbtiUpperCase}의 인지 기능으로 보는 관계 패턴
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        아래 내용은 성향을 이해하기 위한 참고용 설명이에요
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>

                <div className="p-8 pt-0 space-y-6">
                  {/* 주기능·보조기능 vs 3차·열등기능 */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 ">
                      <h4 className="font-bold text-purple-900 mb-2">
                        주기능 · 보조기능
                      </h4>
                      <p className="text-sm text-gray-700">
                        {cognitiveFunctions[mbtiUpperCase].dominant},{" "}
                        {cognitiveFunctions[mbtiUpperCase].auxiliary}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-2">
                        3차 · 열등기능
                      </h4>
                      <p className="text-sm text-gray-700">
                        {cognitiveFunctions[mbtiUpperCase].tertiary},{" "}
                        {cognitiveFunctions[mbtiUpperCase].inferior}
                      </p>
                    </div>
                  </div>

                  {/* 관계 패턴 3가지 */}
                  <details className="group/pattern bg-white rounded-xl border border-gray-200">
                    <summary className="cursor-pointer list-none p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">💡</span>
                          <h4 className="font-bold text-gray-900 ">
                            관계 패턴 더 알아보기
                          </h4>
                        </div>
                        <span className="text-gray-400 group-open/pattern:rotate-180 transition-transform">
                          ▼
                        </span>
                      </div>
                    </summary>

                    <div className="p-5 pt-0 space-y-4">
                      <div className="bg-white rounded-xl p-6 border border-gray-200 ">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">✨</span>
                          <div>
                            <h4 className="font-bold text-gray-900  mb-2">
                              관계에서의 강점
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                              {cognitiveFunctions[mbtiUpperCase].summary.strength}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 ">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">🔍</span>
                          <div>
                            <h4 className="font-bold text-gray-900  mb-2">
                              흔히 생기는 오해
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                              {cognitiveFunctions[mbtiUpperCase].summary.risk}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">💚</span>
                          <div>
                            <h4 className="font-bold text-green-900">
                              관계를 위한 작은 팁
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                              {cognitiveFunctions[mbtiUpperCase].summary.tip}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>

                  {/* ℹ️ 인지 기능 안내 박스 - 전체 접기/펼치기 */}
                  <details className="group/cognitive rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 overflow-hidden">
                    <summary className="cursor-pointer list-none p-5 hover:bg-purple-100/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">ℹ️</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-purple-900">
                              인지 기능이란?
                            </p>
                            <span className="text-purple-400 group-open/cognitive:rotate-180 transition-transform ml-2">
                              ▼
                            </span>
                          </div>
                          <p className="text-sm text-purple-700 mt-1 leading-relaxed">
                            MBTI를 더 깊이 이해하기 위한 참고 설명이에요.
                            연애/관계에서 자주 나타나는 생각과 감정 패턴을 이해하는 데 도움을 줘요.
                          </p>
                        </div>
                      </div>
                    </summary>

                    <div className="p-5 pt-0 space-y-5">
                      {/* 카테고리 선택 버튼 */}
                      <div>
                        <h4 className="font-bold text-purple-900 mb-3 text-center">
                          👇 궁금한 타입을 눌러보세요
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: "thinking", label: "사고", icon: "💭", hint: "Ti vs Te", color: "purple" },
                            { key: "feeling", label: "감정", icon: "❤️", hint: "Fi vs Fe", color: "pink" },
                            { key: "intuition", label: "직관", icon: "✨", hint: "Ni vs Ne", color: "blue" },
                            { key: "sensing", label: "감각", icon: "👀", hint: "Si vs Se", color: "green" },
                          ].map((cat) => (
                            <button
                              key={cat.key}
                              onClick={() => setSelectedCategory(cat.key)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                selectedCategory === cat.key
                                  ? "bg-purple-100 border-purple-400"
                                  : "bg-white  border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1.5">
                                  <span className="text-xl">{cat.icon}</span>
                                  <p className={`text-base font-bold ${
                                    selectedCategory === cat.key
                                      ? "text-purple-700"
                                      : "text-gray-700"
                                  }`}>
                                    {cat.label}
                                  </p>
                                </div>
                                <p className={`text-xs ${
                                  selectedCategory === cat.key
                                    ? "text-purple-600"
                                    : "text-gray-500"
                                }`}>
                                  {cat.hint}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 같은 상황, 다른 반응 */}
                      {selectedCategory && (
                        <div className="bg-white  rounded-xl p-5 border border-purple-200 ">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">💬</span>
                            <div>
                              <h4 className="font-bold text-purple-900">
                                같은 상황, 다른 반응
                              </h4>
                              <p className="text-sm text-purple-600">
                                "친구가 이별했어" 상황에서 각 기능별 반응
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {getCategoryExamples(selectedCategory).map((example) => (
                              <div
                                key={example.key}
                                className={`p-4 rounded-lg border-l-4 ${example.borderColor} bg-gradient-to-r ${example.bgGradient}`}
                              >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{example.icon}</span>
                                    <span className="font-bold text-gray-900 ">
                                      {example.key}
                                    </span>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${example.badgeStyle}`}>
                                    {example.type}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2 italic">
                                  "{example.reaction}"
                                </p>
                                <p className="text-xs text-gray-600">
                                  {example.explanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-purple-600/80 italic text-center">
                        ※ 정답이나 성격을 규정하는 설명이 아니라, 나를 이해하기 위한 하나의 관점이에요.
                      </p>
                    </div>
                  </details>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}