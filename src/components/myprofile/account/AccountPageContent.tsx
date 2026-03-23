"use client";

import { useMenuStore, useMyProfileMenuStore } from "@/stores/menuStore";
import { useEffect, useState } from "react";
import NicknameSection from "./NicknameSection";
import ProfileImageSection from "./ProfileImageSection";
import CommentSection from "./CommentSection";
import PasswordSection from "./PasswordSection";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile, userResgin } from "@/services/user.client";
import LoadingBouncy from "@/components/common/loading/LoadingBouncy";
import { BoxButton } from "@/components/common/button/BoxButton";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useRouter } from "next/navigation";

export default function AccountPageContent() {
  const router = useRouter();

  const { setMenu } = useMenuStore();
  const { setMenu: setProfileMenu } = useMyProfileMenuStore();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const {
    data: profileData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getMyProfile,
  });

  useEffect(() => {
    setMenu("profile");
    setProfileMenu("account");
  }, [setMenu, setProfileMenu]);

  if (isLoading) {
    return <LoadingBouncy />;
  }
  return (
    <div className="flex w-125 flex-col gap-11 max-lg:w-120 max-md:w-110 [&_h3]:text-xl [&_h3]:font-semibold">
      <h2 className="text-4xl font-bold max-md:hidden">계정 관리</h2>
      <div className="flex flex-col gap-9">
        <div className="flex items-center gap-10">
          <ProfileImageSection
            profileImage={profileData?.profileImage ?? undefined}
            refetch={refetch}
          />
          <NicknameSection
            initialNickname={profileData?.nickname ?? ""}
            nicknameUpdatedAt={profileData?.nicknameUpdatedAt ?? null}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3>이메일</h3>
          <span>{profileData?.email}</span>
        </div>

        <CommentSection initialComment={profileData?.comment ?? ""} />
        <PasswordSection />
        <BoxButton
          text="회원탈퇴"
          size="sm"
          onClick={async () => {
            setConfirmModalOpen(true);
          }}
        />
        <ConfirmModal
          open={confirmModalOpen}
          onOpenChange={setConfirmModalOpen}
          title="정말 탈퇴하시겠습니까?"
          description="탈퇴하면 다시 복구할 수 없습니다."
          confirmText="탈퇴"
          onConfirm={async () => {
            await userResgin();
            router.push(`/login`);
          }}
        />
      </div>
    </div>
  );
}
