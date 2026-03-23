"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import good from "@/assets/images/emoji/emoji_good.png";
import normal from "@/assets/images/emoji/emoji_normal.png";
import bad from "@/assets/images/emoji/emoji_bad.png";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { ReviewDistribution } from "@/types/review";

type ReviewPercentType = "default" | "mini";

interface ReviewPercentProps {
  type: ReviewPercentType;
  distributionData: ReviewDistribution;
}

type Radius4 = [number, number, number, number];

const R_LEFT: Radius4 = [50, 0, 0, 50];
const R_RIGHT: Radius4 = [0, 50, 50, 0];
const R_BOTH: Radius4 = [50, 50, 50, 50];
const R_NONE: Radius4 = [0, 0, 0, 0];

export default function ReviewPercent({
  type = "default",
  distributionData,
}: ReviewPercentProps) {
  const ratios = distributionData?.ratios ?? { GOOD: 0, NORMAL: 0, BAD: 0 };

  const reviewData = [{ name: "percentBar", ...ratios }];

  const getBarRadius = (key: "GOOD" | "NORMAL" | "BAD"): Radius4 => {
    const ordered = [
      { k: "GOOD" as const, v: ratios.GOOD },
      { k: "NORMAL" as const, v: ratios.NORMAL },
      { k: "BAD" as const, v: ratios.BAD },
    ].filter((x) => x.v > 0);

    if (ordered.length === 0) return R_NONE;

    const first = ordered[0].k;
    const last = ordered[ordered.length - 1].k;

    if (first === last && key === first) return R_BOTH;
    if (key === first) return R_LEFT;
    if (key === last) return R_RIGHT;
    return R_NONE;
  };

  if (!distributionData) return null;

  return (
    <div
      className={twMerge(
        "text-content-primary flex min-h-5 min-w-0 flex-col",
        type === "mini" && "min-w-[310px]",
      )}
    >
      <p
        className={twMerge(
          "mb-5 text-center text-xl font-semibold",
          type === "mini" && "mb-2 w-[310px] text-start text-sm",
        )}
      >
        리뷰 분포
      </p>

      <div
        className={twMerge(
          "mb-3.5 h-[30px] min-h-5 w-full",
          type === "mini" && "mb-2 h-5",
        )}
      >
        {type === "mini" ? (
          <BarChart
            width={310}
            height={20}
            data={reviewData}
            layout="vertical"
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            stackOffset="expand"
          >
            <XAxis type="number" hide domain={[0, 1]} />
            <YAxis type="category" dataKey="name" hide />
            <Bar
              dataKey="GOOD"
              stackId="a"
              fill="#03AEDD"
              radius={getBarRadius("GOOD")}
            />
            <Bar
              dataKey="NORMAL"
              stackId="a"
              fill="#FF9D00"
              radius={getBarRadius("NORMAL")}
            />
            <Bar
              dataKey="BAD"
              stackId="a"
              fill="#FA084D"
              radius={getBarRadius("BAD")}
            />
          </BarChart>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
            minHeight={30}
            initialDimension={{ width: 810, height: 30 }}
          >
            <BarChart
              data={reviewData}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              stackOffset="expand"
            >
              <XAxis type="number" hide domain={[0, 1]} />
              <YAxis type="category" dataKey="name" hide />
              <Bar
                dataKey="GOOD"
                stackId="a"
                fill="#03AEDD"
                radius={getBarRadius("GOOD")}
              />
              <Bar
                dataKey="NORMAL"
                stackId="a"
                fill="#FF9D00"
                radius={getBarRadius("NORMAL")}
              />
              <Bar
                dataKey="BAD"
                stackId="a"
                fill="#FA084D"
                radius={getBarRadius("BAD")}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div
        className={twMerge(
          "flex items-center justify-between text-base [&>div>img]:w-[30px]",
          type === "mini" && "text-xs [&>div>img]:w-5",
        )}
      >
        <div className="flex items-center gap-2">
          <Image src={good} alt="good review emoji" />
          <span className="">
            {distributionData.distribution.GOOD}개
            <span className="text-[#10B5DC]">
              ({distributionData.ratios.GOOD}%)
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Image src={normal} alt="normal review emoji" />
          <span className="">
            {distributionData.distribution.NORMAL}개
            <span className="text-[#FFA106]">
              ({distributionData.ratios.NORMAL}%)
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Image src={bad} alt="bad review emoji" />
          <span className="">
            {distributionData.distribution.BAD}개
            <span className="text-[#FC3665]">
              ({distributionData.ratios.BAD}%)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
