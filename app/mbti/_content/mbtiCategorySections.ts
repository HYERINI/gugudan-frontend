// app/mbti/_content/mbtiCategorySections.ts
import type { CategoryKey } from "@/app/mbti/_content/categoryInfo";

export type SectionIconKey = "Heart" | "MessageCircle" | "Lightbulb" | "TrendingUp";

export type SectionItem = {
  icon: SectionIconKey;
  title: string;   // ✅ 카테고리별로 제목도 다르게
  content: string; // ✅ MBTI별/카테고리별 다르게
};

type MbtiCode =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

type Flavor = {
  headline?: string;
  strength: string;
  comm: string;
  caution: string;
  tip: string;
};

type MbtiFlavor = Record<CategoryKey, Flavor>;

const FLAVOR: Record<MbtiCode, MbtiFlavor> = {
  INTJ: {
    marriage: {
      headline: "기준과 방향이 뚜렷한 파트너",
      strength: "큰 그림을 보고 장기 플랜을 세워 관계를 안정적으로 ‘설계’해요.",
      comm: "감정 토론보다 ‘합의안/우선순위’로 정리하면 대화가 빨라져요.",
      caution: "상대는 ‘효율’보다 ‘정서적 확인’을 원할 수 있어요. 건너뛰면 차갑게 느껴질 수 있어요.",
      tip: "결론 전에 ‘지금 내 감정 1문장’부터 말하고, 그 다음에 해결책을 제안해요.",
    },
    dating: {
      headline: "진지하게 오래 가는 연애 지향",
      strength: "가벼운 호감보다 ‘신뢰/존중’이 쌓이는 관계에 강해요.",
      comm: "내가 생각한 결론을 말하기 전, 상대의 감정 요약을 먼저 해주면 충돌이 줄어요.",
      caution: "표현이 적으면 ‘관심 없음’으로 오해받기 쉬워요.",
      tip: "일주일에 한 번은 ‘고마웠던 점 1개’ + ‘바라는 점 1개’로 리듬을 만들어요.",
    },
    crush: {
      headline: "확신이 생겨야 움직이는 타입",
      strength: "가볍게 흔들리기보다, 진짜 가능성이 있는 사람에게 집중해요.",
      comm: "돌려 말하기보다 ‘나는 너랑 더 알아가고 싶어’처럼 의도를 짧게 말하는 게 좋아요.",
      caution: "속도가 느리면 상대가 ‘벽’으로 느낄 수 있어요.",
      tip: "확신이 부족해도 ‘다음 약속’을 먼저 잡아 흐름을 만들어요.",
    },
  },

  INTP: {
    marriage: {
      headline: "규칙보다 이해가 먼저",
      strength: "생활 문제도 ‘원인-구조’로 파악해 장기적으로 개선해요.",
      comm: "정답 찾기 모드로 가기 전에 ‘지금 뭐가 힘든지’ 감정 체크부터 해요.",
      caution: "분석이 길어지면 상대는 ‘나를 평가한다’고 느낄 수 있어요.",
      tip: "대화 초반에 ‘결론보다 네 마음부터 듣고 싶어’ 한마디가 효과적이에요.",
    },
    dating: {
      headline: "대화가 깊어질수록 매력 상승",
      strength: "표면적 설렘보다 ‘지적 교감’이 있는 연애에서 빛나요.",
      comm: "상대의 말에서 핵심 1줄을 뽑아 되돌려주면 ‘이해받음’이 커져요.",
      caution: "감정 표현이 늦으면 ‘무심함’으로 보일 수 있어요.",
      tip: "연락은 길게보다 ‘짧고 자주’—상대가 안정감을 느껴요.",
    },
    crush: {
      headline: "신호 해석하다 타이밍 놓치기 쉬움",
      strength: "감정이 과열되지 않아 관계를 차분하게 지켜봐요.",
      comm: "상대의 반응을 ‘데이터’로만 보지 말고, 직접 확인 질문을 해요.",
      caution: "망설임이 길면 ‘관심이 없나?’로 끝날 수 있어요.",
      tip: "‘이번 주에 한번 더 보고 싶어’ 같은 구체적 제안이 제일 빨라요.",
    },
  },

  ENTJ: {
    marriage: {
      headline: "함께 성장하는 팀 플레이",
      strength: "관계를 ‘공동 목표’로 보고 추진력을 만들어요.",
      comm: "의사결정은 빠르지만, 상대의 속도를 ‘확인’해주면 갈등이 줄어요.",
      caution: "리드가 강하면 상대가 ‘내 자리가 없다’고 느낄 수 있어요.",
      tip: "결정 전에 ‘너의 기준 1~2개’만 먼저 듣고 반영해요.",
    },
    dating: {
      headline: "확실하게 챙기고 확실하게 표현",
      strength: "연애에서 책임감 있게 챙기며 관계를 앞으로 끌고 가요.",
      comm: "피드백은 ‘칭찬→요청’ 순서로 하면 부드러워져요.",
      caution: "지적/개선 제안이 잦으면 상대는 압박을 받아요.",
      tip: "문제 해결 대신 ‘오늘은 위로 모드’ 버튼을 켜는 날을 정해요.",
    },
    crush: {
      headline: "직진이 강점, 압박은 약점",
      strength: "애매함을 싫어해서 관계를 빠르게 명확히 할 수 있어요.",
      comm: "상대가 부담 느끼지 않게 ‘선택권’을 같이 주는 말이 좋아요.",
      caution: "속도 조절 실패하면 상대가 도망갈 수 있어요.",
      tip: "고백보다 먼저 ‘2~3번 더 만나보기’로 안전지대를 만들어요.",
    },
  },

  ENTP: {
    marriage: {
      headline: "지루함을 깨는 관계의 촉매",
      strength: "틀에 갇히지 않고 새로운 방식으로 문제를 풀어요.",
      comm: "토론이 재미로 가면 상대는 상처받을 수 있어요. ‘감정 우선’ 체크 필요.",
      caution: "말싸움처럼 비치면 신뢰가 깎여요.",
      tip: "반박 대신 ‘그렇게 느꼈겠네’ 한 번만 넣어도 분위기가 달라져요.",
    },
    dating: {
      headline: "설렘과 재미를 만드는 타입",
      strength: "분위기를 살리고 상대를 가볍게 웃게 하는 능력이 커요.",
      comm: "장난→진심 전환 타이밍을 잡아주면 안정감이 생겨요.",
      caution: "가벼워 보이면 ‘진지함 부족’으로 오해돼요.",
      tip: "중요한 대화는 ‘짧게-명확하게-약속으로’ 마무리해요.",
    },
    crush: {
      headline: "썸을 키우는 재치, 끝내는 결단",
      strength: "호감 신호를 자연스럽게 만들고 분위기를 올려요.",
      comm: "상대가 헷갈리면 ‘내 의도’만큼은 선명하게 말해요.",
      caution: "떠보기만 하면 ‘장난인가?’로 끝날 수 있어요.",
      tip: "가벼운 플러팅 뒤엔 ‘다음 약속’으로 연결해요.",
    },
  },

  INFJ: {
    marriage: {
      headline: "깊은 이해와 헌신",
      strength: "상대의 마음을 잘 읽고 관계의 본질을 붙잡아요.",
      comm: "혼자 결론 내기 전에 ‘내 생각 과정’을 공유하면 오해가 줄어요.",
      caution: "참다가 한 번에 터지면 관계가 크게 흔들려요.",
      tip: "불편함을 ‘작게, 자주’ 말하는 연습이 필요해요.",
    },
    dating: {
      headline: "진심과 의미 중심 연애",
      strength: "가볍게 소비하지 않고 관계에 의미를 부여해요.",
      comm: "상대에게 원하는 걸 ‘부드럽게 구체화’하면 만족도가 커져요.",
      caution: "상대 눈치만 보다가 내 욕구가 사라질 수 있어요.",
      tip: "‘내가 원하는 것 1개’도 같은 무게로 올려두세요.",
    },
    crush: {
      headline: "확신이 오기 전까지 조용히 관찰",
      strength: "상대의 마음을 섬세하게 살피고 서두르지 않아요.",
      comm: "힌트 대신 ‘질문’이 좋아요. ‘너는 어떤 관계를 원해?’",
      caution: "상대가 몰라주면 혼자 상처받기 쉬워요.",
      tip: "감정이 커지기 전에 기준/속도를 먼저 맞춰요.",
    },
  },

  INFP: {
    marriage: {
      headline: "가치와 진정성의 결혼",
      strength: "관계의 ‘의미/가치’를 놓치지 않고 따뜻하게 지켜요.",
      comm: "감정이 쌓이기 전, 작은 서운함을 ‘상태 공유’로 말해요.",
      caution: "상대가 현실 문제를 가볍게 다룬다고 느끼면 마음이 멀어질 수 있어요.",
      tip: "현실 의제는 ‘체크리스트’로, 감정은 ‘대화’로 분리해요.",
    },
    dating: {
      headline: "진심이 깊을수록 안정",
      strength: "상대에게 진정성 있는 애정 표현을 할 수 있어요.",
      comm: "상대의 말에서 ‘의도’를 좋은 쪽으로 해석하려는 습관이 강점이에요.",
      caution: "상대 반응에 내 자존감이 흔들릴 수 있어요.",
      tip: "확인 질문(‘너는 어떻게 생각해?’)을 미루지 마세요.",
    },
    crush: {
      headline: "상상은 빠르지만 실행은 조심",
      strength: "상대의 장점을 잘 발견하고 호감을 예쁘게 키워요.",
      comm: "애매하면 ‘나 너랑 더 알아가고 싶어’로 한 줄만 말해요.",
      caution: "상대가 모르면 혼자만 깊어질 수 있어요.",
      tip: "내 마음이 커지기 전에 ‘만남 빈도’부터 올려요.",
    },
  },

  ENFJ: {
    marriage: {
      headline: "관계를 이끄는 따뜻한 리더",
      strength: "가족/관계 분위기를 살리고 조율하는 능력이 뛰어나요.",
      comm: "상대의 표정/톤을 캐치했으면 ‘확인 질문’으로 마무리해요.",
      caution: "내가 다 책임지면 번아웃이 와요.",
      tip: "역할을 나눌 때 ‘내가 원하는 도움’을 구체적으로 부탁해요.",
    },
    dating: {
      headline: "애정 표현과 배려가 풍부",
      strength: "상대가 사랑받는다고 느끼게 만드는 능력이 커요.",
      comm: "문제는 ‘공감→해결’ 순서로 가면 완벽해요.",
      caution: "상대가 내 배려를 당연시하면 상처가 커질 수 있어요.",
      tip: "배려를 ‘기대’로 바꾸지 말고, 필요하면 요청으로 전환해요.",
    },
    crush: {
      headline: "썸을 ‘연애’로 만드는 추진력",
      strength: "호감 표현이 자연스럽고 상대를 편하게 만들어요.",
      comm: "상대가 부담 느끼지 않도록 속도를 ‘물어보고’ 맞추세요.",
      caution: "상대가 애매하면 내가 더 노력해버릴 수 있어요.",
      tip: "관계 정의를 너무 늦추지 말고 ‘우리 지금 어때?’를 꺼내요.",
    },
  },

  ENFP: {
    marriage: {
      headline: "따뜻함 + 활력의 결합",
      strength: "관계를 즐겁게 유지하고 새로운 경험을 잘 만들어요.",
      comm: "중요한 의제는 감정이 높기 전에 ‘약속 시간’을 잡고 대화해요.",
      caution: "즉흥성이 생활 리듬과 충돌할 수 있어요.",
      tip: "생활 루틴은 최소 2~3개만 고정하고, 나머지는 자유롭게 두세요.",
    },
    dating: {
      headline: "애정 표현이 풍부한 연애",
      strength: "상대에게 설렘과 에너지를 전달하는 능력이 커요.",
      comm: "서운함은 ‘감정+원하는 행동’으로 말하면 오해가 줄어요.",
      caution: "감정 기복이 상대를 불안하게 만들 수 있어요.",
      tip: "감정이 흔들릴 때 ‘잠깐 쉬고 다시 말하기’ 룰을 만들어요.",
    },
    crush: {
      headline: "썸의 텐션을 올리는 타입",
      strength: "호감 신호가 잘 전달돼 썸을 자연스럽게 키워요.",
      comm: "감정 표현이 강점이지만, 상대 반응도 확인하면서 가요.",
      caution: "너무 빠르면 상대가 부담을 느낄 수 있어요.",
      tip: "설렘 표현 + 다음 약속 = 가장 안전한 전개예요.",
    },
  },

  ISTJ: {
    marriage: {
      headline: "신뢰로 쌓는 안정형 결혼",
      strength: "약속/책임/생활 안정감으로 관계를 단단히 만들어요.",
      comm: "문제는 ‘사실→요청’으로 말하면 오해가 적어요.",
      caution: "감정 표현이 적으면 상대가 외로울 수 있어요.",
      tip: "규칙을 만들 때 ‘상대가 편해지는 이유’도 같이 설명해요.",
    },
    dating: {
      headline: "꾸준함이 가장 큰 매력",
      strength: "연락/약속/신뢰를 지키며 안정적인 연애를 만들어요.",
      comm: "감정 이야기는 어색해도, ‘오늘 고마웠어’ 같은 짧은 표현이 좋아요.",
      caution: "변화에 둔하면 ‘노력 안 한다’로 보일 수 있어요.",
      tip: "작은 이벤트를 달력에 넣어 ‘의식적으로’ 챙기면 좋아요.",
    },
    crush: {
      headline: "확실한 신호를 좋아함",
      strength: "상대를 천천히 알아가며 진지하게 접근해요.",
      comm: "호감이 있으면 ‘시간을 내겠다’로 표현해도 충분히 신호가 돼요.",
      caution: "너무 조심하면 흐름이 끊길 수 있어요.",
      tip: "관심 표현은 ‘행동’으로—만남 제안이 가장 확실해요.",
    },
  },

  ISFJ: {
    marriage: {
      headline: "챙김과 배려가 큰 힘",
      strength: "생활에서 상대를 잘 돌보며 안정감을 줘요.",
      comm: "불편함을 참기 전에 ‘작게’ 말해야 관계가 오래가요.",
      caution: "희생이 쌓이면 서운함이 커져요.",
      tip: "배려 1개 + 요청 1개를 세트로 말해보세요.",
    },
    dating: {
      headline: "안정적이고 따뜻한 연애",
      strength: "상대가 편안함을 느끼게 하는 능력이 커요.",
      comm: "기분이 상하면 힌트보다 ‘요청’을 직접 말해요.",
      caution: "상대 중심으로만 맞추다 나를 잃을 수 있어요.",
      tip: "나를 위한 시간도 연애 일정에 포함하세요.",
    },
    crush: {
      headline: "조심스럽지만 진심이 깊음",
      strength: "상대를 세심하게 관찰하고 작은 신호를 잘 잡아요.",
      comm: "확인 질문을 부드럽게: ‘너는 어떻게 생각해?’",
      caution: "상대가 모르면 혼자만 기대할 수 있어요.",
      tip: "호감은 ‘기대’가 아니라 ‘대화’로 확인하세요.",
    },
  },

  ESTJ: {
    marriage: {
      headline: "현실을 챙기는 든든한 파트너",
      strength: "생활/재정/일정 관리로 관계의 기반을 탄탄히 만들어요.",
      comm: "지적보다 ‘합의’ 중심으로 말하면 훨씬 부드러워져요.",
      caution: "강한 표현은 상대에게 ‘통제’로 느껴질 수 있어요.",
      tip: "결정 전 ‘상대가 중요하게 여기는 기준’부터 물어보세요.",
    },
    dating: {
      headline: "확실하고 책임감 있는 연애",
      strength: "계획을 세우고 관계를 안정적으로 이끌어요.",
      comm: "상대의 감정에 대한 ‘확인 질문’을 한 번만 추가해도 좋아요.",
      caution: "맞고 틀림 싸움이 되면 연애가 힘들어져요.",
      tip: "문제는 ‘누구 잘못’보다 ‘다음엔 어떻게’로 끝내요.",
    },
    crush: {
      headline: "애매함을 끝내는 타입",
      strength: "관계 상태를 명확히 하고 행동으로 보여줘요.",
      comm: "직진하되 ‘부담이면 말해줘’ 같은 안전장치를 달아주세요.",
      caution: "너무 빠르면 상대가 겁먹을 수 있어요.",
      tip: "확인 대화는 ‘선택권’을 주는 방식이 좋아요.",
    },
  },

  ESFJ: {
    marriage: {
      headline: "관계 온도를 지키는 조율자",
      strength: "분위기/감정을 살피며 가족의 균형을 만들어요.",
      comm: "상대가 무뚝뚝해도 ‘확인’하고 넘어가면 갈등이 줄어요.",
      caution: "내가 더 많이 챙긴다는 느낌이 쌓이면 힘들어져요.",
      tip: "기대는 요청으로: ‘이건 네가 해주면 좋겠어’라고 말해요.",
    },
    dating: {
      headline: "함께하면 편안한 연애",
      strength: "상대가 사랑받는다고 느끼게 하는 힘이 커요.",
      comm: "서운함은 바로 말하되, 톤을 부드럽게 유지해요.",
      caution: "관계에 집착하면 불안이 커질 수 있어요.",
      tip: "연락/만남 기준을 합의해 ‘예측 가능성’을 만들어요.",
    },
    crush: {
      headline: "상대 반응에 민감한 썸",
      strength: "상대가 편하게 느끼도록 배려하는 센스가 있어요.",
      comm: "상대가 헷갈리면 ‘내 마음’부터 짧게 말해요.",
      caution: "상대 눈치만 보다가 타이밍을 놓칠 수 있어요.",
      tip: "‘다음에 또 보고 싶어’ 한 문장이 충분한 신호예요.",
    },
  },

  ISTP: {
    marriage: {
      headline: "필요할 때 해결하는 현실형",
      strength: "문제가 생기면 감정보다 ‘해결’로 움직여 안정감을 줘요.",
      comm: "상대는 해결보다 ‘공감’을 먼저 원할 수 있어요.",
      caution: "무덤덤함이 무관심으로 보일 수 있어요.",
      tip: "해결책 전에 ‘힘들었겠다’ 한 마디가 관계를 살려요.",
    },
    dating: {
      headline: "편안한 거리감의 연애",
      strength: "과열되지 않고 관계를 현실적으로 운영해요.",
      comm: "말이 짧아도 괜찮지만, 감정 표현은 ‘의도적으로’ 넣어야 해요.",
      caution: "연락이 뜸하면 상대가 불안해져요.",
      tip: "짧은 체크인 메시지(“잘 자/밥 먹어”)만으로도 충분해요.",
    },
    crush: {
      headline: "행동으로 호감을 보여줌",
      strength: "말보다 행동으로 신뢰를 주는 타입이에요.",
      comm: "상대가 모르겠다면 ‘호감’은 말로도 한번 표현해요.",
      caution: "표현이 부족하면 썸이 멈춰요.",
      tip: "만남 제안 + 작은 칭찬 1개면 흐름이 살아나요.",
    },
  },

  ISFP: {
    marriage: {
      headline: "감각과 배려로 채우는 결혼",
      strength: "일상의 분위기를 부드럽게 만들고 정서적 안정에 강해요.",
      comm: "감정이 상하면 뒤로 숨기보다 ‘지금 마음’부터 말해요.",
      caution: "갈등을 피하다 누적되면 폭발할 수 있어요.",
      tip: "대화는 ‘짧게-자주’가 더 잘 맞아요.",
    },
    dating: {
      headline: "자연스럽고 따뜻한 연애",
      strength: "상대를 편안하게 만들고 진심을 행동으로 보여줘요.",
      comm: "감정 표현이 서툴면, ‘행동+한 문장’으로 보완하세요.",
      caution: "상대가 적극적이면 내 속도가 밀릴 수 있어요.",
      tip: "내가 편한 리듬(연락/만남)을 먼저 말해 합의해요.",
    },
    crush: {
      headline: "조용히 다가가는 썸",
      strength: "진심이 깊고, 자연스럽게 친밀감을 쌓아요.",
      comm: "상대가 헷갈리면 ‘나는 너랑 더 만나보고 싶어’로 한 줄.",
      caution: "타이밍을 놓치면 그냥 친구로 굳어질 수 있어요.",
      tip: "감정이 커지기 전에 ‘단둘이 만나는 자리’를 만들어요.",
    },
  },

  ESTP: {
    marriage: {
      headline: "현실 돌파형 파트너",
      strength: "상황을 빠르게 판단하고 실행해 문제를 해결해요.",
      comm: "상대가 감정적일 때는 ‘속도’를 늦추는 게 중요해요.",
      caution: "직설이 상처가 될 수 있어요.",
      tip: "강한 말 대신 ‘내가 이렇게 하겠다’ 행동 약속으로 전환해요.",
    },
    dating: {
      headline: "재미와 추진력의 연애",
      strength: "만남을 활기 있게 만들고 관계를 앞으로 끌어요.",
      comm: "장난이 길어지기 전 ‘진심 모드’ 전환을 한 번 해요.",
      caution: "감정 케어가 부족하면 상대가 서운해해요.",
      tip: "서운함을 들으면 변명보다 ‘바로 한 가지 행동’으로 보여줘요.",
    },
    crush: {
      headline: "썸은 빠르게, 신호는 확실히",
      strength: "호감 표현과 행동이 자연스러워 전개가 빨라요.",
      comm: "상대가 부담 느끼면 한 번 멈추고 속도를 맞추세요.",
      caution: "너무 직진하면 상대가 방어적이 될 수 있어요.",
      tip: "고백보다 ‘우리 다음에 뭐 할래?’로 관계를 이어가요.",
    },
  },

  ESFP: {
    marriage: {
      headline: "따뜻한 분위기 메이커",
      strength: "일상에 즐거움을 더하고 관계를 밝게 유지해요.",
      comm: "감정이 생기면 바로 공유하는 편이라 오해가 적어요.",
      caution: "현실 의제(돈/일정)를 미루면 갈등이 커질 수 있어요.",
      tip: "현실 대화는 ‘짧게-정기적으로’ 체크하는 루틴이 좋아요.",
    },
    dating: {
      headline: "사랑 표현이 많은 연애",
      strength: "표현이 풍부해 상대가 ‘사랑받는다’는 느낌이 커요.",
      comm: "서운함은 바로 말하되, 요구로만 들리지 않게 ‘의도’를 덧붙여요.",
      caution: "감정이 과열되면 말이 세질 수 있어요.",
      tip: "감정이 올라올 때 ‘5분 쉬고 다시’ 룰을 만들어요.",
    },
    crush: {
      headline: "썸의 분위기를 살리는 타입",
      strength: "호감이 자연스럽게 전달되고 관계가 빨리 가까워져요.",
      comm: "상대 반응을 보며 속도를 맞추면 더 안정적이에요.",
      caution: "상대가 내 텐션을 부담스러워할 수 있어요.",
      tip: "분위기 + 배려(“불편하면 말해줘”)를 같이 주세요.",
    },
  },
};

