"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TeamSection() {
  const router = useRouter();

  const scrollToMbtiGuide = () => {
    const el = document.getElementById("mbti-guide");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // id를 아직 안 붙였을 때 안전장치
    router.push("/#mbti-guide");
  };

  const goToChat = () => {
    // 로그인 필요 시 아래로 변경 가능:
    // router.push("/login?next=/chat");
    router.push("/chat");
  };

  return (
    <section className="w-full pb-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* mascot image area */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-lg overflow-hidden">
            <div className="p-4 md:p-6">
              
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                구구단 팀
              </h2>
                우리는 이렇게 만들고 있어요
              </div>
              <p className="mt-2 text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center break-keep">
                구구단은 관계를 ‘정답’으로 재단하기보다,
                <br />
                사용자가 스스로 선택할 수 있도록 생각을 정리하는 데 집중해요.
                <br />
                차가운 기능보다, 사람에게 도움이 되는 경험을 먼저 고민합니다.
              </p>
            </div>

            <div className="relative w-full aspect-[16/9] bg-gray-50 dark:bg-white/5">
              <Image
                src="/images/home/gugudan-mascot.jpeg"
                alt="Gugudan mascot"
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 768px"
                priority={false}
              />
            </div>
          </div>
        </div>
        
        {/* 3 cards */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div
            className="rounded-2xl bg-white/90 dark:bg-white/5 p-8 text-center border border-blue-100/70 dark:border-white/10 shadow-sm
                        transition-all duration-300 transform hover:scale-[1.03]
                        hover:shadow-md will-change-transform"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow">
              🎯
            </div>
            <div className="mt-5 font-semibold text-gray-900 dark:text-gray-100">우리의 미션</div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 break-keep">
              누구나 부담 없이, 관계 고민을 “정리하고 시작”할 수 있는 길을 만들어요.
            </p>
          </div>

          <div
            className="rounded-2xl bg-white/90 dark:bg-white/5 p-8 text-center border border-blue-100/70 dark:border-white/10 shadow-sm
                        transition-all duration-300 transform hover:scale-[1.03]
                        hover:shadow-md will-change-transform"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow">
              🫶
            </div>
            <div className="mt-5 font-semibold text-gray-900 dark:text-gray-100">우리의 가치</div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 break-keep">
              공감 · 신뢰 · 프라이버시를 지키면서, “현실적으로 도움이 되는 답”을 목표로 해요.
            </p>
          </div>

          <div
            className="rounded-2xl bg-white/90 dark:bg-white/5 p-8 text-center border border-blue-100/70 dark:border-white/10 shadow-sm
                        transition-all duration-300 transform hover:scale-[1.03]
                        hover:shadow-md will-change-transform"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow">
              ✨
            </div>
            <div className="mt-5 font-semibold text-gray-900 dark:text-gray-100">우리의 비전</div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 break-keep">
              애매한 감정과 상황을 “말로 정리할 수 있게” 돕는, 따뜻한 AI 관계 파트너가 되고 싶어요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
