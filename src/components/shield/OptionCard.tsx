import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  hint?: string;
  index?: number;
  compact?: boolean;
}

export function OptionCard({ label, selected, onClick, hint, index = 0, compact }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex w-full items-center justify-between gap-4 rounded-2xl border p-5 text-left transition-all",
        compact ? "px-4 py-3" : "",
        selected
          ? "border-transparent shield-glow"
          : "border-ink/10 hover:border-ink/25",
      )}
      style={{
        background: selected
          ? "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 18%, var(--navy-2)), var(--navy-2))"
          : "color-mix(in oklab, white 4%, transparent)",
      }}
    >
      <div className="flex-1">
        <div className={cn("font-medium text-foreground", compact ? "text-sm" : "text-base")}>
          {label}
        </div>
        {hint ? (
          <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
        ) : null}
      </div>
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all",
          selected
            ? "border-cyan bg-cyan text-primary-foreground"
            : "border-ink/25 text-transparent group-hover:border-ink/50",
        )}
        style={{
          background: selected ? "var(--cyan)" : "transparent",
        }}
      >
        <Check size={14} strokeWidth={3} />
      </div>
    </motion.button>
  );
}
