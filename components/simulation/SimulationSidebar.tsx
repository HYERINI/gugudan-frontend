"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, MessageSquare, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { ChatSession } from "./Simulation";

interface SidebarProps {
  selectedChatId: string | null;
  onSelectChat: (id: string | null) => void;
  refreshKey?: number;
}

export default function SimulationSidebar({ selectedChatId, onSelectChat, refreshKey }: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // 세션 목록 가져오기
  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/simulation/list`, {
        credentials: "include",
      });
      if (response.ok) {
        const data: ChatSession[] = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions, refreshKey]);

  // 삭제 함수
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 버튼 클릭 시 채팅방 선택되는 것 방지
    if (!confirm("이 대화를 삭제하시겠습니까?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/simulation/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        if (selectedChatId === id) onSelectChat(null);
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 요청 오류:", error);
    } finally {
      setDeletingId(null);
      setActiveMenuId(null);
    }
  };

  return (
    <aside className="w-72 flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full border-r border-purple-100 dark:border-gray-700 relative shadow-lg">
      <div className="p-4 border-b border-purple-100 dark:border-gray-700">
        <button 
          onClick={() => onSelectChat(null)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" /> 새 시뮬레이션
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="px-3 text-[11px] font-bold text-gray-400 dark:text-pink-300 uppercase tracking-widest mb-2 mt-2">최근 대화</p>
        
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-gray-400 dark:text-pink-400" /></div>
        ) : (
          sessions.length > 0 ? (
            sessions.map((chat) => (
              <div key={chat.id} className="relative group">
                <button
                onClick={() => onSelectChat(chat.id)}
                className={`w-full p-3 rounded-xl transition-all text-left border flex items-center gap-3 pr-10 relative group/btn ${
                  selectedChatId === chat.id 
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 shadow-md" 
                    : "border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md dark:hover:shadow-lg"
                }`}
              >
                <MessageSquare 
                  className={`w-4 h-4 shrink-0 ${
                    selectedChatId === chat.id ? "text-purple-600 dark:text-pink-400" : "text-gray-400 dark:text-pink-400 group-hover/btn:text-purple-500 dark:group-hover/btn:text-pink-400"
                  }`} 
                />
                <div className="flex-1 overflow-hidden">
                  <p className={`text-sm font-bold truncate transition-colors ${
                    selectedChatId === chat.id 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" 
                      : "text-gray-700 dark:text-pink-200 group-hover/btn:text-gray-900 dark:group-hover/btn:text-pink-100"
                  }`}>
                    {chat.mbti}({chat.gender}) - {chat.topic}
                  </p>
                  <p className={`text-[10px] truncate mt-0.5 transition-colors ${
                    selectedChatId === chat.id ? "text-purple-600/80 dark:text-pink-300/80" : "text-gray-500 dark:text-pink-300 group-hover/btn:text-gray-600 dark:group-hover/btn:text-pink-200"
                  }`}>
                    {chat.last_message && chat.last_message.trim() !== "" 
                      ? chat.last_message 
                      : "새로운 대화가 시작되었습니다 ✨"}
                  </p>
                </div>
              </button>

                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === chat.id ? null : chat.id);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-500 dark:text-pink-400"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* 드롭다운 메뉴 */}
                {activeMenuId === chat.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                    <div className="absolute right-2 top-10 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 py-1">
                      <button
                        onClick={(e) => handleDelete(e, chat.id)}
                        disabled={deletingId === chat.id}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        {deletingId === chat.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        삭제하기
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-xs text-gray-400 dark:text-pink-300">대화 내역이 없습니다.</div>
          )
        )}
      </div>
    </aside>
  );
}