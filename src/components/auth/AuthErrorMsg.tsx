import { twMerge } from "tailwind-merge";

export default function AuthErrorMsg({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <p className={twMerge("text-negative mt-1 ml-2 text-sm", className)}>
      {message}
    </p>
  );
}
