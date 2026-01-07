export type Role = "user" | "assistant";
export type Gender = "여성" | "남성";

export interface DBMessage {
  role: Role;
  content: string;
  timestamp: string;
}

export interface ChatDetailResponse {
  id: string;
  account_id: number;
  mbti: string;
  topic: string;
  gender: Gender;
  messages: DBMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  time: string;
}

export interface ChatSession {
  id: string;
  mbti: string;
  gender: string;
  topic: string;
  last_message?: string;
}

export interface Topic {
  id: string;
  label: string;
  desc: string;
}