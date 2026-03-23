import { UserList } from "@/types/userList";

export const userListMock: UserList = {
  totalCount: 2,                    // 검색 결과 총 유저 수

  users: [
    {
      userId: 10,                   // 유저 ID

      nickname: "커뮤니티닉네임",    // 커뮤니티 닉네임 (왼쪽 크게 표시)
      profileImageUrl: null,        
      bio: "프로필 소개 내용",       // 프로필 한 줄 소개
      gameAccount: {                // 게임 계정 연동 정보
        linked: true,               // 게임 계정 연동 여부

        gameName: "게임닉네임",     // 게임 닉네임
        tagLine: "#1234"            // 태그 → UI: 게임닉네임#1234
      }
    },

    {
      userId: 11,

      nickname: "커뮤니티닉네임2",

      profileImageUrl: null,

      bio: "프로필 소개 내용2",

      gameAccount: {
        linked: false               // 연동 안 된 경우 "연동 데이터 없음" 표시
      }
    }
  ]
}
