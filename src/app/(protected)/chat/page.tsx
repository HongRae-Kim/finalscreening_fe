"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { MessageCircle } from "lucide-react";

import ChatCard from "@/components/common/chat/ChatCard";
import ChatFrame from "@/components/common/chat/ChatFrame";

import { useMenuStore } from "@/stores/menuStore";

import { useChatRooms } from "@/hooks/chat/useChatRooms";
import { useChatRoomPanel } from "@/hooks/chat/useChatRoomPanel";

import { leaveChatRoom } from "@/services/chats.client";
import { wsService } from "@/services/websocket";

function SegmentedTabs() {
  return (
    <Tabs.List className="bg-bg-primary inline-flex rounded-full p-1">
      <Tabs.Trigger
        value="all"
        className={[
          "rounded-full px-4 py-2 text-sm",
          "text-content-secondary",
          "data-[state=active]:bg-bg-tertiary",
          "data-[state=active]:text-content-main",
          "outline-none",
        ].join(" ")}
      >
        전체
      </Tabs.Trigger>
      <Tabs.Trigger
        value="unread"
        className={[
          "rounded-full px-4 py-2 text-sm",
          "text-content-secondary",
          "data-[state=active]:bg-bg-tertiary",
          "data-[state=active]:text-content-main",
          "outline-none",
        ].join(" ")}
      >
        안 읽은 채팅방
      </Tabs.Trigger>
    </Tabs.List>
  );
}

