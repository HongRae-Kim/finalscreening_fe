import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale("ko");

const KST = "Asia/Seoul";

export default function formatRelativeTime(date: string) {
  // 서버 시간이 UTC(Z 포함)든, 오프셋(+00:00)이든, 로컬이든
  // 항상 한국시간 기준으로 변환한 뒤 상대시간 계산
  return dayjs(date).tz(KST).fromNow();
}
