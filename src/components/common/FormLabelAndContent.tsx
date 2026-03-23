import { twMerge } from "tailwind-merge";

export function FormLabelAndContent({
  labelText,
  labelFor,
  children,
  className,
}: {
  labelText: string;
  labelFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge("flex flex-col gap-3", className)}>
      <label
        htmlFor={labelFor}
        className="text-content-secondary text-sm leading-none"
      >
        {labelText}
      </label>
      {children}
    </div>
  );
}
