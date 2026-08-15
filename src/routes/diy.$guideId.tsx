import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import * as Icons from "lucide-react";
import { useAssessment } from "@/lib/assessment/store";
import { DIY_GUIDES } from "@/lib/assessment/guidesData";

export const Route = createFileRoute("/diy/$guideId")({
  component: DiyGuidePage,
  head: () => ({
    meta: [
      { title: "DIY Security Guide | Shield Identity" },
      { name: "description", content: "Actionable step-by-step cybersecurity setup guides." },
    ],
  }),
});

function DiyGuidePage() {
  const { guideId } = useParams({ from: "/diy/$guideId" });
  const s = useAssessment();
  const navigate = useNavigate();

  // Find active guide
  const guide = useMemo(() => DIY_GUIDES[guideId] || null, [guideId]);

  // Load progress state from localStorage on client-side
  const [progress, setProgress] = useState<Record<string, Record<number, boolean>>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem("shield_diy_progress");
    if (cached) {
      try {
        setProgress(JSON.parse(cached));
      } catch (e) {
        console.warn("Failed to load DIY progress:", e);
      }
    }
  }, []);

  const saveProgress = (newProgress: Record<string, Record<number, boolean>>) => {
    setProgress(newProgress);
    localStorage.setItem("shield_diy_progress", JSON.stringify(newProgress));
  };

  const toggleStep = (gId: string, stepIdx: number) => {
    const guidProgress = progress[gId] ? { ...progress[gId] } : {};
    guidProgress[stepIdx] = !guidProgress[stepIdx];
    
    const newProgress = {
      ...progress,
      [gId]: guidProgress,
    };
    saveProgress(newProgress);
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Get active step counts for guides
  const guideStats = useMemo(() => {
    const stats: Record<string, { total: number; checked: number; percent: number }> = {};
    Object.keys(DIY_GUIDES).forEach((id) => {
      const g = DIY_GUIDES[id];
      const gProgress = progress[id] || {};
      const total = g.steps.length;
      const checked = g.steps.filter((_, idx) => gProgress[idx]).length;
      const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
      stats[id] = { total, checked, percent };
    });
    return stats;
  }, [progress]);

  if (!guide) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center glass rounded-3xl p-8">
          <Icons.ShieldAlert size={48} className="mx-auto text-danger" />
          <h1 className="mt-4 text-2xl font-bold text-foreground">Guide Not Found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The requested guide does not exist, or has been relocated.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[color:var(--cyan)] px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const activeStats = guideStats[guide.id] || { total: guide.steps.length, checked: 0, percent: 0 };
  const GuideIcon = (Icons as any)[guide.iconName] || Icons.Sparkles;

  return (
    <div className="min-h-screen bg-background font-sans pb-16">
      {/* Top Banner / Navbar */}
      <nav className="glass sticky top-0 z-50 py-4 px-4 sm:px-6 lg:px-8 border-b border-ink/10 print:hidden">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 text-[color:var(--cyan)] transition-colors group-hover:bg-ink/10">
              <Icons.Shield size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Shield <span className="text-[color:var(--cyan)]">Identity</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-ink/5 border border-ink/10 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <Icons.Reply size={16} />
            <span className="hidden sm:inline">Back to Assessment</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 print:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-200 group"
          >
            <Icons.ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />
            Assessment Dashboard
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
          {/* LEFT SIDEBAR: Checklist Selection */}
          <aside className="hidden lg:block space-y-6 print:hidden">
            <div className="glass-strong rounded-3xl p-5 border border-ink/10">
              <h2 className="text-base font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                <Icons.FolderKanban size={16} className="text-[color:var(--cyan)]" />
                DIY Guides Checklist
              </h2>
              <div className="space-y-2">
                {Object.values(DIY_GUIDES).map((g) => {
                  const isActive = g.id === guide.id;
                  const stats = guideStats[g.id] || { total: g.steps.length, checked: 0, percent: 0 };
                  const SidebarItemIcon = (Icons as any)[g.iconName] || Icons.Sparkles;

                  return (
                    <Link
                      key={g.id}
                      to="/diy/$guideId"
                      params={{ guideId: g.id }}
                      className={`flex items-start gap-3 rounded-2xl p-3 text-left border transition-all duration-300 group ${
                        isActive
                          ? "bg-[color:var(--cyan)]/10 border-[color:var(--cyan)] text-foreground"
                          : "bg-ink/5 border-transparent text-muted-foreground hover:bg-ink/10 hover:text-foreground"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isActive
                            ? "bg-[color:var(--cyan)]/25 text-[color:var(--cyan-glow)]"
                            : "bg-ink/5 text-muted-foreground group-hover:bg-ink/10"
                        }`}
                      >
                        {stats.percent === 100 ? (
                          <Icons.CheckCircle2 size={16} className="text-[color:var(--success)]" />
                        ) : (
                          <SidebarItemIcon size={16} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold leading-tight line-clamp-2">
                          {g.title}
                        </div>
                        <div className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1.5">
                          <span>{g.timeLimit}</span>
                          <span>·</span>
                          <span className="font-mono">{stats.checked}/{stats.total} steps</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Consultation Card */}
            <div
              className="rounded-3xl p-5 border overflow-hidden relative"
              style={{
                borderColor: "color-mix(in oklab, var(--cyan) 25%, transparent)",
                background: "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 12%, var(--navy-2)), var(--navy-2))"
              }}
            >
              <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[color:var(--cyan)] opacity-10 blur-xl" />
              <h3 className="text-sm font-semibold text-foreground">Need Hands-on help?</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Schedule a complimentary 15-minute verification sync with our cybersecurity team to checklist your setup controls.
              </p>
              <a
                href={s.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full justify-center inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
                }}
              >
                <Icons.CalendarCheck size={14} /> Book consultation
              </a>
            </div>
          </aside>

          {/* RIGHT CONTENT WORKSPACE: Guide Details */}
          <main className="space-y-6 print:p-0">
            {/* Mobile Guide Selector (Visible only on mobile/tablets) */}
            <div className="lg:hidden print:hidden">
              <label htmlFor="mobile-guide-select" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Select DIY Guide
              </label>
              <div className="glass rounded-2xl border border-ink/10 px-4 py-3.5 relative">
                <select
                  id="mobile-guide-select"
                  value={guide.id}
                  onChange={(e) => {
                    navigate({ to: "/diy/$guideId", params: { guideId: e.target.value } });
                  }}
                  className="w-full bg-transparent text-base text-foreground font-semibold focus:outline-none appearance-none pr-8 cursor-pointer"
                >
                  {Object.values(DIY_GUIDES).map((g) => {
                    const stats = guideStats[g.id] || { total: g.steps.length, checked: 0, percent: 0 };
                    return (
                      <option key={g.id} value={g.id} className="bg-[#0b0c16] text-foreground font-semibold">
                        {g.title} ({stats.checked}/{stats.total} steps)
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <Icons.ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* Guide Header Banner */}
            <section
              className="relative overflow-hidden rounded-3xl border p-6 sm:p-8 glass-strong print:border-none print:shadow-none print:bg-white print:p-0"
              style={{
                borderColor: "color-mix(in oklab, var(--cyan) 15%, transparent)"
              }}
            >
              {/* Subtle background graphics */}
              <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[color:var(--cyan)] opacity-10 blur-3xl print:hidden pointer-events-none" />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between relative z-10 print:block">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 print:hidden">
                    <span className="rounded-full bg-[color:var(--cyan)]/15 border border-[color:var(--cyan)]/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--cyan-glow)]">
                      {guide.category}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        guide.difficulty === "Easy"
                          ? "bg-success/15 border-success/20 text-success"
                          : guide.difficulty === "Medium"
                            ? "bg-warning/15 border-warning/20 text-warning"
                            : "bg-danger/15 border-danger/20 text-danger"
                      }`}
                    >
                      {guide.difficulty} Effort
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {guide.title}
                  </h1>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground print:text-black mt-2">
                    {guide.summary}
                  </p>
                </div>

                <div className="flex gap-2 self-start shrink-0 print:hidden mt-2 sm:mt-0">
                  <button
                    onClick={handlePrint}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ink/5 border border-ink/10 px-4 text-sm font-semibold text-foreground hover:bg-ink/10 transition-colors"
                  >
                    <Icons.Printer size={16} /> Print Guide
                  </button>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-8 pt-6 border-t border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-4 w-full sm:max-w-xs">
                  <div className="w-full bg-ink/10 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[color:var(--cyan)] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${activeStats.percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold shrink-0 text-muted-foreground">
                    {activeStats.percent}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Task progress: <span className="font-semibold text-foreground font-mono">{activeStats.checked}</span> of <span className="font-semibold text-foreground font-mono">{activeStats.total}</span> action items completed.
                </div>
              </div>
            </section>

            {/* Checklist Guide Steps */}
            <section className="space-y-4 print:space-y-6">
              {guide.steps.map((step, idx) => {
                const isStepChecked = !!(progress[guide.id] && progress[guide.id][idx]);

                return (
                  <div
                    key={idx}
                    className={`rounded-3xl border p-5 sm:p-6 transition-all duration-300 card-light relative print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:rounded-none print:shadow-none print:bg-white print:p-4 ${
                      isStepChecked ? "bg-ink/5 border-ink/15" : "bg-white"
                    }`}
                  >
                    {/* Corner Tag */}
                    <div className="absolute right-6 top-6 text-xs font-mono font-bold text-muted-foreground/60 print:visible">
                      STEP {idx + 1}
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleStep(guide.id, idx)}
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 cursor-pointer print:hidden ${
                          isStepChecked
                            ? "bg-[color:var(--cyan)] border-[color:var(--cyan)] text-primary-foreground"
                            : "bg-transparent border-ink/20 hover:border-[color:var(--cyan)]/60 text-transparent"
                        }`}
                        aria-label={`Mark step ${idx + 1} complete`}
                      >
                        <Icons.Check size={16} strokeWidth={3} />
                      </button>

                      {/* Content Block */}
                      <div className="space-y-4 min-w-0 flex-1">
                        <div>
                          <h3
                            onClick={() => toggleStep(guide.id, idx)}
                            className={`text-base sm:text-lg font-bold leading-tight select-none cursor-pointer print:text-black ${
                              isStepChecked ? "text-muted-foreground line-through" : "text-foreground"
                            }`}
                          >
                            {step.title}
                          </h3>
                        </div>

                        {/* Why / How Expanders */}
                        <div className="grid gap-4 sm:grid-cols-2 text-sm leading-relaxed">
                          <div className="bg-ink/5 rounded-2xl p-4 border border-ink/5 print:bg-white print:border-none print:p-0">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 print:text-black">
                              Why it matters
                            </h4>
                            <p className="text-muted-foreground/90 print:text-black text-xs font-medium">
                              {step.why}
                            </p>
                          </div>

                          <div className="bg-[color:var(--cyan)]/8 rounded-2xl p-4 border border-[color:var(--cyan)]/10 print:bg-white print:border-none print:p-0">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--cyan-glow)] mb-1.5 print:text-black">
                              Action Instructions
                            </h4>
                            <p className="text-foreground/90 print:text-black text-xs font-medium">
                              {step.how}
                            </p>
                          </div>
                        </div>

                        {/* Optional Code Snippet/Template Render */}
                        {step.code && (
                          <div className="rounded-2xl overflow-hidden border border-ink/10 bg-navy text-neutral-100 font-mono text-xs relative print:bg-neutral-100 print:text-neutral-900 print:border">
                            {/* Code Header Bar */}
                            <div className="flex items-center justify-between px-4 py-2 bg-black/25 text-[10px] text-neutral-400 font-semibold border-b border-white/5 print:text-neutral-600 print:bg-neutral-200">
                              <span>{step.codeTitle || "Script / Config Template"}</span>
                              <button
                                onClick={() => handleCopyCode(step.code!, idx)}
                                className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer print:hidden"
                              >
                                {copiedIndex === idx ? (
                                  <>
                                    <Icons.Check size={11} className="text-success" />
                                    <span className="text-success">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Icons.Copy size={11} />
                                    <span>Copy Template</span>
                                  </>
                                )}
                              </button>
                            </div>
                            {/* Code Payload */}
                            <pre className="p-4 overflow-x-auto whitespace-pre-wrap break-all leading-normal select-all">
                              <code>{step.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Print Friendly Page Signature */}
            <div className="hidden print:block mt-12 border-t pt-6 text-center text-xs text-neutral-500">
              Shield Identity · DIY Roadmap Completed Checklist · Document Reference: {guide.id}
            </div>

            {/* Verification Consultation Prompt */}
            <section
              className="rounded-3xl p-6 sm:p-8 text-center border relative overflow-hidden glass-strong print:hidden"
              style={{
                borderColor: "color-mix(in oklab, var(--cyan) 25%, transparent)",
                background: "radial-gradient(circle at top right, color-mix(in oklab, var(--cyan) 10%, transparent), transparent), white"
              }}
            >
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                Successfully set up this DIY Guide?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Connect with our expert team to review your configuration settings, verify the security status of your parameters, and mark this threat finding as clean in the main assessment catalog.
              </p>
              <div className="mt-6 flex justify-center">
                <a
                  href={s.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-primary-foreground hover:scale-103 active:scale-97 transition-all duration-300 shadow-[0_8px_30px_rgb(85,225,245,0.25)] border border-cyan/10"
                  style={{
                    background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
                  }}
                >
                  <Icons.CalendarCheck size={16} /> Book free security verification sync
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
