import { twMerge } from "tailwind-merge";

interface FindCardContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function FindCardContainer({
  className,
  children,
}: FindCardContainerProps) {
  return (
    <div
      className={twMerge(
        "bg-bg-primary border-border-primary text-content-primary rounded-xl border p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
