export type GlossaryItem = {
  key: string;
  title: string;
  desc: string;
};

export const cognitiveGlossary = {
  introTitle: "인지 기능이란?",
  introLines: [
    "MBTI를 더 깊이 이해하기 위한 참고 설명이에요.",
    "연애에서 자주 나타나는 생각과 감정 패턴을 이해하는 데 도움을 줘요.",
  ],
  disclaimer:
    "※ 정답이나 성격을 규정하는 설명이 아니라, 나를 이해하기 위한 하나의 관점이에요.",
  items: [
    { key: "Ni", title: "내향 직관 (Ni)", desc: "미래를 예측하고 ‘큰 흐름/의미’를 읽으려 해요." },
    { key: "Ne", title: "외향 직관 (Ne)", desc: "가능성을 넓게 탐색하고 ‘여러 선택지’를 떠올려요." },
    { key: "Si", title: "내향 감각 (Si)", desc: "경험/기억을 바탕으로 익숙하고 안정적인 방식을 선호해요." },
    { key: "Se", title: "외향 감각 (Se)", desc: "지금 이 순간의 현실/감각에 집중하고 즉각 반응해요." },
    { key: "Ti", title: "내향 사고 (Ti)", desc: "내 기준의 논리로 ‘왜?’를 따져 정리하려 해요." },
    { key: "Te", title: "외향 사고 (Te)", desc: "현실적인 효율/결과를 중시하고 ‘해결’로 움직여요." },
    { key: "Fi", title: "내향 감정 (Fi)", desc: "내 가치/진심에 맞는지 중요하게 여기고 섬세해요." },
    { key: "Fe", title: "외향 감정 (Fe)", desc: "상대의 기분/분위기를 살피고 조화를 만들려 해요." },
  ] satisfies GlossaryItem[],
};
