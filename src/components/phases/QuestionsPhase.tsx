import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { PhaseShell } from "@/components/shield/PhaseShell";
import { OptionCard } from "@/components/shield/OptionCard";
import {
  INDUSTRY_META,
  type QuestionDef,
} from "@/lib/assessment/data";
import { extractDomain } from "@/lib/assessment/scan";
import { useAssessment } from "@/lib/assessment/store";
import type { Answers } from "@/lib/assessment/types";

interface Props {
  mode: "quick" | "deep";
  onDone: () => void;
  onBack?: () => void;
}

export function QuestionsPhase({ mode, onDone, onBack }: Props) {
  const s = useAssessment();
  const [currentMode, setCurrentMode] = useState<"quick" | "deep">(mode);
  const [showDeeperPrompt, setShowDeeperPrompt] = useState(false);
  const [i, setI] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setCurrentMode(mode);
    setI(0);
    setShowDeeperPrompt(false);
  }, [mode]);

  useEffect(() => {
    if (currentMode === "deep" && s.email && !s.answers.emailtype) {
      const emailDomain = s.email.split("@")[1]?.toLowerCase();
      const siteDomain = extractDomain(s.website).toLowerCase();
      const free = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "icloud.com"];
      const auto: Answers["emailtype"] = free.includes(emailDomain)
        ? "Free"
        : emailDomain === siteDomain
          ? "Own domain"
          : "A mix";
      s.setAnswer("emailtype", auto);
    }
  }, [currentMode, s.email, s.website, s.answers.emailtype, s.setAnswer]);

  const queue = useMemo<QuestionDef[]>(() => {
    if (currentMode === "quick") {
      let q = [...s.quickQuestions];
      if (s.profile.size === "Just me (no staff)") q = q.filter((x) => x.id !== "train");
      return q;
    }
    // deep queue
    let deep = [...s.deepQuestions];
    // industryData first if industry has one
    if (s.profile.industry && INDUSTRY_META[s.profile.industry]) {
      const meta = INDUSTRY_META[s.profile.industry];
      const industryQ: QuestionDef = {
        id: "industryData",
        phase: "DEEP",
        question: meta.industryQuestion,
        explainer: meta.industryExplainer,
        options: [
          { label: "Yes", value: null },
          { label: "No", value: null },
          { label: "Not sure", value: null },
        ],
        weight: 0,
      };
      deep = [industryQ, ...deep];
    }
    // skip emailtype if we already know from provided email
    if (s.email) {
      deep = deep.filter((x) => x.id !== "emailtype");
    }
    if (s.profile.size === "Just me (no staff)") {
      deep = deep.filter((x) => x.id !== "accessoff");
    }
    if (s.answers.aiuse === "No") {
      deep = deep.filter((x) => x.id !== "airules");
    }
    return deep;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMode, s.profile, s.email, s.website]);

  const q = queue[i];
  const answer = (s.answers as Record<string, string | undefined>)[q?.id ?? ""];

  const select = (label: string) => {
    if (!q) return;
    s.setAnswer(q.id as keyof Answers, label as never);
    // dynamic queue removal for airules if aiuse just set to No
    setTimeout(() => nextStep(), 160);
  };

  const nextStep = () => {
    if (currentMode === "quick" && i === 3 && !showDeeperPrompt) {
      setShowDeeperPrompt(true);
      setShowHelp(false);
      return;
    }
    if (i < queue.length - 1) setI(i + 1);
    else onDone();
    setShowHelp(false);
  };

  const back = () => {
    setShowHelp(false);
    if (showDeeperPrompt) {
      setShowDeeperPrompt(false);
      return;
    }
    if (i === 0) {
      if (onBack) onBack();
      else s.setPhase("profile");
    } else setI(i - 1);
  };

  if (showDeeperPrompt) {
    return (
      <PhaseShell
        progress={{
          current: 4,
          total: queue.length,
          label: "Assessment Checkpoint",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-8 text-center max-w-xl mx-auto border border-ink/10 relative overflow-hidden"
        >
          {/* Decorative gradients */}
          <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-[color:var(--cyan)] opacity-[0.08] blur-xl" />
          <div className="absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-violet-600 opacity-[0.08] blur-xl" />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--cyan)]/10 text-[color:var(--cyan-glow)]">
            <HelpCircle size={28} />
          </div>

          <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Want to go deeper?
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            You've completed the Secure Brampton baseline scan. You can unlock advanced recommendations and double the accuracy of your Shield Score by answering a few optional deep-dive questions now.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                setShowDeeperPrompt(false);
                setCurrentMode("deep");
                setI(0);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-103 active:scale-97 border border-white/10 shadow-[0_8px_30px_rgb(85,225,245,0.2)] hover:shadow-[0_8px_40px_rgb(85,225,245,0.45)]"
              style={{
                background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
              }}
            >
              Go deeper <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                setShowDeeperPrompt(false);
                setI(4);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-ink/15 bg-ink/5 px-6 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:bg-ink/10"
            >
              No, keep it quick
            </button>
          </div>
        </motion.div>
      </PhaseShell>
    );
  }

  if (!q) return null;

  return (
    <PhaseShell
      progress={{
        current: i + 1,
        total: queue.length,
        label: currentMode === "quick" ? "Cybersecurity assessment" : "Deep-dive assessment",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id + i}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs uppercase tracking-widest text-[color:var(--cyan)]">
            {q.phase === "QUICK" ? "Big Six · Quick" : "Deep dive"}
          </div>
          <h1 className="mt-2 text-2xl font-semibold leading-snug tracking-tight sm:text-[28px]">
            {q.question}
          </h1>

          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="mt-3 inline-flex items-center gap-2 text-sm text-[color:var(--cyan-glow)] hover:underline"
          >
            <HelpCircle size={14} />
            {showHelp ? "Hide" : "What is this, in plain English?"}
          </button>
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-2xl border border-ink/10 bg-ink/5 p-4 text-sm text-muted-foreground">
                  {q.explainer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {q.options.map((opt, idx) => (
              <OptionCard
                key={opt.label}
                label={opt.label}
                selected={answer === opt.label}
                onClick={() => select(opt.label)}
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
              disabled={!answer}
              onClick={nextStep}
              whileHover={answer ? { y: -2 } : undefined}
              whileTap={answer ? { scale: 0.98 } : undefined}
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
              }}
            >
              {i === queue.length - 1 ? (currentMode === "quick" ? "See my score" : "Update results") : "Next"}
              <ArrowRight size={16} />
            </motion.button>
          </div>

          <div className="mt-8 border-t border-ink/10 pt-6 text-center text-xs text-muted-foreground font-sans">
            Stuck on a question or unsure of your controls?{" "}
            <a
              href={s.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--cyan-glow)] font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              Find a Shield expert at the booth, or book a follow-up &rarr;
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </PhaseShell>
  );
}
