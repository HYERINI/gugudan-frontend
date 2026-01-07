"use client";

import React, { useState, useRef, useEffect, FormEvent, KeyboardEvent, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Send, ShieldCheck, Check, Sparkles, Loader2 } from "lucide-react";
import { ChatMessage, Gender, Topic, ChatDetailResponse, DBMessage } from "./Simulation";

interface ChatRoomProps {
  initialChatId: string | null;
  onNewChatStarted: () => void;
}

const GENDERS: Gender[] = ["여성", "남성"];
const MBTI_TYPES: string[] = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
const TOPICS: Topic[] = [
  { id: "crush", label: "썸/짝사랑", desc: "미묘한 기류가 흐르는 설레는 상황" },
  { id: "dating", label: "연애 중", desc: "일상적인 대화나 데이트 계획" },
  { id: "conflict", label: "갈등/화해", desc: "서운한 점을 말하거나 다툰 후의 긴장감" },
  { id: "marriage", label: "결혼 준비", desc: "상견례, 신혼집 등 현실적인 논의" },
  { id: "breakup", label: "이별 위기", desc: "관계의 끝을 앞둔 무겁고 진지한 대화" },
  { id: "custom", label: "직접 입력", desc: "나만의 구체적인 상황을 설정해보세요" },
];

export default function SimulationRoom({ initialChatId, onNewChatStarted }: ChatRoomProps) {
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isStarted, setIsStarted] = useState<boolean>(!!initialChatId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string | null>(initialChatId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");

  const [selectedMbti, setSelectedMbti] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("dating");
  const [customTopicText, setCustomTopicText] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<Gender>("여성");

  // 스크롤 최하단 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // URL 파라미터 초기화
  useEffect(() => {
    if (!initialChatId) {
      const mbtiParam = searchParams.get("mbti")?.toUpperCase();
      const topicParam = searchParams.get("topic");
      if (mbtiParam && MBTI_TYPES.includes(mbtiParam)) setSelectedMbti(mbtiParam);
      if (topicParam && TOPICS.some(t => t.id === topicParam)) setSelectedTopic(topicParam);
    }
  }, [searchParams, initialChatId]);

  // 채팅 내역 로드
  useEffect(() => {
    if (initialChatId) {
      const loadHistory = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/simulation/${initialChatId}`, { 
            credentials: "include" 
          });
          if (res.ok) {
            const data: ChatDetailResponse = await res.json();
            if (data.messages && Array.isArray(data.messages)) {
              const formattedMessages: ChatMessage[] = data.messages.map((m: DBMessage, index: number) => ({
                id: `${data.id}-${index}-${m.timestamp}`,
                role: m.role,
                content: m.content,
                time: new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }));
              setMessages(formattedMessages);
            }
            setChatId(data.id);
            setSelectedMbti(data.mbti);
            setSelectedGender(data.gender);
            setIsStarted(true);
            const matchedTopic = TOPICS.find(t => t.label === data.topic);
            if (matchedTopic) setSelectedTopic(matchedTopic.id);
            else {
              setSelectedTopic("custom");
              setCustomTopicText(data.topic);
            }
          }
        } catch (error) {
          console.error("채팅 내역 로드 실패:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadHistory();
    } else {
      setIsStarted(false);
      setMessages([]);
      setChatId(null);
      setSelectedTopic(TOPICS[0].id);
    }
  }, [initialChatId]);

  // --- 스트리밍 소비 함수 (성능 최적화 버전) ---
  const consumeStream = async (response: Response, messageId: string) => {
    const reader = response.body?.getReader();
    if (!reader) return;

    // 1. 디코더를 밖에서 생성 (한글 깨짐 방지 핵심)
    const decoder = new TextDecoder("utf-8");
    let accumulatedContent = "";

    // 2. 초기 빈 메시지 객체 생성
    setMessages((prev) => [...prev, {
      id: messageId,
      role: "assistant",
      content: "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }]);

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 3. stream: true 옵션으로 멀티바이트 문자열(한글) 보존
        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        // 4. 성능 최적화: 마지막 인덱스만 수정 (배열 전체 map 방지)
        setMessages((prev) => {
          const lastIdx = prev.length - 1;
          if (prev[lastIdx]?.id === messageId) {
            const newMessages = [...prev];
            newMessages[lastIdx] = { ...newMessages[lastIdx], content: accumulatedContent };
            return newMessages;
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Streaming error:", error);
    } finally {
      reader.releaseLock();
    }
  };

  const handleStartChat = async () => {
    if (!selectedMbti) { alert("MBTI를 선택해주세요!"); return; }
    if (selectedTopic === "custom" && !customTopicText.trim()) { alert("상황을 직접 입력해주세요."); return; }

    setIsLoading(true);
    try {
      const topicLabel = selectedTopic === "custom" ? customTopicText : TOPICS.find(t => t.id === selectedTopic)?.label;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/simulation/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mbti: selectedMbti, gender: selectedGender, topic: topicLabel }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("서버 연결에 실패했습니다.");

      const newChatId = response.headers.get("X-Chat-Id");
      if (newChatId) {
        setChatId(newChatId);
        setIsStarted(true); 
        onNewChatStarted(); 
        await consumeStream(response, "ai-initial");
      }
    } catch (error) {
      console.error("Chat Start Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: FormEvent | KeyboardEvent) => {
    if (e.type === 'submit') e.preventDefault();
    if (!input.trim() || isLoading || !chatId) return;

    const userContent = input;
    setInput("");
    const userMsg: ChatMessage = {
      id: Date.now().toString(), role: "user", content: userContent,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/simulation/${chatId}/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userContent }),
        credentials: "include",
      });
      await consumeStream(response, `ai-${Date.now()}`);
    } catch (error) {
      console.error("Send Message Error:", error);
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!isStarted) {
    return (
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center bg-white dark:bg-neutral-950">
        <div className="max-w-md w-full space-y-8 mt-6">
          <h1 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-purple-600" /> 시뮬레이션 설정</h1>
          <section className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/10">
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">상대 성별</label>
              <div className="flex gap-2">
                {GENDERS.map((g) => (
                  <button key={g} onClick={() => setSelectedGender(g)} className={`flex-1 py-3 rounded-2xl border-2 transition-all font-medium ${selectedGender === g ? "border-purple-600 bg-white dark:bg-neutral-800 text-purple-600 shadow-sm" : "border-transparent text-gray-400"}`}>{g}</button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">상대 MBTI</label>
              <div className="grid grid-cols-4 gap-2">
                {MBTI_TYPES.map((m) => (
                  <button key={m} onClick={() => setSelectedMbti(m)} className={`py-2 text-[11px] font-bold rounded-xl border transition-all ${selectedMbti === m ? "bg-purple-600 text-white border-purple-600 shadow-md scale-105" : "bg-white dark:bg-neutral-800 text-gray-500 border-gray-200 hover:border-purple-300"}`}>{m}</button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">대화 상황</label>
              <div className="grid gap-2">
                {TOPICS.map((t) => (
                  <div key={t.id} className="space-y-2">
                    <button onClick={() => setSelectedTopic(t.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedTopic === t.id ? "border-purple-600 bg-white dark:bg-neutral-800" : "border-transparent bg-white dark:bg-neutral-900/50"}`}>
                      <div className="text-left">
                        <p className={`font-bold text-sm ${selectedTopic === t.id ? "text-purple-600" : "text-gray-900 dark:text-white"}`}>{t.label}</p>
                        <p className="text-[11px] text-gray-500">{t.desc}</p>
                      </div>
                      {selectedTopic === t.id && <Check className="w-5 h-5 text-purple-600" />}
                    </button>
                    {t.id === "custom" && selectedTopic === "custom" && (
                      <textarea value={customTopicText} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCustomTopicText(e.target.value)} placeholder="예: 어제 싸우고 아직 화해 안 한 상태..." className="w-full p-4 rounded-xl text-sm bg-white dark:bg-neutral-900 border border-gray-200 outline-none resize-none" rows={3} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <button onClick={handleStartChat} disabled={isLoading || !selectedMbti} className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> 가상 대화 시작하기</>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-950">
      <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-black">{selectedMbti?.[0] || "?"}</div>
          <div>
            <h2 className="font-bold text-sm">{selectedMbti} ({selectedGender})</h2>
            <p className="text-[11px] text-gray-500">{selectedTopic === "custom" ? "커스텀 상황" : TOPICS.find(t => t.id === selectedTopic)?.label}</p>
          </div>
        </div>
        <ShieldCheck className="w-5 h-5 text-purple-500 opacity-50" />
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-3xl px-5 py-3 shadow-sm ${msg.role === "user" ? "bg-purple-600 text-white rounded-tr-none" : "bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-200/50"}`}>
              <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.content || (msg.role === 'assistant' && isLoading && "...")}</p>
              <span className="text-[10px] mt-1.5 block opacity-60 text-right">{msg.time}</span>
            </div>
          </div>
        ))}
      </main>

      <footer className="p-4 md:p-6 border-t border-gray-100 dark:border-white/5">
        <form className="max-w-4xl mx-auto flex gap-2 items-end" onSubmit={handleSendMessage}>
          <textarea rows={1} value={input} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="메시지 입력..." className="flex-1 p-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-3xl outline-none text-sm resize-none focus:ring-2 focus:ring-purple-500" />
          <button type="submit" className="p-4 bg-purple-600 text-white rounded-2xl disabled:opacity-30 transition-all shadow-lg shadow-purple-500/20" disabled={!input.trim() || isLoading}><Send className="w-5 h-5" /></button>
        </form>
      </footer>
    </div>
  );
}