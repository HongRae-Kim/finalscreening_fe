import { MiniProfile } from "@/types/user";

export const MiniProfileMock: MiniProfile = {
  userId: 123,
  nickname: "커뮤니티닉네임",
  profileImageUrl: "https://cdn.example.com/profile/123.png",
  comment: "인간시대의 끝이 도래했다",

  reviewSummary: {
    totalCount: 12,
    goodCount: 9,
    normalCount: 2,
    badCount: 1,
    goodRate: 75,
    normalRate: 17,
    badRate: 8,
  },

  isBlockedByMe: false, // 차단 여부
};
