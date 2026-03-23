import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

const KST = "Asia/Seoul";

export default function formatChatTime(date: string) {
  // ISO-8601 + timezone 이 보장되므로 그대로 KST 변환만 하면 됨
  return dayjs(date).tz(KST).format("A h:mm");
}
