import MyProfileNav from "@/components/myprofile/MyProfileNav";

export default function MyprofileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-62.5 px-20 py-15 max-xl:gap-40 max-lg:gap-20 max-lg:px-(--global-padding) max-lg:py-10 max-md:flex-col max-md:gap-3 max-md:px-0 max-md:py-0">
      <MyProfileNav />
      <div className="mt-16 w-full max-lg:mt-10 max-md:flex max-md:justify-center">
        {children}
      </div>
    </div>
  );
}
