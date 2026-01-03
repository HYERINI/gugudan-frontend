// app/mbti/_content/mbtiFaq.ts
import type { CategoryKey } from "@/app/mbti/_content/categoryInfo";
import type { SectionItem } from "@/app/mbti/_content/mbtiCategorySections";

export type FaqItem = { q: string; a: string };

type MbtiAxes = {
  EI: "E" | "I";
  SN: "S" | "N";
  TF: "T" | "F";
  JP: "J" | "P";
};

// MBTI 축 추출
export function mbtiAxes(mbti: string): MbtiAxes {
  const m = (mbti ?? "").toUpperCase();
  return {
    EI: m[0] === "E" ? "E" : "I",
    SN: m[1] === "S" ? "S" : "N",
    TF: m[2] === "T" ? "T" : "F",
    JP: m[3] === "J" ? "J" : "P",
  };
}

const DEFAULT_ANSWERS = {
  a: "이 카테고리에서의 대표적인 패턴을 정리해요.",
  b: "대화가 꼬일 때 풀어가는 방법을 정리해요.",
  c: "자주 생기는 오해 포인트를 짚어봐요.",
  d: "관계를 더 편하게 만드는 팁을 정리해요.",
} as const;

function pickAnswers(sections: Pick<SectionItem, "content">[]) {
  return {
    a: sections[0]?.content ?? DEFAULT_ANSWERS.a,
    b: sections[1]?.content ?? DEFAULT_ANSWERS.b,
    c: sections[2]?.content ?? DEFAULT_ANSWERS.c,
    d: sections[3]?.content ?? DEFAULT_ANSWERS.d,
  };
}

// 가변 FAQ 생성 (질문만 가변, 답변은 sections 재사용)
export function buildFaqs(params: {
  mbtiUpperCase: string;
  category: CategoryKey;
  categoryTitle?: string; // 혹시 나중에 질문 문구에 넣고 싶으면
  sections: Pick<SectionItem, "content">[];
}): FaqItem[] {
  const { mbtiUpperCase, category, sections } = params;
  const ax = mbtiAxes(mbtiUpperCase);
  const A = pickAnswers(sections);

  const q1 =
    category === "dating"
      ? `${mbtiUpperCase}는 연애에서 애정 표현을 어떻게 하는 편인가요?`
      : category === "crush"
        ? `${mbtiUpperCase}는 썸에서 호감 신호를 어떻게 보내나요?`
        : `${mbtiUpperCase}는 결혼에서 어떤 가치관을 가장 중요하게 보나요?`;

  const q2 =
    ax.TF === "T"
      ? `${mbtiUpperCase}는 갈등이 생기면 보통 어떤 방식으로 해결하려고 하나요?`
      : `${mbtiUpperCase}는 서운함이 생기면 어떤 케어를 가장 원하나요?`;

  const q3 =
    ax.JP === "J"
      ? `${mbtiUpperCase}는 관계의 약속/일정을 어떻게 맞추는 게 편한가요?`
      : `${mbtiUpperCase}는 관계의 속도 조절을 어떻게 하는 게 자연스러운가요?`;

  return [
    { q: q1, a: A.a },
    { q: q2, a: ax.TF === "T" ? A.b : A.c },
    { q: q3, a: A.d },
  ];
}

// FAQPage JSON-LD 생성
export function buildFaqJsonLd(faqs: FaqItem[]): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return JSON.stringify(jsonLd);
}
