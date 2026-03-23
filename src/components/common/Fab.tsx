"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import "@/css/pab.css";
import FindInfoModal from "../find/FindInfoModal";
import CircleBtn from "./button/CircleBtn";
import { MessageCircleMore, Plus, Users } from "lucide-react";
import { MyProfile } from "@/types/profile";

type View = "actions" | "find" | "chat";

export function Fab({
  currentUserData,
}: {
  currentUserData: MyProfile | null;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [view, setView] = React.useState<View>("actions");

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => {
    setIsOpen(false);
    setView("actions");
  };

  return (
    <>
      <div
        className="fixed right-6 bottom-6"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger asChild>
            <CircleBtn className="bg-gradient-positive h-13 w-13 transition-all outline-none hover:scale-[1.03] hover:shadow-[0px_0px_10px] hover:shadow-[#71E9D0]">
              <Plus size={35} />
            </CircleBtn>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              side="top"
              align="center"
              sideOffset={10}
              className="PabContent"
            >
              {view === "actions" ? (
                <>
                  <CircleBtn
                    onClick={() => setView("find")}
                    className="bg-bg-primary hover:shadow-bg-tertiary h-13 w-13 transition-all outline-none hover:scale-[1.03] hover:shadow-[0px_0px_10px]"
                  >
                    <Users size={25} strokeWidth={3} />
                  </CircleBtn>
                  <CircleBtn
                    onClick={() => setView("chat")}
                    className="bg-bg-primary hover:shadow-bg-tertiary h-13 w-13 transition-all outline-none hover:scale-[1.03] hover:shadow-[0px_0px_10px]"
                  >
                    <MessageCircleMore size={25} strokeWidth={3} />
                  </CircleBtn>
                </>
              ) : view === "find" ? (
                <FindInfoModal currentUserData={currentUserData} />
              ) : (
                <></>
              )}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </>
  );
}
