export interface MyProfile {
  id: number;
  email: string;
  profileImage: string | null;
  nickname: string;
  comment: string | null;
  nicknameUpdatedAt: string | null;
}

export interface UserProfile {
  id: number;
  nickname: string;
  profile_image: string | null;
  comment: string | null;
  gameAccountId: number;
}
