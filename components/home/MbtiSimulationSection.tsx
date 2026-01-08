"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useInView } from "@/hooks/useInView";

export default function MbtiSimulationSection() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  // ✅ 애니메이션 훅 추가
  const headerRef = useInView<HTMLDivElement>({ threshold: 0.1 });
  const cardsRef = useInView<HTMLDivElement>({ threshold: 0.1 });
  const ctaRef = useInView<HTMLDivElement>({ threshold: 0.2 });

  const handleMbtiSimulationClick = () => {
    if (isAuthenticated) {
      // 로그인 상태: 바로 시뮬레이션 시작
      close();
      router.push("/chat?mbti=INFP&topic=dating&mode=simulation");
    } else {
      // 비로그인 상태: 로그인 페이지로 (시뮬레이션으로 리다이렉트)
      router.push("/login?next=/chat?mbti=INFP&topic=dating&mode=simulation");
    }
  };

  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      {/* ✅ 헤더 애니메이션 */}
      <div
        ref={headerRef.ref}
        className={[
          "transition-all duration-1000",
          headerRef.inView ? "opacity-100 scale-100" : "opacity-0 scale-95",
        ].join(" ")}
      >
        <span className="inline-flex items-center bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
          🎭 대화 연습
        </span>
        
        <h2 className="mt-6 text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          대화 연습이 필요하신가요?
        </h2>
        
        <p className="text-lg text-gray-600 mb-12">
          MBTI + 성별 + 상황별 맞춤 대화가 가능합니다
        </p>
      </div>
      
      {/* ✅ 카드 스태거 애니메이션 */}
      <div 
        ref={cardsRef.ref}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
      >
        {[
          { icon: "💭", title: "MBTI 선택", desc: "16가지 유형" },
          { icon: "👤", title: "성별 선택", desc: "남성/여성" },
          { icon: "💝", title: "상황 선택", desc: "연애/결혼/썸" },
          { icon: "💬", title: "대화 시작", desc: "AI 시뮬레이션" },
        ].map((step, idx) => (
          <div
            key={idx}
            className={[
              "bg-white rounded-2xl p-6 text-center border-2 border-indigo-100 shadow-sm hover:shadow-md transition-all duration-700",
              cardsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            ].join(" ")}
            style={{ 
              transitionDelay: cardsRef.inView ? `${idx * 150}ms` : "0ms" 
            }}
          >
            <div className="text-3xl mb-3">{step.icon}</div>
            <div className="font-bold text-indigo-700 text-base mb-1">{step.title}</div>
            <div className="text-sm text-gray-600">{step.desc}</div>
          </div>
        ))}
      </div>
      
      {/* ✅ CTA 애니메이션 */}
      <div
        ref={ctaRef.ref}
        className={[
          "transition-all duration-700",
          ctaRef.inView ? "opacity-100 scale-100" : "opacity-0 scale-90",
        ].join(" ")}
      >
        <Button
          onClick={handleMbtiSimulationClick}
          disabled={isLoading}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              로딩중...
            </span>
          ) : (
            "MBTI 시뮬레이션 시작하기 →"
          )}
        </Button>
        
        {!isLoading && (
          <p className="mt-3 text-sm text-gray-500">
            {isAuthenticated 
              ? "실제 대화처럼 연습하고 자신감을 키워보세요"
              : "로그인이 필요한 서비스입니다"
            }
          </p>
        )}
      </div>
    </div>
  );
}