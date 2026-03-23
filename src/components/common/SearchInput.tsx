import { cva, VariantProps } from "class-variance-authority";
import { Search } from "lucide-react";
import { twMerge } from "tailwind-merge";

const searchInput = cva(
  "bg-bg-primary text-content-primary inline-flex items-center gap-3 rounded-full px-5 py-3 focus:border-border-secondary",
  {
    variants: {
      inputSize: {
        md: "h-10 min-w-75 text-sm",
        lg: "h-17.5 min-w-[525px] text-base",
      },
    },
    defaultVariants: {
      inputSize: "md",
    },
  },
);

type SearchInputTypes = "md" | "lg";

interface SearchInputProps
  extends
    React.ComponentPropsWithoutRef<"input">,
    VariantProps<typeof searchInput> {
  inputSize: SearchInputTypes;
  placeholder: string;
  className?: string;
}

export default function SearchInput({
  inputSize,
  placeholder,
  className,
  ...props
}: SearchInputProps) {
  return (
    <div className={twMerge(searchInput({ inputSize }), className)}>
      <Search
        size={inputSize === "md" ? 16 : 25}
        className="text-content-secondary"
      />
      <input
        type="text"
        placeholder={placeholder}
        className="placeholder:text-content-tertiary w-full py-2 outline-0"
        {...props}
      />
    </div>
  );
}
