import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
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
    <div className="flex min-h-screen flex-col">
              <header className="mx-auto w-full max-w-7xl flex items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-6 font-sans">
        <Link to="/" className="cursor-pointer transition-opacity hover:opacity-90 active:scale-97 shrink min-w-0">
          <div className="hidden sm:block">
            <ShieldLogo size={64} />
          </div>
          <div className="sm:hidden">
            <ShieldLogo size={28} />
          </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="h-2 w-2 rounded-full bg-[color:var(--success)]" />
            Passive scan · No installation
          </span>
          {s.phase !== "results" && (
            <a
              href={s.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl border border-[color:var(--cyan)]/35 bg-[color:var(--cyan)]/10 px-2.5 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-bold text-[color:var(--cyan-glow)] transition-all hover:bg-[color:var(--cyan)]/20 active:scale-97 hover:scale-102 shadow-[0_4px_20px_-8px_rgba(85,225,245,0.3)] hover:shadow-[0_4px_20px_rgba(85,225,245,0.4)] whitespace-nowrap"
            >
              Book Consultation
            </a>
          )}
        </div>
      </header>

      {progress ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
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

      <main className={`mx-auto w-full ${maxWidth} px-4 sm:px-6 py-6 sm:py-14 flex-grow`}>{children}</main>

      <footer className="mt-auto border-t border-ink/10 py-6 sm:py-8 opacity-90 print:hidden w-full text-xs text-muted-foreground font-sans">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 sm:flex-row text-center sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
            <ShieldLogo size={20} className="justify-center flex-wrap" />
            <span className="text-[11px] sm:text-xs">
              © {new Date().getFullYear()} Shield Identity · Passive assessment · Canadian owned
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <a href="https://shield-identity.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="https://shield-identity.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="https://shield-identity.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
