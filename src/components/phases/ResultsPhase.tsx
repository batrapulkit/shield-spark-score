import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  CalendarCheck,
  ChevronDown,
  Download,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PhaseShell } from "@/components/shield/PhaseShell";
import { ScoreGauge } from "@/components/shield/ScoreGauge";
import { INDUSTRY_META } from "@/lib/assessment/data";
import {
  buildRecommendations,
  categorySubscores,
  computeFlags,
  computeND,
  computePriority,
  computeScore,
  executiveSummary,
  isSensitive,
  type Priority,
  type RecommendationCard,
} from "@/lib/assessment/engine";
import { useAssessment } from "@/lib/assessment/store";
import { QuestionsPhase } from "./QuestionsPhase";

const PRIORITY_COLOR: Record<Priority, string> = {
  Critical: "var(--danger)",
  High: "var(--warning)",
  Medium: "var(--cyan)",
  Low: "var(--success)",
};

export function ResultsPhase() {
  const s = useAssessment();
  const [deepOpen, setDeepOpen] = useState(false);

  const score = useMemo(
    () => computeScore(s.profile, s.answers, s.scan, s.quickQuestions, s.deepQuestions),
    [s.profile, s.answers, s.scan, s.quickQuestions, s.deepQuestions],
  );
  const flags = useMemo(
    () => computeFlags(s.profile, s.answers, s.scan, s.quickQuestions, s.deepQuestions),
    [s.profile, s.answers, s.scan, s.quickQuestions, s.deepQuestions],
  );
  const recs = useMemo(() => buildRecommendations(s.profile, flags, s.scan), [s.profile, flags, s.scan]);
  const nd = useMemo(
    () =>
      computeND(
        s.profile,
        s.answers,
        s.scan,
        s.lead?.decisionMaker,
        score.final,
      ),
    [s.profile, s.answers, s.scan, s.lead, score.final],
  );
  const sensitive = isSensitive(s.profile, s.answers);
  const priority = useMemo(
    () => computePriority(flags, s.scan, sensitive, score.final, s.lead?.decisionMaker),
    [flags, s.scan, sensitive, score.final, s.lead],
  );
  const cats = useMemo(
    () => categorySubscores(s.profile, s.answers, s.quickQuestions, s.deepQuestions),
    [s.profile, s.answers, s.quickQuestions, s.deepQuestions],
  );
  const summary = useMemo(
    () => executiveSummary(score.final, score.band, flags),
    [score.final, score.band, flags],
  );

  const applicableGuides = useMemo(() => {
    const guides = new Map<string, string>();
    recs.forEach((r) => {
      if (r.diyGuide) {
        let title = "";
        if (r.diyGuide === "guide-mfa") title = "Multi-Factor Authentication (MFA) Setup Guide";
        else if (r.diyGuide === "guide-backup") title = "3-2-1 Enterprise Backup Strategy Guide";
        else if (r.diyGuide === "guide-phish") title = "Employee Phishing Awareness Training Kit";
        else if (r.diyGuide === "kit") title = "Shield Cyber Starter Kit Template";
        else if (r.diyGuide === "guide-pw") title = "Password Manager Deployment Plan";
        else if (r.diyGuide === "guide-ai") title = "Corporate AI Use & Data Protection Policy";
        else if (r.diyGuide === "guide-pentest") title = "External Penetration Testing Scope Checklist";
        
        if (title) {
          guides.set(r.diyGuide, title);
        }
      }
    });
    return Array.from(guides.entries());
  }, [recs]);

  const radarData = cats.map((c) => ({
    subject: c.key,
    score: c.value ?? 0,
    fullMark: 100,
  }));

  const barData = recs
    .filter((r) => r.priority !== "Low")
    .slice(0, 6)
    .map((r) => ({ name: r.category, value: r.priority === "Critical" ? 90 : r.priority === "High" ? 65 : 40 }));
  const industryFramework = s.profile.industry
    ? INDUSTRY_META[s.profile.industry]?.framework
    : null;

  if (deepOpen) {
    return (
      <QuestionsPhase
        mode="deep"
        onBack={() => setDeepOpen(false)}
        onDone={() => setDeepOpen(false)}
      />
    );
  }

  return (
    <PhaseShell maxWidth="max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
      >
        <div>
          <div className="text-xs uppercase tracking-widest text-[color:var(--cyan)]">
            Executive Report · {s.lead?.business}
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Your Shield Score
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Prepared for {s.lead?.name} · {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-ink/5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-ink/10"
            onClick={() => window.print()}
          >
            <Download size={16} /> Download PDF Report
          </button>
          <a
            href={s.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-103 active:scale-97 shadow-[0_8px_30px_rgb(85,225,245,0.2)] hover:shadow-[0_8px_40px_rgb(85,225,245,0.45)] hover:brightness-110 border border-cyan/10"
            style={{
              background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
            }}
          >
            <CalendarCheck size={16} /> Schedule Free Consultation
          </a>
        </div>
      </motion.div>

      {/* Qualification banner */}
      {nd.qualified && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 overflow-hidden rounded-3xl border p-6 sm:p-8"
          style={{
            borderColor: "color-mix(in oklab, var(--success) 40%, transparent)",
            background: "linear-gradient(135deg, color-mix(in oklab, var(--success) 22%, var(--navy-2)), var(--navy-2))",
          }}
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: "color-mix(in oklab, var(--success) 30%, transparent)",
                }}
              >
                <Award size={22} className="text-[color:var(--success)]" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Congratulations
                </div>
                <div className="mt-1 text-xl font-semibold sm:text-2xl">
                  You qualify for a complimentary Internal Network Discovery Assessment.
                </div>
                <div className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Limited spots available — one-business-day scheduling, no obligation.
                </div>
              </div>
            </div>
            <a
              href={s.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center shrink-0 rounded-2xl px-6 py-3.5 text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-103 active:scale-97 border border-white/10"
              style={{
                background: "linear-gradient(135deg, oklch(0.9 0.15 155), var(--success))",
                boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.45)",
              }}
            >
              Claim my free scan
            </a>
          </div>
        </motion.div>
      )}

      {/* Main grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Gauge card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-strong flex flex-col items-center gap-4 rounded-3xl p-8 sm:flex-row sm:justify-around"
        >
          <ScoreGauge value={score.final} band={score.band} />
          <div className="max-w-sm space-y-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Security Level
              </div>
              <div className="mt-1 text-2xl font-semibold">
                {score.band === "Resilient" && "Low risk"}
                {score.band === "Developing" && "Medium risk"}
                {score.band === "Exposed" && "High risk"}
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <Stat label="Base score" value={score.base} suffix="/100" />
              <Stat label="Scan penalties" value={-score.penalties} />
              {s.scan?.breach.checked && (
                <Stat label="Breaches" value={s.scan.breach.count} />
              )}
            </div>
            {s.scan?.breach.checked && s.scan.breach.count > 0 && (
              <div
                className="rounded-xl border p-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{
                  borderColor: "color-mix(in oklab, var(--danger) 25%, transparent)",
                  background: "color-mix(in oklab, var(--danger) 8%, transparent)",
                }}
              >
                <div className="font-semibold text-[color:oklch(0.75_0.22_25)] animate-pulse" style={{ color: "var(--danger)" }}>
                  Compromised Credentials Detected
                </div>
                <div className="mt-1 text-muted-foreground/90">
                  Your email ({s.scan.emails.join(", ")}) was exposed in:{" "}
                  <span className="font-medium text-foreground">
                    {s.scan.breach.breaches.join(", ")}
                  </span>
                </div>
              </div>
            )}
            <div
              className="rounded-xl border p-3 text-xs"
              style={{
                borderColor: "color-mix(in oklab, var(--cyan) 25%, transparent)",
                background: "color-mix(in oklab, var(--cyan) 8%, transparent)",
              }}
            >
              <div className="flex items-center gap-2 font-semibold text-[color:var(--cyan-glow)]">
                <Sparkles size={14} /> Priority tier: {priority.band}
              </div>
              <div className="mt-1 text-muted-foreground">
                Priority score {priority.score} · driven by profile, gaps, and exposure.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-light rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Category scores</h2>
            {industryFramework && (
              <span className="rounded-full bg-[color:var(--navy)]/5 px-2 py-1 text-[10px] uppercase tracking-widest text-[color:var(--card-foreground)]/60">
                {industryFramework}
              </span>
            )}
          </div>
          <div className="mt-4 space-y-3">
            {cats.map((c, i) => (
              <div key={c.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[color:var(--card-foreground)]">{c.key}</span>
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        c.value == null
                          ? "oklch(0.65 0 0)"
                          : c.value >= 71
                            ? "var(--success)"
                            : c.value >= 41
                              ? "var(--warning)"
                              : "var(--danger)",
                    }}
                  >
                    {c.value == null ? "—" : `${c.value}%`}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[color:var(--navy)]/8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.value ?? 0}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.9 }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        c.value == null
                          ? "oklch(0.85 0 0)"
                          : c.value >= 71
                            ? "linear-gradient(90deg, oklch(0.82 0.16 155), var(--success))"
                            : c.value >= 41
                              ? "linear-gradient(90deg, oklch(0.88 0.14 85), var(--warning))"
                              : "linear-gradient(90deg, oklch(0.75 0.22 25), var(--danger))",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-strong rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Security maturity</h2>
            <span className="text-xs text-muted-foreground">Across 6 domains</span>
          </div>
          <div className="mt-3 h-72">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="oklch(1 0 0 / 0.12)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "oklch(0.85 0.01 240)", fontSize: 11 }}
                />
                <Radar
                  dataKey="score"
                  stroke="var(--cyan)"
                  fill="var(--cyan)"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top risk categories</h2>
            <span className="text-xs text-muted-foreground">Weighted exposure</span>
          </div>
          <div className="mt-3 h-72">
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid stroke="oklch(0.32 0.07 285 / 0.15)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "oklch(0.75 0.01 240)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: "oklch(1 0 0 / 0.05)" }}
                  contentStyle={{
                    background: "var(--navy-2)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                    color: "white",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="var(--cyan)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Executive summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 rounded-3xl p-6"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 12%, var(--navy-2)), var(--navy-2))",
          border: "1px solid color-mix(in oklab, var(--cyan) 25%, transparent)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "color-mix(in oklab, var(--cyan) 25%, transparent)" }}
          >
            <TrendingUp size={18} className="text-[color:var(--cyan-glow)]" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[color:var(--cyan-glow)]">
              Executive summary
            </div>
            <p className="mt-2 text-base leading-relaxed text-foreground/90">{summary}</p>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <div className="mt-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Risk findings & recommendations</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {recs.length} recommendation{recs.length === 1 ? "" : "s"} · consolidated from
              your assessment and passive scan.
            </p>
          </div>
        </div>
        {recs.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-[color:var(--success)]/40 bg-[color:var(--success)]/10 p-6">
            <div className="flex items-center gap-3">
              <BadgeCheck size={22} className="text-[color:var(--success)]" />
              <div>
                <div className="font-semibold">You're in good shape.</div>
                <div className="text-sm text-muted-foreground">
                  Keep your controls current and re-check periodically.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {recs.map((r, i) => (
              <RecCard rec={r} index={i} key={r.id} />
            ))}
          </div>
        )}
      </div>

      {/* Deep-dive CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-ink/10 bg-ink/5 p-6 sm:flex-row"
      >
        <div>
          <div className="text-lg font-semibold">Want an even sharper score?</div>
          <div className="text-sm text-muted-foreground">
            Answer the optional deep-dive questions to refine your Shield Score and unlock
            more recommendations.
          </div>
        </div>
        <button
          onClick={() => setDeepOpen(true)}
          className="rounded-xl border border-[color:var(--cyan)]/40 bg-[color:var(--cyan)]/10 px-5 py-3 text-sm font-semibold text-[color:var(--cyan-glow)] transition-colors hover:bg-[color:var(--cyan)]/20"
        >
          Start deep-dive
        </button>
      </motion.div>

      {/* DIY Guide List */}
      {applicableGuides.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 mt-6 border border-ink/10"
        >
          <h3 className="text-lg font-semibold">Your DIY Guide Checklist</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Step-by-step documentation to help you implement these recommendations immediately.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {applicableGuides.map(([id, title]) => (
              <a
                key={id}
                href={s.resourcesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-ink/10 p-4 transition-all hover:bg-ink/5 hover:border-[color:var(--cyan)]/45 group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--cyan)]/10 text-[color:var(--cyan-glow)]">
                  <Sparkles size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    DIY GUIDE
                  </div>
                  <div className="text-sm font-semibold truncate text-[color:var(--card-foreground)] group-hover:text-[color:var(--cyan)]">
                    {title}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* Prominent Bottom CTA section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-3xl p-8 text-center border relative overflow-hidden glass-strong shadow-xl"
        style={{
          borderColor: "color-mix(in oklab, var(--cyan) 30%, transparent)",
          background: "radial-gradient(circle at top right, color-mix(in oklab, var(--cyan) 12%, transparent), transparent), color-mix(in oklab, white 88%, transparent)"
        }}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[color:var(--cyan)] opacity-20 blur-2xl pointer-events-none" />

        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[color:var(--ink)]">
          Ready to Secure Your Business?
        </h3>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Book a free 15-minute consultation to walk through your Shield Score, prioritize your recommendations, and build your custom roadmap.
        </p>
        <div className="mt-8 flex justify-center w-full">
          <a
            href={s.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl px-10 py-4.5 text-base sm:text-lg font-bold text-primary-foreground transition-all duration-300 hover:scale-103 active:scale-97 shadow-[0_12px_35px_rgba(85,225,245,0.35)] hover:shadow-[0_12px_45px_rgba(85,225,245,0.55)] hover:brightness-110 border border-white/10"
            style={{
              background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
            }}
          >
            <CalendarCheck size={22} className="shrink-0" />
            <span>Book Free Security Consultation</span>
          </a>
        </div>
      </motion.div>

      <footer className="mt-12 border-t border-ink/10 pt-6 text-center text-xs text-muted-foreground">
        Shield Identity · Shield Score v5 · Passive assessment. Results based on your
        answers and public data only.
      </footer>
    </PhaseShell>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
        {suffix ?? ""}
      </div>
    </div>
  );
}

function RecCard({ rec, index }: { rec: RecommendationCard; index: number }) {
  const s = useAssessment();
  const [open, setOpen] = useState(index < 2);
  const color = PRIORITY_COLOR[rec.priority];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="card-light overflow-hidden rounded-3xl"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: `color-mix(in oklab, ${color} 85%, black)` }}
        >
          <span className="text-xs font-bold uppercase">{rec.priority[0]}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
              style={{
                background: `color-mix(in oklab, ${color} 15%, white)`,
                color,
                border: `1px solid color-mix(in oklab, ${color} 40%, transparent)`,
              }}
            >
              {rec.priority}
            </span>
            <span className="text-xs text-[color:var(--card-foreground)]/60">
              {rec.category}
            </span>
          </div>
          <div className="mt-1 text-base font-semibold text-[color:var(--card-foreground)]">
            {rec.title}
          </div>
        </div>
        <ChevronDown
          size={18}
          className="shrink-0 text-[color:var(--card-foreground)]/60 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 border-t border-[color:var(--navy)]/10 p-5 sm:grid-cols-2">
              <Block title="Business impact" body={rec.impact} />
              <Block title="Why it matters" body={rec.why} />
              <Block title="Recommended fix" body={rec.fix} full />
              <div className="sm:col-span-2 flex flex-wrap items-center gap-2.5 mt-2 font-sans">
                {rec.diyGuide && (
                  <a
                    href={s.resourcesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--navy)]/15 bg-[color:var(--navy)]/5 px-3.5 py-2 text-xs font-semibold text-[color:var(--card-foreground)] transition-shadow hover:shadow-sm"
                  >
                    DIY Guide → {rec.diyGuide}
                  </a>
                )}
                <a
                  href={s.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--cyan)]/30 bg-[color:var(--cyan)]/5 px-3.5 py-2 text-xs font-bold text-[color:var(--cyan-glow)] transition-all hover:bg-[color:var(--cyan)]/15 active:scale-97 hover:scale-102"
                >
                  Request Setup Help
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Block({ title, body, full }: { title: string; body: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--card-foreground)]/50">
        {title}
      </div>
      <div className="mt-1 text-sm text-[color:var(--card-foreground)]/85">{body}</div>
    </div>
  );
}
