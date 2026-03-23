"use client";

import * as React from "react";
import type { PostStatus } from "@/types/post";
import { getChatRooms } from "@/services/chats.client";
import type { ChatMessage } from "@/components/common/chat/ChatFrame";
import { useMemo } from "react";
import { wsService, type ChatWebSocketMessage } from "@/services/websocket";
import { useSearchParams } from "next/navigation";

export type ChatRoom = {
  id: string;
  game: string;
  title: string;
  state: PostStatus;
  headerUser: {
    profileImageUrl: string | null;
    gameNickname: string;
    gameTag?: string;
    communityNickname: string;
  };
  lastMessage: string;
  createdAt: string; // 목록에서는 lastActivityAt 역할
  unreadCount: number;
  messages: ChatMessage[];
};

export function useChatRooms(game: string) {
  const [rooms, setRooms] = React.useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string>("");

  const [isLoadingRooms, setIsLoadingRooms] = React.useState<boolean>(true);
  const [tab, setTab] = React.useState<"all" | "unread">("all");

  // 최신순 정렬(내림차순)
  const sortByLatest = React.useCallback((list: ChatRoom[]) => {
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, []);

  // 선택된 방을 WS handler에서 참조하기 위한 ref
  const selectedRoomIdRef = React.useRef<string>("");
  React.useEffect(() => {
    selectedRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  // roomId별 구독 상태 관리
  const subscribedRoomIdsRef = React.useRef<Set<string>>(new Set());
  const roomHandlersRef = React.useRef<
    Map<string, (m: ChatWebSocketMessage) => void>
  >(new Map());

  // 채팅방 참여하기 진입 처리
  const searchParams = useSearchParams();
  const initialRoomIdFromQuery = searchParams.get("roomId");

  // 채팅방 목록 최초 로드
  React.useEffect(() => {
    let cancelled = false;

    async function fetchRoomsOnce() {
      try {
        setIsLoadingRooms(true);

        const data = await getChatRooms(); // GET /api/v1/chats
        if (cancelled) return;

        const nextRooms: ChatRoom[] = data.chatRooms.map((r) => ({
          id: String(r.chatRoomId),
          game,
          title: r.memo ?? "",
          state: (r.isActive ? "RECRUITING" : "EXPIRED") as PostStatus,
          headerUser: {
            profileImageUrl: r.otherUser.profileImage,
            gameNickname: r.otherUser.nickname, // 목록 응답에는 gameNickname/gameTag가 없어서 임시
            gameTag: undefined,
            communityNickname: r.otherUser.nickname,
          },
          lastMessage: r.lastMessage?.content ?? "",
          createdAt: r.lastActivityAt,
          unreadCount: r.unreadCount ?? 0,
          messages: [],
        }));

        setRooms(sortByLatest(nextRooms));

        // 채팅방 참여하기로 진입한 경우(roomId 쿼리 존재 시)
        if (initialRoomIdFromQuery) {
          const exists = nextRooms.some(
            (r) => r.id === String(initialRoomIdFromQuery),
          );

          if (exists) {
            setSelectedRoomId(String(initialRoomIdFromQuery));
          }
        }

        // 기본 진입 시에는 자동으로 채팅방을 선택하지 않음
        setSelectedRoomId((prev) => prev);
      } catch (e) {
        console.warn(e);
        if (!cancelled) setRooms([]);
      } finally {
        if (!cancelled) setIsLoadingRooms(false);
      }
    }

    fetchRoomsOnce();

    return () => {
      cancelled = true;
    };
  }, [game, sortByLatest]);

  // rooms에 있는 모든 roomId를 “증분 구독”하여 목록을 실시간 갱신
  //    - rooms 전체가 바뀌더라도 “id 목록”만 보고 diff 처리
  const roomIds = React.useMemo(() => rooms.map((r) => r.id), [rooms]);
  const roomIdsKey = React.useMemo(() => roomIds.join(","), [roomIds]);

  React.useEffect(() => {
    const currentIds = new Set(roomIds);
    const subscribedIds = subscribedRoomIdsRef.current;

    // (A) 새로 추가된 방만 구독
    currentIds.forEach((roomId) => {
      if (subscribedIds.has(roomId)) return;

      const handler = (wsMessage: ChatWebSocketMessage) => {
        const incomingRoomId = String(wsMessage.chatRoomId);
        if (incomingRoomId !== roomId) return;

        setRooms((prev) => {
          const next = prev.map((r) => {
            if (r.id !== roomId) return r;

            const isSelected = selectedRoomIdRef.current === roomId;

            return {
              ...r,
              lastMessage: wsMessage.content,
              createdAt: wsMessage.createdAt, // lastActivityAt 역할
              unreadCount: isSelected ? 0 : (r.unreadCount ?? 0) + 1,
            };
          });

          return sortByLatest(next);
        });
      };

      roomHandlersRef.current.set(roomId, handler);
      subscribedIds.add(roomId);

      wsService.subscribe(roomId, handler).catch((err) => {
        console.error("[WebSocket] subscribe failed:", roomId, err);
      });
    });

    // (B) 목록에서 사라진 방은 구독 해제
    subscribedIds.forEach((roomId) => {
      if (currentIds.has(roomId)) return;

      wsService.unsubscribe(roomId);
      subscribedIds.delete(roomId);
      roomHandlersRef.current.delete(roomId);
    });

    // (C) 언마운트 시 전체 구독 해제
    return;
  }, [roomIdsKey, roomIds, sortByLatest]);

  // 페이지(훅) 언마운트 시에만 전체 구독 해제
  React.useEffect(() => {
    return () => {
      subscribedRoomIdsRef.current.forEach((roomId) => {
        wsService.unsubscribe(roomId);
      });
      subscribedRoomIdsRef.current.clear();
      roomHandlersRef.current.clear();
    };
  }, []);

  // 탭별 필터 + 최신순 정렬 유지
  const filteredRooms = useMemo(() => {
    const base =
      tab === "unread" ? rooms.filter((r) => r.unreadCount > 0) : rooms;
    return sortByLatest(base);
  }, [rooms, tab, sortByLatest]);

  return {
    rooms,
    setRooms,
    selectedRoomId,
    setSelectedRoomId,
    isLoadingRooms,
    tab,
    setTab,
    filteredRooms,
  };
}