const CATEGORY_SECTION_TITLES: Record<CategoryKey, { a: string; b: string; c: string; d: string }> = {
  marriage: {
    a: "생활·가치관 패턴",
    b: "갈등 합의 방식",
    c: "부딪히는 지점",
    d: "함께 오래 가는 팁",
  },
  dating: {
    a: "애정 표현 스타일",
    b: "대화 리듬",
    c: "서운함 포인트",
    d: "관계 온도 올리기",
  },
  crush: {
    a: "호감 신호",
    b: "거리·속도 조절",
    c: "오해가 생기는 지점",
    d: "확인 대화 팁",
  },
};

export function getMbtiCategorySections(mbtiUpperCase: string, category: CategoryKey): SectionItem[] {
  const mbti = mbtiUpperCase.toUpperCase() as MbtiCode;
  const flavor = FLAVOR[mbti];

  // ✅ 안전장치: 혹시 mbti가 잘못 들어오면 기본 문구
  if (!flavor) {
    const t = CATEGORY_SECTION_TITLES[category];
    return [
      { icon: "Heart", title: t.a, content: "이 카테고리에서 어떤 패턴이 나타나는지 간단히 정리해요." },
      { icon: "MessageCircle", title: t.b, content: "대화가 꼬일 때 풀어가는 방법을 정리해요." },
      { icon: "Lightbulb", title: t.c, content: "자주 생기는 오해 포인트를 짚어봐요." },
      { icon: "TrendingUp", title: t.d, content: "관계를 더 편하게 만드는 팁을 정리해요." },
    ];
  }

  const t = CATEGORY_SECTION_TITLES[category];
  const f = flavor[category];

  return [
    { icon: "Heart", title: t.a, content: `${f.headline ? `${f.headline}. ` : ""}${f.strength}` },
    { icon: "MessageCircle", title: t.b, content: f.comm },
    { icon: "Lightbulb", title: t.c, content: f.caution },
    { icon: "TrendingUp", title: t.d, content: f.tip },
  ];
}
