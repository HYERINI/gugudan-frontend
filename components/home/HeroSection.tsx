"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { startNewChat } from "@/lib/chatNav";
import { useInView } from "@/hooks/useInView";

export default function HeroSection() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  const heroRef = useInView<HTMLDivElement>({ threshold: 0.1 });
  const topicsRef = useInView<HTMLDivElement>({ threshold: 0.1 });
  const ctaRef = useInView<HTMLDivElement>({ threshold: 0.2 });

  const topics = useMemo(
    () => [
      {
        id: "marriage" as const,
        title: "결혼",
        subtitle: "부부 관계의 고민",
        description: "함께 살아가며 쌓인 감정과 생각을 차분히 돌아보고 정리해요.",
        image: "/images/home/home-topic-marriage.jpg",
        overlay: "from-rose-400 to-pink-500",
      },
      {
        id: "dating" as const,
        title: "연애",
        subtitle: "연인과의 관계",
        description: "관계 속에서 느끼는 설렘, 불안, 서운함을 있는 그대로 이야기해요.",
        image: "/images/home/home-topic-dating.webp",
        overlay: "from-purple-400 to-indigo-500",
      },
      {
        id: "crush" as const,
        title: "썸",
        subtitle: "마음이 설레는 관계",
        description: "마음이 헷갈릴 때, 서두르지 않고 감정을 살펴봐요.",
        image: "/images/home/home-topic-crush.jpg",
        overlay: "from-amber-400 to-orange-500",
      },
    ],
    []
  );

  const handleCTAClick = () => {
    if (isAuthenticated) {
      startNewChat(router, "/chat");
    } else {
      router.push("/login?next=/chat");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div
        ref={heroRef.ref}
        className={[
          "text-center max-w-3xl mx-auto mb-12 transition-all duration-1000",
          heroRef.inView ? "opacity-100 scale-100" : "opacity-0 scale-95",
        ].join(" ")}
      >
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

      {/* ✅ Topic Cards - 원래 크기 */}
      <div ref={topicsRef.ref} className="grid md:grid-cols-3 gap-6">
        {topics.map((t, idx) => (
          <div
            key={t.id}
            className={[
              "overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-700 hover:shadow-xl hover:scale-[1.02]",
              topicsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            ].join(" ")}
            style={{ 
              transitionDelay: topicsRef.inView ? `${idx * 150}ms` : "0ms" 
            }}
          >
            <div className="relative h-48">
              <Image
                src={t.image}
                alt={t.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${t.overlay} opacity-60`} />
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
        ))}
      </div>

      {/* ✅ CTA - 원래 크기 */}
      <div
        ref={ctaRef.ref}
        className={[
          "text-center mt-10 transition-all duration-700",
          ctaRef.inView ? "opacity-100 scale-100" : "opacity-0 scale-90",
        ].join(" ")}
      >
        <Button
          onClick={handleCTAClick}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              로딩중...
            </span>
          ) : (
            "이야기 시작하기 →"
          )}
        </Button>
        
        {!isAuthenticated && !isLoading && (
          <p className="mt-3 text-sm text-gray-500">
            로그인이 필요한 서비스입니다
          </p>
        )}
      </div>
    </main>
  );
}