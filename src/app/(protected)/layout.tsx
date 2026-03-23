import { Fab } from "@/components/common/Fab";
import Header from "@/components/common/Nav/Header";
import { getMyProfile } from "@/services/users";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getMyProfile();

  return (
    <div className="scrollbar-hide mt-(--header-h) flex h-[calc(100dvh-var(--header-h))] flex-col overflow-y-auto">
      <Header type="full" userData={userData} />
      <div className="m-auto w-(--content-area) max-w-full flex-1">
        <main className="h-full w-full">{children}</main>
      </div>
      <Fab currentUserData={userData} />
    </div>
  );
}
