import { ORDER_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: BadgeProps) {
  const found = ORDER_STATUSES.find((s) => s.value === status);
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize",
        found?.color || "bg-gray-100 text-gray-700",
        className
      )}
    >
      {found?.label || status}
    </span>
  );
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-block px-2 py-0.5 rounded-full text-xs font-semibold", className)}>
      {children}
    </span>
  );
}
