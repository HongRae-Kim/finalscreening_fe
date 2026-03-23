import Avatar from "@/components/common/Avatar";
import CircleBtn from "@/components/common/button/CircleBtn";
import { API_BASE } from "@/lib/clientApi";
import { showToast } from "@/lib/toast";
import { MyProfile } from "@/types/profile";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface ProfileImageProps {
  profileImage: string | undefined;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<MyProfile | null, Error>>;
}

export default function ProfileImageSection({
  profileImage,
  refetch,
}: ProfileImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${API_BASE}/api/v1/users/me/image`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        showToast.error("이미지 업로드에 실패했습니다.");
      }
    },
    onSuccess: () => {
      refetch();
      showToast.success("이미지가 성공적으로 변경되었습니다.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error) => {
      showToast.error(error.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const handleEditClick = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="relative">
      <Avatar size="xl" src={profileImage ?? undefined} type="profile" />
      <CircleBtn
        size="xs"
        className="bg-accent absolute right-0 bottom-0"
        onClick={handleEditClick}
        disabled={uploadMutation.isPending}
      >
        <Pencil size={15} strokeWidth={3} />
      </CircleBtn>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
}
