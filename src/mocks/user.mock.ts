import Profile from "@/assets/images/profile_default.jpg";
import { User } from "@/types/user";

export const userMock: User = {
  email: "test@example.com",
  password: "securePassword123!",
  nickname: "홍길동",
  comment: "베인, 마이, 야스오 장인입니다.",
  profile_image: Profile.src,
};
