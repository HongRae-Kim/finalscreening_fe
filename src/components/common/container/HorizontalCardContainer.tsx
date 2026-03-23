import { twMerge } from "tailwind-merge";

interface HorizontalCardContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function HorizontalCardContainer({
  className,
  children,
}: HorizontalCardContainerProps) {
  return (
    <div
      className={twMerge(
        "bg-bg-primary border-border-primary text-content-primary rounded-xl border px-5 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