function EmptyChatPanel() {
  return (
    <div className="border-border-primary bg-bg-secondary flex h-full w-full items-center justify-center rounded-xl border">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-bg-tertiary grid size-28 place-items-center rounded-2xl">
          <MessageCircle className="text-content-secondary size-10" />
        </div>
        <p className="text-content-secondary text-xl leading-relaxed">
          도착한 채팅을 확인하고
          <br />
          함께 파티를 즐겨봐요
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { setMenu } = useMenuStore();

  React.useEffect(() => {
    setMenu("chat");
  }, [setMenu]);

  // 폴더 구조가 /chat 이면 params가 없으니, 우선 임시로 고정
  const game = "lol"; // 실제 프로젝트의 game 결정 로직으로 교체해야함

  const {
    rooms,
    setRooms,
    selectedRoomId,
    setSelectedRoomId,
    isLoadingRooms,
    tab,
    setTab,
    filteredRooms,
  } = useChatRooms(game);

  const {
    isLoadingRight,
    isSending,
    rightHeaderUser,
    rightTitle,
    rightState,
    rightMessages,
    handleSend,

    // 추가
    isRoomDisabled,
    roomDisabledText,
  } = useChatRoomPanel(selectedRoomId, setRooms);

  const handleLeaveRoom = React.useCallback(
    async (roomId: string) => {
      const ok = window.confirm(
        "정말 채팅방을 나가시겠습니까?\n나가면 해당 채팅방은 닫히며 메시지 전송이 불가합니다.",
      );
      if (!ok) return;

      try {
        await leaveChatRoom(roomId);

        // 즉시 구독 해제 (선택 사항이지만 UX 안정적)
        wsService.unsubscribe(roomId);

        // 목록에서 제거
        setRooms((prev) => prev.filter((r) => r.id !== roomId));

        // 현재 보고 있는 방이면 선택 해제 → 대기화면
        setSelectedRoomId((prev) => (prev === roomId ? "" : prev));
      } catch (e) {
        console.error(e);
        alert("채팅방 나가기에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    },
    [setRooms, setSelectedRoomId],
  );

  return (
    <main className="min-h-0 w-full flex-1 overflow-hidden px-6 py-8">
      <div
        className="flex h-full w-full min-w-0 flex-col gap-8 lg:flex-row lg:items-start lg:justify-center"
        onClick={(e) => {
          const target = e.target as HTMLElement;

          // 좌/우 패널 내부 클릭이면 선택 해제하지 않음
          if (target.closest('[data-chat-surface="true"]')) return;

          setSelectedRoomId("");
        }}
      >
        <section
          data-chat-surface="true"
          className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-x-hidden lg:w-100"
        >
          <Tabs.Root
            value={tab}
            onValueChange={(v) => setTab(v as "all" | "unread")}
          >
            <div className="mb-4 flex items-center">
              <SegmentedTabs />
            </div>

            <Tabs.Content value="all" className="outline-none">
              <div className="flex h-full min-h-0 flex-col gap-4 overflow-x-hidden overflow-y-auto pr-1">
                {isLoadingRooms ? (
                  <p className="text-content-secondary px-2 py-6 text-sm">
                    채팅방을 불러오는 중...
                  </p>
                ) : filteredRooms.length === 0 ? (
                  <p className="text-content-secondary px-2 py-6 text-sm">
                    채팅방이 없어요.
                  </p>
                ) : (
                  filteredRooms.map((room) => (
                    <ChatCard
                      key={room.id}
                      avatarSrc={room.headerUser.profileImageUrl ?? ""}
                      nickname={room.headerUser.communityNickname}
                      createdAt={room.createdAt}
                      message={room.lastMessage}
                      subMessage={room.title}
                      unreadCount={room.unreadCount}
                      onClick={() => setSelectedRoomId(room.id)}
                      isSelected={room.id === selectedRoomId}
                      menuItems={[
                        {
                          label: "채팅방 나가기",
                          onSelect: () => handleLeaveRoom(room.id),
                        },
                      ]}
                    />
                  ))
                )}
              </div>
            </Tabs.Content>

            <Tabs.Content value="unread" className="outline-none">
              <div className="flex h-full min-h-0 flex-col gap-4 overflow-x-hidden overflow-y-auto pr-1">
                {isLoadingRooms ? (
                  <p className="text-content-secondary px-2 py-6 text-sm">
                    채팅방을 불러오는 중...
                  </p>
                ) : filteredRooms.length === 0 ? (
                  <p className="text-content-secondary px-2 py-6 text-sm">
                    채팅방이 없어요.
                  </p>
                ) : (
                  filteredRooms.map((room) => (
                    <ChatCard
                      key={room.id}
                      avatarSrc={room.headerUser.profileImageUrl ?? ""}
                      nickname={room.headerUser.communityNickname}
                      createdAt={room.createdAt}
                      message={room.lastMessage}
                      subMessage={room.title}
                      unreadCount={room.unreadCount}
                      onClick={() => setSelectedRoomId(room.id)}
                      isSelected={room.id === selectedRoomId}
                      menuItems={[
                        {
                          label: "채팅방 나가기",
                          onSelect: () => handleLeaveRoom(room.id),
                        },
                      ]}
                    />
                  ))
                )}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </section>

        <section
          data-chat-surface="true"
          className="flex h-full min-h-0 w-full min-w-0 flex-col lg:w-225"
        >
          {selectedRoomId ? (
            isLoadingRight || !rightHeaderUser || !rightState ? (
              <div className="border-border-primary bg-bg-secondary flex h-full w-full items-center justify-center rounded-xl border">
                <p className="text-content-secondary text-sm">
                  채팅 내용을 불러오는 중...
                </p>
              </div>
            ) : (
              <div className="flex h-full min-h-0 flex-col">
                {/* 이용 불가 문구 */}
                {isRoomDisabled && (
                  <div className="border-border-primary bg-bg-tertiary text-content-primary mb-3 rounded-xl border px-4 py-3 text-sm">
                    {roomDisabledText}
                  </div>
                )}

                <div className="min-h-0 flex-1">
                  <ChatFrame
                    widthClassName="w-full"
                    headerUser={rightHeaderUser}
                    title={rightTitle}
                    state={rightState}
                    messages={rightMessages}
                    onSend={(msg) => {
                      if (isRoomDisabled) return;
                      return handleSend(msg);
                    }}
                    // isSending을 OR 처리해서 Input도 같이 비활성화되게
                    isSending={isSending || isRoomDisabled}
                  />
                </div>
              </div>
            )
          ) : (
            <div className="h-full">
              <EmptyChatPanel />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
