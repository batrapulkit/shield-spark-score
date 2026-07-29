import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ShieldLogo } from "./ShieldLogo";

interface Props {
  children: ReactNode;
  progress?: { current: number; total: number; label?: string };
  maxWidth?: string;
}

export function PhaseShell({ children, progress, maxWidth = "max-w-3xl" }: Props) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <ShieldLogo />
        <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[color:var(--success)]" />
            Passive scan · No installation
          </span>
        </div>
      </header>

      {progress ? (
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{progress.label ?? "Progress"}</span>
            <span>
              {progress.current} / {progress.total}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--cyan-glow), var(--cyan))",
              }}
              initial={{ width: 0 }}
              animate={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      ) : null}

      <main className={`mx-auto ${maxWidth} px-6 py-8 sm:py-14`}>{children}</main>
    </div>
  );
}
