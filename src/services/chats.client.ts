import ClientApi from "@/lib/clientApi";
import type {
  ChatRoomsResponseDto,
  ChatRoomDetailDto,
  ChatMessagesResponseDto,
  createChatRoomResponse,
} from "@/types/chat";

// 내가 속한 채팅방 목록 조회 (cursor/size는 추후 확장 대비)
export async function getChatRooms(params?: {
  cursor?: string;
  size?: number;
}): Promise<ChatRoomsResponseDto> {
  // mock 데이터용 코드 (UI 점검 목적 / 나중에 삭제 예정)
  const USE_CHAT_MOCK = process.env.NEXT_PUBLIC_USE_CHAT_MOCK === "1";

  if (USE_CHAT_MOCK) {
    return {
      chatRooms: [
        {
          chatRoomId: 1,
          isActive: true,
          lastActivityAt: new Date().toISOString(),
          unreadCount: 2,
          memo: "테스트 메모",
          lastMessage: {
            chatMessageId: 101,
            content: "UI 점검용 마지막 메시지입니다.",
            createdAt: new Date().toISOString(),
          },
          otherUser: {
            userId: 999,
            nickname: "테스트유저",
            profileImage: null,
          },
        },
        {
          chatRoomId: 2,
          isActive: true,
          lastActivityAt: new Date().toISOString(),
          unreadCount: 0,
          memo: null,
          lastMessage: null,
          otherUser: {
            userId: 998,
            nickname: "빈메시지유저",
            profileImage: null,
          },
        },
      ],
      nextCursor: null,
      hasNext: false,
    };
  }
  const qs = new URLSearchParams();

  if (params?.size) qs.set("size", String(params.size));
  if (params?.cursor) qs.set("cursor", params.cursor);

  const query = qs.toString();
  const path = query ? `/api/v1/chats?${query}` : `/api/v1/chats`;

  const res = await ClientApi(path, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`getChatRooms failed: ${res.status} ${text}`);
  }

  return (await res.json()) as ChatRoomsResponseDto;
}

// 채팅방 상세 조회
export async function getChatRoomDetail(
  chatId: string,
): Promise<ChatRoomDetailDto> {
  const res = await ClientApi(`/api/v1/chats/${chatId}`, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `getChatRoomDetail failed(chatId=${chatId}): ${res.status} ${text}`,
    );
  }

  return (await res.json()) as ChatRoomDetailDto;
}

// 채팅방 메시지 조회
export async function getChatMessages(
  chatId: string,
  params?: {
    cursor?: string;
    size?: number;
  },
): Promise<ChatMessagesResponseDto> {
  const qs = new URLSearchParams();

  if (params?.size) qs.set("size", String(params.size));
  if (params?.cursor) qs.set("cursor", params.cursor);

  const query = qs.toString();
  const path = query
    ? `/api/v1/chats/${chatId}/messages?${query}`
    : `/api/v1/chats/${chatId}/messages`;

  const res = await ClientApi(path, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `getChatMessages failed(chatId=${chatId}): ${res.status} ${text}`,
    );
  }

  return (await res.json()) as ChatMessagesResponseDto;
}

export async function createChatRoom(payload: {
  postId: number;
}): Promise<createChatRoomResponse> {
  const res = await ClientApi(`/api/v1/chats`, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: JSON.stringify(payload), // Swagger: { "postId": number }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`createChatRoom failed: ${res.status} ${text}`);
  }

  return (await res.json()) as createChatRoomResponse; // Swagger: { chatRoomId, postId, otherUserId }
}

// 메시지 읽음 처리
export async function markMessagesAsRead(
  chatRoomId: string,
  lastReadMessageId: number,
): Promise<{
  chatRoomId: number;
  lastReadMessageId: number;
  lastReadAt: string;
}> {
  const res = await ClientApi(`/api/v1/chats/${chatRoomId}/messages/read`, {
    method: "POST",
    body: JSON.stringify({ lastReadMessageId }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `markMessagesAsRead failed(chatRoomId=${chatRoomId}): ${res.status} ${text}`,
    );
  }

  return await res.json();
}

// 채팅방 나가기
export async function leaveChatRoom(
  chatRoomId: string,
): Promise<{ chatRoomId: number; isClosed: boolean; isFullyClosed: boolean }> {
  const res = await ClientApi(`/api/v1/chats/${chatRoomId}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `leaveChatRoom failed(chatRoomId=${chatRoomId}): ${res.status} ${text}`,
    );
  }

  return (await res.json()) as {
    chatRoomId: number;
    isClosed: boolean;
    isFullyClosed: boolean;
  };
}
