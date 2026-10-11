import clsx from "clsx";
import { avatarColors, initials } from "@/data/patients";

interface AvatarProps {
  name: string;
  size?: number;
  variant?: "patient" | "doctor";
  /** Green online dot, doctor variant only. */
  online?: boolean;
  className?: string;
}

export function Avatar({ name, size = 34, variant = "patient", online = false, className }: AvatarProps) {
  const isDoctor = variant === "doctor";
  const [bg, fg] = avatarColors(name);
  return (
    <span
      aria-hidden
      className={clsx(
        "relative inline-grid shrink-0 place-items-center rounded-full font-semibold tracking-[.01em]",
        isDoctor && "bg-linear-140 from-[#ffd9c7] to-[#f6b39a] text-[#7a2e12]",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        ...(isDoctor ? null : { background: bg, color: fg }),
      }}
    >
      {initials(name)}
      {isDoctor && online && (
        <i className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-[#16a34a]" />
      )}
    </span>
  );
}
