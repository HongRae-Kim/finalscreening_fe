import ProfilePageContent from "@/components/profile/ProfilePageContent";
import {
  getMyProfile,
  getOtherGameAccount,
  getUserProfile,
} from "@/services/users";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const currentUserData = await getMyProfile();
  const profileData = await getUserProfile(id);
  const gameAccountData = await getOtherGameAccount(
    profileData?.gameAccountId ?? 0,
  );

  return (
    <ProfilePageContent
      profileData={profileData}
      gameAccountData={gameAccountData}
      currentUserData={currentUserData}
    />
  );
}
