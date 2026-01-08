"use client";

import {STORAGE_KEYS} from "@/lib/constants";

export function startNewChat(router: { push: (url: string) => void }, url = "/chat") {
  localStorage.removeItem(STORAGE_KEYS.SELECTED_ROOM_ID);
  router.push(url);
}

export function openChatRoom(router: { push: (url: string) => void }, roomId: string, url = "/chat") {
  localStorage.setItem(STORAGE_KEYS.SELECTED_ROOM_ID, roomId);
  router.push(url);
}

export function clearChatSelection() {
  localStorage.removeItem(STORAGE_KEYS.SELECTED_ROOM_ID);
}
