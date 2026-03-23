"use client";

import { BoxButton } from "@/components/common/button/BoxButton";
import LinkedGameIdCard from "./LinkedGameIdCard";
import LinkGameIdBox from "./LinkGameIdBox";
import { useMenuStore, useMyProfileMenuStore } from "@/stores/menuStore";
import { useEffect, useState } from "react";
import { GameAccount } from "@/types/game-account";
import LinkGameIdFormModal from "./LinkGameIdFormModal";

export default function LinkedGameIdContainer({
  gameAccountData,
}: {
  gameAccountData: GameAccount[] | null;
}) {
  const { setMenu } = useMenuStore();
  const { setMenu: setProfileMenu } = useMyProfileMenuStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMenu("profile");
    setProfileMenu("link");
  }, []);

  return (
    <div>
      {gameAccountData === null || gameAccountData?.length ? (
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            {gameAccountData?.map((g, index) => (
              <LinkedGameIdCard key={index} gameAccountData={g} />
            ))}
          </div>
          <BoxButton
            text="새로운 아이디 연동"
            tone="color"
            size="lg"
            className="self-center max-md:h-13 max-md:text-base"
            onClick={() => setIsOpen(true)}
          />
          <LinkGameIdFormModal
            isOpen={isOpen}
            onOpenChange={(open) => setIsOpen(open)}
            mode="link"
          />
        </div>
      ) : (
        <LinkGameIdBox />
      )}
    </div>
  );
}
