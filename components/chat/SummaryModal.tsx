"use client";

import { useEffect, useState } from "react";
import { DocumentArrowDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/modal/Modal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface SummaryModalProps {
  isOpen: boolean;
  roomId: string | null;
  onClose: () => void;
}

interface SummaryData {
  summary?: string;
  created_at?: string;
  [key: string]: unknown;
}

export function SummaryModal({ isOpen, roomId, onClose }: SummaryModalProps) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // 요약 데이터 가져오기
  useEffect(() => {
    if (!isOpen || !roomId) {
      setSummary("");
      setError(null);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation/rooms/${roomId}/summary`;

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers,
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError("요약 내용이 아직 생성되지 않았습니다.");
          } else {
            setError("요약을 불러오는 중 오류가 발생했습니다.");
          }
          setSummary("");
          return;
        }

        const data: SummaryData = await res.json();
        setSummary(data.summary || "요약 내용이 없습니다.");
      } catch (err) {
        console.error("Failed to fetch summary:", err);
        setError("요약을 불러오는 중 오류가 발생했습니다.");
        setSummary("");
      } finally {
        setLoading(false);
      }
    };

    void fetchSummary();
  }, [isOpen, roomId]);

  // PDF 다운로드
  const handleDownloadPdf = async () => {
    if (!roomId || downloadingPdf) return;

    setDownloadingPdf(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation/rooms/${roomId}/summary/pdf`;

      const headers: Record<string, string> = {};

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers,
      });

      if (!res.ok) {
        alert("PDF 다운로드에 실패했습니다.");
        return;
      }

      // PDF 파일로 다운로드
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `상담요약_${roomId}_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      alert("PDF 다운로드 중 오류가 발생했습니다.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <Modal open={isOpen} title="대화 요약" onClose={onClose}>
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <div className="text-gray-500">요약을 불러오는 중...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="text-red-500">{error}</div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
              <div className="text-gray-800 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-ul:text-gray-800 prose-ol:text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {summary || "요약 내용이 없습니다."}
                </ReactMarkdown>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={!summary || loading || downloadingPdf}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {downloadingPdf ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    다운로드 중...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    PDF 다운로드
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}