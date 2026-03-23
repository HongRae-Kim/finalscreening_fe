import { twMerge } from "tailwind-merge";

interface FormModalContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function FormModalContainer({
  className,
  children,
}: FormModalContainerProps) {
  return (
    <div
      className={twMerge(
        "bg-bg-secondary border-border-primary text-content-primary rounded-xl border p-7.5",
        className,
      )}
    >
      {children}
    </div>
  );
}
