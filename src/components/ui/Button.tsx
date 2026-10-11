import clsx from "clsx";
import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "green" | "danger-outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "border-blue bg-blue text-white shadow-[0_2px_8px_rgba(26,92,244,.25)] hover:border-blue-600 hover:bg-blue-600",
  secondary: "border-line bg-white hover:border-[#d8deea] hover:bg-surface-2",
  green: "border-green bg-green text-white shadow-[0_2px_6px_rgba(16,145,94,.25)] hover:border-green-600 hover:bg-green-600",
  "danger-outline": "border-[#f6c5c5] bg-[#fff6f6] text-[#e23b3b] hover:bg-[#ffeded]",
  ghost: "border-transparent bg-transparent hover:bg-surface-2",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-[30px] gap-1.5 rounded-lg px-2.5 text-[12.5px]",
  md: "h-[38px] gap-2 rounded-[9px] px-[15px] text-[13.5px]",
  lg: "h-[46px] gap-2 rounded-[10px] px-[22px] text-[14px]",
};

const iconSizes: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 18 };

/** Button classes, for links that look like buttons. */
export function buttonClass(variant: ButtonVariant = "secondary", size: ButtonSize = "md", className?: string) {
  return clsx(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap border font-medium transition-colors duration-150",
    "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
}

export function Button({ variant = "secondary", size = "md", icon: Icon, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {Icon && <Icon size={iconSizes[size]} strokeWidth={1.8} aria-hidden className="shrink-0" />}
      {children}
    </button>
  );
}

interface IconButtonProps extends Omit<ComponentProps<"button">, "children"> {
  icon: LucideIcon;
  "aria-label": string;
  iconSize?: number;
}

export function IconButton({ icon: Icon, iconSize = 18, className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-grid size-8 shrink-0 place-items-center rounded-lg text-[#4a5675] transition-colors duration-150 hover:bg-gray-50",
        "disabled:pointer-events-none disabled:opacity-45",
        className,
      )}
      {...rest}
    >
      <Icon size={iconSize} strokeWidth={1.8} aria-hidden />
    </button>
  );
}
