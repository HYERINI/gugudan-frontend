import {HandThumbDownIcon, HandThumbUpIcon, DocumentIcon} from "@heroicons/react/24/outline";
import {HandThumbDownIcon as HandThumbDownSolid, HandThumbUpIcon as HandThumbUpSolid} from "@heroicons/react/24/solid";
import Image from "next/image";

interface Props {
  message_id?: number;
  role: "USER" | "ASSISTANT";
  content: string;
  user_feedback?: "LIKE" | "DISLIKE" | null;
  file_urls?: string[]; // ★ 서버 이미지 URL만
  onFeedback?: (msgId: number, score: "LIKE" | "DISLIKE") => void;
}
const IMAGE_EXTS = /\.(jpg|jpeg|png|webp|gif)($|\?)/i;

export function ChatMessage({
  message_id,
  role,
  content,
  user_feedback,
  file_urls,
  onFeedback,
}: Props) {  
const isUser = role === "USER";
return (
    <div className={`flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* 프로필 아이콘 */}
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
          {isUser ? "나" : "AI"}
        </div>
        
        <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
          {/* 파일/이미지 영역 */}
          {file_urls && file_urls.length > 0 && (
            <div className={`flex flex-wrap gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
              {file_urls.map((url, idx) => {
                const isRealUrl = url && url.startsWith('http');
                const isImage = IMAGE_EXTS.test(url);
                const fileName = url.split('/').pop()?.split('?')[0] || "첨부 파일";

                // 1. 이미지 파일 렌더링 (정사각형 썸네일)
                if (isImage && isRealUrl) {
                  return (
                    <div key={idx} className="relative w-48 h-48 rounded-xl overflow-hidden border border-black/5 bg-gray-50 flex items-center justify-center shadow-sm">
                      <Image
                        src={url}
                        alt="첨부 이미지"
                        fill
                        unoptimized={true}
                        className="object-contain"
                      />
                    </div>
                  );
                }

                // 2. 일반 파일 렌더링 (가로형 문서 카드)
                if (isRealUrl) {
                  return (
                    <a 
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md min-w-[220px] max-w-[300px]
                        ${isUser 
                          ? "bg-blue-700/50 border-blue-400 text-white hover:bg-blue-700/70" 
                          : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${isUser ? "bg-blue-500" : "bg-white border border-gray-200"}`}>
                        <DocumentIcon className={`w-5 h-5 ${isUser ? "text-white" : "text-gray-500"}`} />
                      </div>
                      <div className="flex flex-col overflow-hidden text-left">
                        <span className="text-sm font-medium truncate">{fileName}</span>
                        <span className={`text-[10px] ${isUser ? "text-blue-100" : "text-gray-400"}`}>
                          클릭하여 파일 열기
                        </span>
                      </div>
                    </a>
                  );
                }

                // 3. URL 로딩 전 (서명된 URL 대기 중)
                return (
                  <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-gray-100 border border-dashed border-gray-300 w-48">
                    <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-500 animate-spin rounded-full" />
                    <span className="text-[10px] text-gray-400 font-medium">파일 준비 중...</span>
                  </div>
                );
              })}
            </div>
          )}
        {content && (
            <div
            className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap
                ${isUser
                ? "bg-blue-600 text-white rounded-tr-none"
                : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                }`}
            >
            {content}
            </div>
        )}
          {!isUser && content && message_id && onFeedback && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
              <button onClick={() => onFeedback(message_id, "LIKE")} className="p-1 hover:bg-gray-100 rounded transition-colors group">
                {user_feedback === "LIKE" ? (
                  <HandThumbUpSolid className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <HandThumbUpIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                )}              
                </button>
                <button onClick={() => onFeedback(message_id, "DISLIKE")} className="p-1 hover:bg-gray-100 rounded transition-colors group">
                {user_feedback === "DISLIKE" ? (
                  <HandThumbDownSolid className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <HandThumbDownIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}