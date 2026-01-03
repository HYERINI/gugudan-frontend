export type MbtiMeta = { name: string; traits: string[]; oneLiner?: string };

export const mbtiDescriptions: Record<string, MbtiMeta> = {
  INTJ: {
    name: "용의주도한 전략가",
    traits: ["전략적 사고", "독립적", "완벽주의", "장기 계획"],
    oneLiner: "관계를 ‘설계’하듯 바라보는 편",
  },
  INTP: {
    name: "논리적인 사색가",
    traits: ["논리적 분석", "호기심", "창의적", "이론적 사고"],
    oneLiner: "생각이 깊고 질문이 많은 편",
  },
  ENTJ: {
    name: "대담한 통솔자",
    traits: ["리더십", "결단력", "목표지향", "효율성"],
    oneLiner: "방향을 정하고 밀어붙이는 편",
  },
  ENTP: {
    name: "뜨거운 논쟁가",
    traits: ["창의적", "논쟁적", "모험적", "빠른 사고"],
    oneLiner: "재치 있게 판을 흔드는 편",
  },
  INFJ: {
    name: "선의의 옹호자",
    traits: ["통찰력", "이상주의", "공감 능력", "헌신적"],
    oneLiner: "마음을 깊게 읽고 오래 생각하는 편",
  },
  INFP: {
    name: "열정적인 중재자",
    traits: ["이상주의", "창의적", "감수성", "진정성"],
    oneLiner: "진정성과 의미를 중요하게 여기는 편",
  },
  ENFJ: {
    name: "정의로운 사회운동가",
    traits: ["카리스마", "공감 능력", "사교적", "영감적"],
    oneLiner: "분위기를 살리고 관계를 이끄는 편",
  },
  ENFP: {
    name: "재기발랄한 활동가",
    traits: ["열정적", "창의적", "사교적", "긍정적"],
    oneLiner: "감정 표현이 풍부하고 따뜻한 편",
  },
  ISTJ: {
    name: "현실주의자",
    traits: ["책임감", "조직적", "신뢰성", "실용적"],
    oneLiner: "기준이 분명하고 책임감이 강한 편",
  },
  ISFJ: {
    name: "용감한 수호자",
    traits: ["헌신적", "세심함", "책임감", "지원적"],
    oneLiner: "상대를 살피고 챙기는 데 능한 편",
  },
  ESTJ: {
    name: "엄격한 관리자",
    traits: ["조직력", "실용적", "결단력", "전통적"],
    oneLiner: "원칙과 현실을 함께 챙기는 편",
  },
  ESFJ: {
    name: "사교적인 외교관",
    traits: ["사교적", "협조적", "책임감", "세심함"],
    oneLiner: "관계의 균형과 조화를 중시하는 편",
  },
  ISTP: {
    name: "만능 재주꾼",
    traits: ["실용적", "논리적", "유연함", "모험적"],
    oneLiner: "필요할 때 딱 해결하는 편",
  },
  ISFP: {
    name: "호기심 많은 예술가",
    traits: ["예술적", "유연함", "감수성", "자유로움"],
    oneLiner: "감각적이고 자연스러운 흐름을 좋아하는 편",
  },
  ESTP: {
    name: "모험을 즐기는 사업가",
    traits: ["행동적", "대담함", "현실적", "사교적"],
    oneLiner: "지금 이 순간의 확신으로 움직이는 편",
  },
  ESFP: {
    name: "자유로운 영혼의 연예인",
    traits: ["활발함", "즐거움", "사교적", "즉흥적"],
    oneLiner: "분위기를 밝게 만드는 편",
  },
};
