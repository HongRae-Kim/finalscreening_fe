export type ChatRoomsResponseDto = {
  chatRooms: {
    chatRoomId: number;
    isActive: boolean;
    lastActivityAt: string;
    unreadCount: number;
    memo: string | null;
    lastMessage: {
      chatMessageId: number;
      content: string;
      createdAt: string;
    } | null;
    otherUser: {
      userId: number;
      nickname: string;
      profileImage: string | null;
    };
  }[];
  nextCursor: string | null;
  hasNext: boolean;
};

export type ChatRoomDetailDto = {
  chatRoomId: number;
  postId: number;
  isOpen: boolean;
  createdAt: string;
  myRole: "SENDER" | "RECEIVER" | string;
  otherLeft: boolean;
  myLeft: boolean;
  otherUser: {
    userId: number;
    nickname: string;
    profileImage: string | null;
    gameNickname: string;
    gameTag: string;
  };
  queueType: string;
  memo: string;
  postStatus: string;
};

export type ChatMessagesResponseDto = {
  chatRoomId: number;
  header: {
    otherUser: {
      userId: number;
      nickname: string;
      profileImage: string | null;
    };
    postSummary: {
      postId: number;
      queueType: string;
      memo: string;
    };
    postStatus: string;
  };
  messages: ChatMessageDto[];
  nextCursor: number | null;
  hasNext?: boolean;
};

export type ChatMessageDto = {
  chatMessageId: number;
  senderId: number;
  content: string;
  messageType: string;
  createdAt: string;
};

export type createChatRoomResponse = {
  chatRoomId: number;
  postId: number;
  otherUserId: number;
};
