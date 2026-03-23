import Header from "@/components/common/Nav/Header";
import { getMyProfile } from "@/services/users";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getMyProfile();

  return (
    <div className="flex h-dvh flex-col">
      <Header type="compact" userData={userData} />
      <div className="m-auto mt-(--header-h) w-(--content-area) max-w-full flex-1">
        <main className="h-full w-full">{children}</main>
      </div>
    </div>
  );
}
