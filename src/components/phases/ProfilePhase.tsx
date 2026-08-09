import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase, Building2, Cloud, Users } from "lucide-react";
import { useState } from "react";
import { PhaseShell } from "@/components/shield/PhaseShell";
import { OptionCard } from "@/components/shield/OptionCard";
import {
  INDUSTRY_OPTIONS,
  IT_OPTIONS,
  SETUP_OPTIONS,
  SIZE_OPTIONS,
} from "@/lib/assessment/data";
import { useAssessment } from "@/lib/assessment/store";
import type { Industry, ProfileIT, ProfileSetup, ProfileSize } from "@/lib/assessment/types";

const STEPS = [
  {
    key: "size" as const,
    icon: Users,
    title: "How many people work at your business?",
    hint: "This shapes what controls actually make sense for you.",
    options: SIZE_OPTIONS as readonly string[],
  },
  {
    key: "it" as const,
    icon: Briefcase,
    title: "Who looks after your computers and IT?",
    hint: "Helps us know who needs to own each recommendation.",
    options: IT_OPTIONS as readonly string[],
  },
  {
    key: "setup" as const,
    icon: Cloud,
    title: "How is your business set up, tech-wise?",
    hint: "Cloud vs on-prem changes which attacks matter most.",
    options: SETUP_OPTIONS as readonly string[],
  },
  {
    key: "industry" as const,
    icon: Building2,
    title: "What industry are you in?",
    hint: "We tailor the framework and industry question to you.",
    options: INDUSTRY_OPTIONS as readonly string[],
  },
];

export function ProfilePhase() {
  const s = useAssessment();
  const [i, setI] = useState(0);

  const step = STEPS[i];
  const value = (s.profile as Record<string, string>)[step.key];

  const next = () => {
    if (!value) return;
    if (i < STEPS.length - 1) setI(i + 1);
    else s.setPhase("quick");
  };
  const back = () => {
    if (i === 0) s.setPhase("scan");
    else setI(i - 1);
  };

  const Icon = step.icon;

  return (
    <PhaseShell progress={{ current: i + 1, total: STEPS.length, label: "About your business" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step.key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 30%, var(--navy-2)), var(--navy-2))",
                border: "1px solid color-mix(in oklab, var(--cyan) 30%, transparent)",
              }}
            >
              <Icon className="text-[color:var(--cyan-glow)]" size={26} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Step {i + 1} of {STEPS.length}
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                {step.title}
              </h1>
              <p className="mt-2 text-muted-foreground">{step.hint}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {step.options.map((opt, idx) => (
              <OptionCard
                key={opt}
                label={opt}
                selected={value === opt}
                onClick={() => {
                  if (step.key === "size") s.setProfile({ size: opt as ProfileSize });
                  if (step.key === "it") s.setProfile({ it: opt as ProfileIT });
                  if (step.key === "setup") s.setProfile({ setup: opt as ProfileSetup });
                  if (step.key === "industry") s.setProfile({ industry: opt as Industry });
                }}
                index={idx}
              />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <motion.button
              disabled={!value}
              onClick={next}
              whileHover={value ? { y: -2 } : undefined}
              whileTap={value ? { scale: 0.98 } : undefined}
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
              }}
            >
              {i === STEPS.length - 1 ? "Start assessment" : "Continue"}
              <ArrowRight size={16} />
            </motion.button>
          </div>

          <div className="mt-8 border-t border-ink/10 pt-6 text-center text-xs text-muted-foreground font-sans">
            Confused about your business tech setup?{" "}
            <a
              href={s.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--cyan-glow)] font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              Book a 15-min call for guidance &rarr;
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </PhaseShell>
  );
}
