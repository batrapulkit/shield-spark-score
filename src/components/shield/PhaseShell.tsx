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
      <header className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4 sm:py-6 font-sans">
        <Link to="/" className="cursor-pointer transition-opacity hover:opacity-90 active:scale-97">
          <div className="hidden sm:block">
            <ShieldLogo size={72} />
          </div>
          <div className="sm:hidden">
            <ShieldLogo size={48} />
          </div>
        </Link>
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

      <main className={`mx-auto w-full ${maxWidth} px-6 py-8 sm:py-14 flex-grow`}>{children}</main>

      <footer className="mt-auto border-t border-ink/5 py-8 opacity-80 print:hidden w-full">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-3">
            <ShieldLogo size={24} />
            <span>© {new Date().getFullYear()} Shield Identity · Passive assessment · Canadian owned</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://shield-identity.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Privacy Policy</a>
            <a href="https://shield-identity.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Terms of Service</a>
            <a href="https://shield-identity.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
