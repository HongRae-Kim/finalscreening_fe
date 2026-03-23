import { twMerge } from "tailwind-merge";

interface TextInputProps extends React.ComponentPropsWithoutRef<"input"> {
  placeholder: string;
  className?: string;
  rightElement?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>; 
}

export default function TextInput({
  placeholder,
  className,
  rightElement,
  ref,
  ...inputProps
}: TextInputProps) {
  return (
    <div
      className={twMerge(
        "bg-bg-primary focus-within:border-content-secondary border-border-primary placeholder:text-content-tertiary text-content-primary flex h-15 items-center gap-3 rounded-xl border px-5 py-5 text-lg",
        className,
      )}
    >
      <input
        type="text"
        ref={ref}
        placeholder={placeholder}
        {...inputProps}
        className="placeholder:text-content-tertiary w-full py-2 outline-0"
      />
      {rightElement && (
        <div className="flex items-center shrink-0">
          {rightElement}
        </div>
      )}
    </div>
  );
}
