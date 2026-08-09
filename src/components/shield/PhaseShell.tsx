import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ShieldLogo } from "./ShieldLogo";
import { useAssessment } from "@/lib/assessment/store";

interface Props {
  children: ReactNode;
  progress?: { current: number; total: number; label?: string };
  maxWidth?: string;
}

export function PhaseShell({ children, progress, maxWidth = "max-w-3xl" }: Props) {
  const s = useAssessment();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 font-sans">
        <ShieldLogo />
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="h-2 w-2 rounded-full bg-[color:var(--success)]" />
            Passive scan · No installation
          </span>
          {s.phase !== "results" && (
            <a
              href={s.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--cyan)]/35 bg-[color:var(--cyan)]/10 px-4 py-2 text-xs font-bold text-[color:var(--cyan-glow)] transition-all hover:bg-[color:var(--cyan)]/20 active:scale-97 hover:scale-102 shadow-[0_4px_20px_-8px_rgba(85,225,245,0.3)] hover:shadow-[0_4px_20px_rgba(85,225,245,0.4)]"
            >
              Book Consultation
            </a>
          )}
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
