export type CognitiveFunctionSet = {
  dominant: string;
  auxiliary: string;
  tertiary: string;
  inferior: string;
  summary: {
    strength: string;
    risk: string;
    tip: string;
  };
};

export const cognitiveFunctions: Record<string, CognitiveFunctionSet> = {
  INTJ: {
    dominant: "Ni (내향 직관)",
    auxiliary: "Te (외향 사고)",
    tertiary: "Fi (내향 감정)",
    inferior: "Se (외향 감각)",
    summary: {
      strength: "관계를 큰 흐름과 방향성으로 바라보며, 장기적인 안정과 의미를 중요하게 생각해요.",
      risk: "감정을 속으로 정리하다 보니 차갑거나 거리감 있게 보일 수 있어요.",
      tip: "결론보다 먼저, 지금 느끼는 감정을 한 문장으로 전해보세요.",
    },
  },

  INTP: {
    dominant: "Ti (내향 사고)",
    auxiliary: "Ne (외향 직관)",
    tertiary: "Si (내향 감각)",
    inferior: "Fe (외향 감정)",
    summary: {
      strength: "관계를 논리적으로 이해하려 하며, 상대를 깊이 탐구하려는 태도가 있어요.",
      risk: "감정 표현이 늦어 상대가 혼자 고민한다고 느낄 수 있어요.",
      tip: "정리되지 않아도 괜찮으니, 떠오른 생각을 그대로 말해보세요.",
    },
  },

  ENTJ: {
    dominant: "Te (외향 사고)",
    auxiliary: "Ni (내향 직관)",
    tertiary: "Se (외향 감각)",
    inferior: "Fi (내향 감정)",
    summary: {
      strength: "관계를 주도적으로 이끌며, 현실적인 안정과 성장을 만들어가요.",
      risk: "상대의 감정보다 해결책이 먼저 나와 부담을 줄 수 있어요.",
      tip: "조언 전에, 상대 감정을 먼저 공감해 주세요.",
    },
  },

  ENTP: {
    dominant: "Ne (외향 직관)",
    auxiliary: "Ti (내향 사고)",
    tertiary: "Fe (외향 감정)",
    inferior: "Si (내향 감각)",
    summary: {
      strength: "관계에 활력과 새로운 가능성을 불어넣는 타입이에요.",
      risk: "집중력이 분산되어 진지함이 부족해 보일 수 있어요.",
      tip: "지금 관계에서 가장 중요한 한 가지에 집중해보세요.",
    },
  },

  INFJ: {
    dominant: "Ni (내향 직관)",
    auxiliary: "Fe (외향 감정)",
    tertiary: "Ti (내향 사고)",
    inferior: "Se (외향 감각)",
    summary: {
      strength: "상대의 감정을 깊이 이해하며 의미 있는 관계를 추구해요.",
      risk: "참다가 한 번에 감정이 쌓여 폭발할 수 있어요.",
      tip: "괜찮아 보이기보다, 솔직함을 선택해도 괜찮아요.",
    },
  },

  INFP: {
    dominant: "Fi (내향 감정)",
    auxiliary: "Ne (외향 직관)",
    tertiary: "Si (내향 감각)",
    inferior: "Te (외향 사고)",
    summary: {
      strength: "관계에서 진정성과 감정의 깊이를 매우 중요하게 여겨요.",
      risk: "상처를 혼자 키우며 거리감을 만들 수 있어요.",
      tip: "상대가 모를 수 있다는 전제로 마음을 표현해보세요.",
    },
  },

  ENFJ: {
    dominant: "Fe (외향 감정)",
    auxiliary: "Ni (내향 직관)",
    tertiary: "Se (외향 감각)",
    inferior: "Ti (내향 사고)",
    summary: {
      strength: "상대의 감정을 잘 살피며 관계를 조화롭게 이끌어요.",
      risk: "자기 감정보다 상대를 우선하다 지칠 수 있어요.",
      tip: "상대를 챙기듯, 나의 마음도 챙겨주세요.",
    },
  },

  ENFP: {
    dominant: "Ne (외향 직관)",
    auxiliary: "Fi (내향 감정)",
    tertiary: "Te (외향 사고)",
    inferior: "Si (내향 감각)",
    summary: {
      strength: "감정 표현이 풍부하고, 관계에 따뜻한 에너지를 줘요.",
      risk: "감정 기복이 커 상대가 혼란스러울 수 있어요.",
      tip: "지금 느끼는 감정을 차분히 정리해 전달해보세요.",
    },
  },

  ISTJ: {
    dominant: "Si (내향 감각)",
    auxiliary: "Te (외향 사고)",
    tertiary: "Fi (내향 감정)",
    inferior: "Ne (외향 직관)",
    summary: {
      strength: "책임감 있고 안정적인 관계를 만들어가요.",
      risk: "변화를 부담스러워해 답답해 보일 수 있어요.",
      tip: "작은 변화부터 천천히 시도해보세요.",
    },
  },

  ISFJ: {
    dominant: "Si (내향 감각)",
    auxiliary: "Fe (외향 감정)",
    tertiary: "Ti (내향 사고)",
    inferior: "Ne (외향 직관)",
    summary: {
      strength: "상대를 세심하게 챙기며 신뢰를 쌓아요.",
      risk: "싫은 감정을 참고 넘기다 지칠 수 있어요.",
      tip: "부담 없이 감정을 나누는 연습을 해보세요.",
    },
  },

  ESTJ: {
    dominant: "Te (외향 사고)",
    auxiliary: "Si (내향 감각)",
    tertiary: "Ne (외향 직관)",
    inferior: "Fi (내향 감정)",
    summary: {
      strength: "현실적인 문제 해결로 관계를 안정시켜요.",
      risk: "감정보다 효율이 앞서 차갑게 느껴질 수 있어요.",
      tip: "상대의 감정도 중요한 정보라는 걸 기억하세요.",
    },
  },

  ESFJ: {
    dominant: "Fe (외향 감정)",
    auxiliary: "Si (내향 감각)",
    tertiary: "Ne (외향 직관)",
    inferior: "Ti (내향 사고)",
    summary: {
      strength: "따뜻한 배려로 관계를 편안하게 만들어요.",
      risk: "상대 반응에 과하게 흔들릴 수 있어요.",
      tip: "모두를 만족시키려 하지 않아도 괜찮아요.",
    },
  },

  ISTP: {
    dominant: "Ti (내향 사고)",
    auxiliary: "Se (외향 감각)",
    tertiary: "Ni (내향 직관)",
    inferior: "Fe (외향 감정)",
    summary: {
      strength: "담백하고 현실적인 관계를 선호해요.",
      risk: "감정 표현 부족으로 거리감이 생길 수 있어요.",
      tip: "말이 어렵다면 행동으로라도 표현해보세요.",
    },
  },

  ISFP: {
    dominant: "Fi (내향 감정)",
    auxiliary: "Se (외향 감각)",
    tertiary: "Ni (내향 직관)",
    inferior: "Te (외향 사고)",
    summary: {
      strength: "자연스럽고 진솔한 감정 교류를 잘해요.",
      risk: "갈등을 피하다 오해가 쌓일 수 있어요.",
      tip: "불편함도 관계의 일부라는 걸 기억하세요.",
    },
  },

  ESTP: {
    dominant: "Se (외향 감각)",
    auxiliary: "Ti (내향 사고)",
    tertiary: "Fe (외향 감정)",
    inferior: "Ni (내향 직관)",
    summary: {
      strength: "관계에 생동감과 즐거움을 줘요.",
      risk: "순간의 감정에 치우쳐 깊이가 부족해 보일 수 있어요.",
      tip: "지금뿐 아니라 이후의 감정도 한 번 떠올려보세요.",
    },
  },

  ESFP: {
    dominant: "Se (외향 감각)",
    auxiliary: "Fi (내향 감정)",
    tertiary: "Te (외향 사고)",
    inferior: "Ni (내향 직관)",
    summary: {
      strength: "밝고 솔직한 감정 표현으로 관계를 따뜻하게 만들어요.",
      risk: "즉흥적인 선택이 관계에 혼란을 줄 수 있어요.",
      tip: "감정이 가라앉은 뒤 한 번 더 생각해보세요.",
    },
  },
};
