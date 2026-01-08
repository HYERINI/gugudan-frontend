"use client";

import { useCallback, useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ChatRoomList } from "@/components/chat/ChatRoomList";
import { ChatRoomView } from "@/components/chat/ChatRoomView";

/** * 이미지 구조에 따른 정확한 임포트 경로
 * components - simulation - components 내부의 파일들 
 */
import SimulationSidebar from "@/components/simulation//SimulationSidebar";
import SimulationRoom from "@/components/simulation/SimulationRoom";

import {STORAGE_KEYS} from "@/lib/constants";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const isSimulation = searchParams.get("mode") === "simulation";
  const urlSimId = searchParams.get("id"); // 👈 URL에서 ID 읽기

  // 모바일 사이드바 토글 상태
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1) 일반 채팅용 상태
  const [roomId, setRoomId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.SELECTED_ROOM_ID);
  });

  // --- 추가된 시뮬레이션 전용 상태 (여기서 정의해야 에러가 안 납니다) ---
  const [selectedSimId, setSelectedSimId] = useState<string | null>(urlSimId);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // -- URL이 변경되면 selectedSimId 업데이트
  useEffect(() => {
    if (isSimulation && urlSimId) {
      setSelectedSimId(urlSimId);
    }
  }, [isSimulation, urlSimId]);

  // 2) 일반 채팅 로직
  const handleSelectRoom = useCallback((nextRoomId: string | null) => {
    setRoomId(nextRoomId);
    if (nextRoomId) localStorage.setItem(STORAGE_KEYS.SELECTED_ROOM_ID, nextRoomId);
    else localStorage.removeItem(STORAGE_KEYS.SELECTED_ROOM_ID);
    // 모바일에서 채팅 선택 시 사이드바 닫기
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  const handleRoomCreated = useCallback((newRoomId: string) => {
    setRoomId(newRoomId);
    localStorage.setItem(STORAGE_KEYS.SELECTED_ROOM_ID, newRoomId);
  }, []);

  // --- 시뮬레이션 모드 렌더링 ---
  if (isSimulation) {
    return (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Simulation...</div>}>
        <div className="flex h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden relative">
          {/* 모바일 오버레이 */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* 사이드바 */}
          <div className={`
            fixed md:static inset-y-0 left-0 z-50 md:z-auto
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
            <SimulationSidebar 
              key={refreshKey}
              selectedChatId={selectedSimId} 
              onSelectChat={(id: string | null) => {
                setSelectedSimId(id);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }} 
            />
          </div>
          
          {/* 메인 채팅 영역 */}
          <main className="flex-1 relative flex flex-col h-full overflow-hidden border-l border-purple-100 dark:border-gray-700">
            {/* 모바일 사이드바 토글 버튼 */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden absolute top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              aria-label="메뉴 열기"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <SimulationRoom 
              initialChatId={selectedSimId} 
              onNewChatStarted={() => setRefreshKey((prev: number) => prev + 1)}
            />
          </main>
        </div>
      </Suspense>
    );
  }

  // --- 일반 채팅 모드 렌더링 ---
  return (
    <div className="flex h-screen relative bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-950">
      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 사이드바 */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 md:z-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <ChatRoomList selectedRoomId={roomId} onSelect={handleSelectRoom} />
      </div>
      
      {/* 메인 채팅 영역 */}
      <div className="flex-1 relative bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-950">
        {/* 모바일 사이드바 토글 버튼 */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          aria-label="메뉴 열기"
        >
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <ChatRoomView roomId={roomId} onRoomCreated={handleRoomCreated} />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <ChatPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}