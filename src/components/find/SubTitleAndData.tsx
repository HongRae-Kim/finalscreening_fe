import { twMerge } from "tailwind-merge";

export default function SubTitleAndData({
  title,
  data,
  className,
}: {
  title: string;
  data: string;
  className?: string;
}) {
  return (
    <h5
      className={twMerge(
        "text-content-primary flex w-full items-center justify-between text-sm font-normal",
        className,
      )}
    >
      {title}
      <span className="font-semibold">{data}</span>
    </h5>
  );
}
