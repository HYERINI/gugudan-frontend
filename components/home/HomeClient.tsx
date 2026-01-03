"use client";

import {useMemo, useState} from "react";
import Image from "next/image";

import {useAuth} from "@/hooks/useAuth";
import {Button} from "@/components/ui/Button";
import {useRouter} from "next/navigation";
import {startNewChat} from "@/lib/chatNav";
import AppFooter from "../layout/AppFooter";
import ServiceSection from "@/components/home/ServiceSection";
import MbtiSection from "@/components/home/MbtiSection";
import TeamSection from "@/components/home/TeamSection";

type ConsultationTopic = "marriage" | "dating" | "crush" | null;

export default function HomeClient() {
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<ConsultationTopic>(null);

  const topics = useMemo(
    () => [
      {
        id: "marriage" as const,
        title: "결혼",
        subtitle: "부부 관계의 고민",
        description:
          "함께 살아가며 쌓인 감정과 생각을 차분히 돌아보고 정리해요.",
        image:
          "/images/home/home-topic-marriage.jpg",
        overlay: "from-rose-400 to-pink-500",
      },
      {
        id: "dating" as const,
        title: "연애",
        subtitle: "연인과의 관계",
        description:
          "관계 속에서 느끼는 설렘, 불안, 서운함을 있는 그대로 이야기해요.",
        image:
          "/images/home/home-topic-dating.webp",
        overlay: "from-purple-400 to-indigo-500",
      },
      {
        id: "crush" as const,
        title: "썸",
        subtitle: "마음이 설레는 관계",
        description:
          "마음이 헷갈릴 때, 서두르지 않고 감정을 살펴봐요.",
        image:
          "/images/home/home-topic-crush.jpg",
        overlay: "from-amber-400 to-orange-500",
      },
    ],
    []
  );


const canStart = !isLoading && isAuthenticated;

  return (
  <div className="min-h-screen">
    <section className="bg-gradient-to-b from-purple-50 to-pink-50">
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
            💬 24시간 언제든지
          </span>

          <h2 className="mt-6 text-4xl md:text-6xl font-bold leading-tight break-keep bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            말로 다 하지 못한
            <br className="hidden md:block" />
            마음이 있나요?
          </h2>

          <p className="mt-6 text-lg text-gray-600 break-keep">
            굳이 말이 되지 않아도 괜찮아요.
            <br className="hidden md:block" />
            그대로 꺼내도 돼요.
          </p>
        </div>

        {/* Topic cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {topics.map((t) => {
            const active = selectedTopic === t.id;

            return (
              <div
                key={t.id}
                className={`overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
              >
                <div className="relative h-48">
                  <Image
                    src={t.image}
                    alt={t.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${t.overlay} opacity-60`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{t.title}</div>
                      <div className="text-sm opacity-90">{t.subtitle}</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm text-gray-600 text-center break-keep">
                    {t.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-purple-200 rounded-full text-gray-700 mb-8">
            🌟 로그인 후 My Page에서 성별 · MBTI를 적어두면 대화의 흐름을 이해하는 데 참고해요.
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          {isAuthenticated ? (
            <Button
              disabled={!canStart}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              onClick={() => startNewChat(router, "/chat")}
            >
              이야기 시작하기 →
            </Button>
          ) : (
            <div className="h-[76px]" />
          )}
        </div>
      </main>
      </section>
    {/* 2) Service 섹션: 배경 분리 */}
    <section className="bg-white/40">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <ServiceSection/>
      </div>
    </section>

    <MbtiSection />
    <TeamSection />
    <AppFooter/>
    </div>
  );
}
