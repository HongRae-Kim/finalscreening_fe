"use client";

import { Crown } from "lucide-react";
import CircleBtn from "../common/button/CircleBtn";
import Dropdown from "../common/Dropdown";
import FindHistoryCard from "./FindHistoryCard";
import { useEffect, useMemo, useState } from "react";
import { useMenuStore, useMyProfileMenuStore } from "@/stores/menuStore";
import { useMyParties } from "@/hooks/useMyParties";
import LoadingBouncy from "../common/loading/LoadingBouncy";
import { MyProfile } from "@/types/profile";
import { PostStatus } from "@/types/post";

type StatusFilter = "ALL" | PostStatus;

export default function FindHistoryContainer({
  loginData,
}: {
  loginData: MyProfile;
}) {
  const { setMenu } = useMenuStore();
  const { setMenu: setProfileMenu } = useMyProfileMenuStore();

  useEffect(() => {
    setMenu("profile");
    setProfileMenu("find-history");
  }, []);

  const { data, isLoading, isPending } = useMyParties(loginData.id);

  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [isLeader, setIsLeader] = useState(false);

  const parties = data?.data.parties ?? [];

  const filteredParties = useMemo(() => {
    return parties.filter((p) => {
      const statusOk = status === "ALL" ? true : p.status === status;
      const leaderOk = isLeader ? p.myRole === "LEADER" : true;
      return statusOk && leaderOk;
    });
  }, [parties, status, isLeader]);

  return (
    <div className="max-md:w-110">
      <div className="mb-5 flex items-center gap-2">
        <CircleBtn
          size="xs"
          className={
            isLeader ? "bg-accent text-white" : "bg-bg-quaternary text-white"
          }
          onClick={() => setIsLeader((prev) => !prev)}
        >
          <Crown size={16} />
        </CircleBtn>
        <Dropdown
          placeholder="게임을 선택해주세요"
          items={[
            { value: "ALL", label: "전체 게임" },
            { value: "LOL", label: "리그 오브 레전드" },
          ]}
          value="ALL"
          name="gameType"
          onValueChange={() => {}}
          className="min-w-42"
        />
        <Dropdown
          placeholder="모집글의 상태를 선택해주세요"
          items={[
            { value: "ALL", label: "전체 상태" },
            { value: "RECRUIT", label: "모집중" },
            { value: "ACTIVE", label: "모집완료" },
            { value: "CLOSED", label: "게임완료" },
          ]}
          value={status}
          name="gameType"
          onValueChange={(v) => setStatus(v as StatusFilter)}
          className="min-w-30"
        />
      </div>
      {isLoading || isPending ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingBouncy />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredParties.map((p, index) => (
            <FindHistoryCard
              key={index}
              PartyData={p}
              currentUserId={loginData.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
