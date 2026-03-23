"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import lolLogo from "@/assets/images/games/lol/lol-logo.png";
import lolBg from "@/assets/images/games/lol/lol-bg.jpg";
import overwatchLogo from "@/assets/images/games/overwatch/overwatch-logo.png";
import overwatchBg from "@/assets/images/games/overwatch/overwatch-bg.jpg";
import valorantLogo from "@/assets/images/games/valorant/valorant-logo.png";
import valorantBg from "@/assets/images/games/valorant/valorant-bg.jpg";
import { BoxButton } from "@/components/common/button/BoxButton";
import { useMenuStore } from "@/stores/menuStore";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

const games = [
  {
    id: "lol",
    name: "리그 오브 레전드",
    icon: lolLogo,
    bg: lolBg,
  },
  {
    id: "valorant",
    name: "발로란트",
    icon: valorantLogo,
    bg: valorantBg,
  },
  {
    id: "overwatch",
    name: "오버워치",
    icon: overwatchLogo,
    bg: overwatchBg,
  },
];

export default function HomePageContent() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const router = useRouter();
  const { setCurrentGame } = useMenuStore();
  const [offset, setOffset] = useState(260);

  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");

    const apply = () => {
      if (lg.matches) setOffset(260);
      else if (md.matches) setOffset(200);
      else setOffset(120);
    };

    apply();
    md.addEventListener("change", apply);
    lg.addEventListener("change", apply);

    return () => {
      md.removeEventListener("change", apply);
      lg.removeEventListener("change", apply);
    };
  }, []);

  const current = games[index];

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + games.length) % games.length);
  };

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % games.length);
  };

  const getVisibleGames = () => {
    const prevIndex = (index - 1 + games.length) % games.length;
    const nextIndex = (index + 1) % games.length;

    return [
      { ...games[prevIndex], position: "left" as const },
      { ...games[index], position: "center" as const },
      { ...games[nextIndex], position: "right" as const },
    ];
  };

  return (
    <section className="flex h-full w-full">
      <div className="flex h-full w-full flex-col items-center justify-center">
        {/* 콘텐츠 */}

        <div
          className="text-content-primary grid h-[82%] w-[90%] grid-cols-1 items-center justify-items-center bg-cover bg-center transition-[background-image]"
          style={{
            background: `
    linear-gradient(
      to bottom,
      var(--color-bg-secondary) 0%,
      
      rgba(0,0,0,0.5) 50%,
      var(--color-bg-secondary) 100%
    ),
    url(${current.bg.src}) center / cover no-repeat
  `,
          }}
        >
          <p className="text-content-primary text-center text-5xl leading-[1.4] font-bold max-lg:text-4xl max-md:text-3xl">
            플레이 할 게임을 선택하고
            <br />
            내게 딱 맞는 듀오를 찾아보세요
          </p>

          {/* 캐러셀 */}
          <div className="flex w-full items-center justify-around">
            <div>
              <button onClick={prev} className="cursor-pointer">
                <ChevronLeft
                  strokeWidth={0.5}
                  className="size-19.5 max-lg:size-15 max-md:size-10"
                />
              </button>
            </div>
            <div className="flex h-50 w-[598px] items-center justify-center">
              <AnimatePresence mode="popLayout" custom={direction}>
                {getVisibleGames().map((game) => {
                  const isCenter = game.position === "center";

                  return (
                    <motion.div
                      key={game.id}
                      custom={direction}
                      initial={{
                        x:
                          game.position === "left"
                            ? -offset
                            : game.position === "right"
                              ? offset
                              : 0,
                      }}
                      animate={{
                        x:
                          game.position === "left"
                            ? -offset
                            : game.position === "right"
                              ? offset
                              : 0,
                      }}
                      exit={{
                        x: direction === 1 ? -120 : 120,
                        opacity: 0,
                        scale: 0.6,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      className={`absolute flex items-center justify-center rounded-full ${isCenter ? "bg-bg-primary h-50 w-50 max-lg:h-40 max-lg:w-40 max-md:h-30 max-md:w-30" : "bg-bg-primary/80 h-32.5 w-32.5 max-lg:h-22.5 max-lg:w-22.5 max-md:h-15 max-md:w-15"}`}
                    >
                      <Image
                        src={game.icon}
                        alt={game.name}
                        className={
                          isCenter
                            ? "size-20 max-lg:size-15 max-md:size-10"
                            : "size-10 max-lg:size-8 max-md:size-5"
                        }
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div>
              <button onClick={next} className="cursor-pointer">
                <ChevronRight
                  strokeWidth={0.5}
                  className="size-19.5 max-lg:size-15 max-md:size-10"
                />
              </button>
            </div>
          </div>
          <div className="flex h-full flex-col items-center gap-10 self-start text-center">
            <p className="text-4xl font-semibold max-lg:text-3xl max-md:text-2xl">
              {current.name}
            </p>

            <BoxButton
              size="lg"
              tone={
                current.name === "리그 오브 레전드"
                  ? "gradient_positive"
                  : "black"
              }
              text="이 게임으로 듀오 찾기"
              className={twMerge(
                "shrink-0 self-center px-10 py-5 text-xl font-bold",
                current.name !== "리그 오브 레전드" && "pointer-events-none",
              )}
              onClick={() => {
                setCurrentGame(current.id);
                router.push(current.id);
              }}
              disabled={current.name !== "리그 오브 레전드"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
