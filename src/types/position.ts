import Top from "@/assets/icons/role/top.svg";
import TopActive from "@/assets/icons/role/top-active.svg";
import Jungle from "@/assets/icons/role/jug.svg";
import JungleActive from "@/assets/icons/role/jug-active.svg";
import Mid from "@/assets/icons/role/mid.svg";
import MidActive from "@/assets/icons/role/mid-active.svg";
import Adc from "@/assets/icons/role/bot.svg";
import AdcActive from "@/assets/icons/role/bot-active.svg";
import Support from "@/assets/icons/role/sup.svg";
import SupportActive from "@/assets/icons/role/sup-active.svg";

export const POSITION = [
  "ANY",
  "TOP",
  "JUNGLE",
  "MID",
  "ADC",
  "SUPPORT",
] as const;

export type Position = (typeof POSITION)[number];

export const positionIcons = {
  TOP: Top,
  JUNGLE: Jungle,
  MID: Mid,
  ADC: Adc,
  SUPPORT: Support,
} as const;

export const activePositionIcons = {
  TOP: TopActive,
  JUNGLE: JungleActive,
  MID: MidActive,
  ADC: AdcActive,
  SUPPORT: SupportActive,
} as const;
