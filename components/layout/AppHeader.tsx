"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, STORAGE_KEYS } from "@/lib/constants";
import { scrollToId } from "@/lib/utils";
import { UserRole } from "@/types/auth";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

const NAV_ITEMS = [
  { id: "start", label: "시작하기" },
  { id: "about", label: "러브노트는?" },
  { id: "mbti", label: "MBTI" },
  { id: "team", label: "개발팀" },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const dragStartY = useRef<number>(0);
  const dragCurrentY = useRef<number>(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const close = () => {
    setOpen(false);
    setDragOffset(0);
    setIsExpanded(false);
  };

  // 스크롤 가능 여부 체크
  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // 스크롤 함수
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  // 메뉴가 열릴 때 스크롤 가능 여부 체크
  useEffect(() => {
    if (open && isMobile) {
      // 약간의 지연 후 체크 (렌더링 완료 후)
      setTimeout(checkScrollability, 100);
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('scroll', checkScrollability);
        return () => container.removeEventListener('scroll', checkScrollability);
      }
    }
  }, [open, isMobile]);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open || isMobile) return;
    const onDown = (e: MouseEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) close();
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open, isMobile]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (path?: string) => {
    if (!path) return;
    close();
    router.push(path);
  };

  const onLogout = async () => {
    close();
    await logout();
  };

  const onNav = (id: NavId) => {
    close();
    const home = ROUTES.HOME ?? "/";
    const isHome = pathname === home;

    if (!isHome) {
      router.push(home + `#${id}`);
      return;
    }
    scrollToId(id);
  };

  // 드래그 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sheetRef.current) return;
    dragStartY.current = e.touches[0].clientY;
    dragCurrentY.current = dragStartY.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sheetRef.current) return;
    dragCurrentY.current = e.touches[0].clientY;
    const deltaY = dragCurrentY.current - dragStartY.current;
    
    if (isExpanded) {
      // 확장된 상태에서는 아래로만 드래그 가능
      if (deltaY > 0) {
        setDragOffset(deltaY);
      }
    } else {
      // 축소된 상태에서는 위/아래 모두 드래그 가능
      if (deltaY > 0) {
        // 아래로 드래그: 닫기
        setDragOffset(deltaY);
      } else {
        // 위로 드래그: 확장
        setDragOffset(deltaY);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isExpanded) {
      // 확장된 상태에서 아래로 100px 이상 드래그하면 닫기
      if (dragOffset > 100) {
        close();
      } else {
        // 아니면 원래 위치로 복귀
        setDragOffset(0);
      }
    } else {
      // 축소된 상태에서
      if (dragOffset > 100) {
        // 아래로 100px 이상 드래그하면 닫기
        close();
      } else if (dragOffset < -50) {
        // 위로 50px 이상 드래그하면 확장
        setIsExpanded(true);
        setDragOffset(0);
      } else {
        // 아니면 원래 위치로 복귀
        setDragOffset(0);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link href={ROUTES.HOME ?? "/"} className="shrink-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            러브노트
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-1 text-sm text-gray-700 dark:text-gray-300">
          {NAV_ITEMS.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => onNav(it.id)}
              className="px-3 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {it.label}
            </button>
          ))}
        </nav>

        {/* Right: Hamburger Only */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Admin Badge (선택사항) */}
          {isAuthenticated && isAdmin && (
            <span className="hidden sm:inline-flex text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-2 py-1 rounded-full">
              관리자
            </span>
          )}

          {/* Hamburger Menu */}
          <div className="relative">
            <button
              type="button"
              aria-label="menu"
              onClick={() => setOpen((v) => !v)}
              className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-colors text-gray-700 dark:text-gray-300"
            >
              <span className="text-lg leading-none">☰</span>
            </button>

            {/* Desktop dropdown */}
            {!isMobile && open && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-2"
              >
                {isAuthenticated && (
                  <>
                    <div className="px-2 py-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-1 mb-2">빠른 대화 시작</div>
                      
                      <button
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
                        onClick={() => {
                          close();
                          localStorage.removeItem(STORAGE_KEYS.SELECTED_ROOM_ID); // 기존 대화 ID 제거
                          router.push("/chat");
                        }}
                      >
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">이야기 시작하기</div>
                        </div>
                      </button>

                      <button
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
                        onClick={() => {
                          close();
                          router.push("/chat?mbti=INFP&topic=dating&mode=simulation");
                        }}
                      >
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">MBTI 시뮬레이션</div>
                        </div>
                      </button>
                    </div>

                    <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                  </>
                )}

                {/* 고객 지원 */}
                <div className="px-2 py-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-1 mb-2">고객 지원</div>
                  
                  <button
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
                    onClick={() => go("/faq")}
                  >
                    자주 묻는 질문
                  </button>

                  {isAuthenticated ? (
                    <button
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
                      onClick={() => go("/inquiry")}
                    >
                      1:1 문의
                    </button>
                  ) : (
                    <button
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      onClick={() => alert("로그인이 필요한 서비스입니다.")}
                    >
                      1:1 문의 (로그인 필요)
                    </button>
                  )}
                </div>

                <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />

                {/* 계정 */}
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {user?.nickname ?? "사용자"}님
                        {isAdmin && (
                          <span className="ml-1 text-blue-600 dark:text-blue-400 font-semibold">
                            (관리자)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">계정</div>
                    </div>

                    <button
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
                      onClick={() => go(ROUTES.MY_PAGE)}
                    >
                      My Page
                    </button>

                    <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />

                    <button
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors"
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-900 dark:text-gray-100"
                    onClick={() => go(ROUTES.LOGIN)}
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile bottom sheet - 가로 스크롤 */}
          {isMobile && open && (
            <div className="fixed inset-0 z-50 pointer-events-none">
              <div 
                className="absolute inset-0 bg-black/20 dark:bg-black/40 transition-opacity"
                onClick={close} 
              />
              <div 
                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl pointer-events-auto border-t border-gray-200 dark:border-gray-700"
                style={{ 
                  height: 'auto',
                  maxHeight: '200px',
                }}
              >
                {/* 닫기 버튼 */}
                <div className="px-4 py-2 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={close}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium text-sm transition-colors"
                    aria-label="닫기"
                  >
                    닫기
                  </button>
                </div>
                
                {/* 가로 스크롤 메뉴 */}
                <div className="relative">
                  {/* 왼쪽 화살표 */}
                  {canScrollLeft && (
                    <button
                      type="button"
                      onClick={scrollLeft}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-r-lg shadow-lg transition-colors"
                      aria-label="왼쪽으로 스크롤"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  
                  {/* 오른쪽 화살표 */}
                  {canScrollRight && (
                    <button
                      type="button"
                      onClick={scrollRight}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-l-lg shadow-lg transition-colors"
                      aria-label="오른쪽으로 스크롤"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}

                  <div 
                    ref={scrollContainerRef}
                    className="overflow-x-auto overflow-y-hidden scrollbar-hide"
                    onScroll={checkScrollability}
                  >
                    <div className="flex gap-2 px-4 py-3 min-w-max">
                    {/* 빠른 대화 시작 */}
                    {isAuthenticated && (
                      <>
                        <button
                          className="flex-shrink-0 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm whitespace-nowrap transition-colors"
                          onClick={() => {
                            close();
                            localStorage.removeItem(STORAGE_KEYS.SELECTED_ROOM_ID);
                            router.push("/chat");
                          }}
                        >
                          이야기 시작하기
                        </button>
                        <button
                          className="flex-shrink-0 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm whitespace-nowrap transition-colors"
                          onClick={() => {
                            close();
                            router.push("/chat?mbti=INFP&topic=dating&mode=simulation");
                          }}
                        >
                          MBTI 시뮬레이션
                        </button>
                      </>
                    )}

                    {/* 고객 지원 */}
                    <button
                      className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium text-sm whitespace-nowrap transition-colors"
                      onClick={() => go("/faq")}
                    >
                      자주 묻는 질문
                    </button>

                    {isAuthenticated ? (
                      <button
                        className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium text-sm whitespace-nowrap transition-colors"
                        onClick={() => go("/inquiry")}
                      >
                        1:1 문의
                      </button>
                    ) : (
                      <button
                        className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-400 dark:text-gray-500 font-medium text-sm whitespace-nowrap transition-colors cursor-not-allowed"
                        onClick={() => alert("로그인이 필요한 서비스입니다.")}
                      >
                        1:1 문의
                      </button>
                    )}

                    {/* 계정 */}
                    {isAuthenticated ? (
                      <>
                        <button
                          className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium text-sm whitespace-nowrap transition-colors"
                          onClick={() => go(ROUTES.MY_PAGE)}
                        >
                          My Page
                        </button>
                        <button
                          className="flex-shrink-0 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm whitespace-nowrap transition-colors"
                          onClick={onLogout}
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <button
                        className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium text-sm whitespace-nowrap transition-colors"
                        onClick={() => go(ROUTES.LOGIN)}
                      >
                        Login
                      </button>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}