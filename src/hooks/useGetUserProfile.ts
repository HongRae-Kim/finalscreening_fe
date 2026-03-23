import { getUserProfile } from "@/services/user.client";
import { UserProfile } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";

export default function useGetUserProfile(userId: number) {
  return useQuery<UserProfile | null>({
    queryKey: [userId, "profile"],
    enabled: !!userId,
    queryFn: () => getUserProfile(userId),
    staleTime: 60 * 60 * 1000,
  });
}
