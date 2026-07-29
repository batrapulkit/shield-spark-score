import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, Check, Loader2, MinusCircle, X } from "lucide-react";
import { PhaseShell } from "@/components/shield/PhaseShell";
import { useAssessment } from "@/lib/assessment/store";
import { SCAN_STEPS, extractDomain, emptyScan } from "@/lib/assessment/scan";
import { runScan } from "@/lib/assessment/scan.functions";

interface RowState {
  key: string;
  label: string;
  status: "pending" | "running" | "done";
  result?: { ok: "pass" | "warn" | "fail" | "skip"; text: string };
}

export function ScanPhase() {
  const s = useAssessment();
  const [rows, setRows] = useState<RowState[]>(
    SCAN_STEPS.map((st) => ({ key: st.key, label: st.label, status: "pending" })),
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    const emails = [s.email, ...s.extraEmails].filter(Boolean);
    const domain = extractDomain(s.website);
    let cancelled = false;

    const scanPromise = runScan({ data: { domain, emails } }).catch(() =>
      emptyScan(domain, emails),
    );

    (async () => {
      for (let i = 0; i < SCAN_STEPS.length; i++) {
        if (cancelled) return;
        setRows((r) =>
          r.map((row, idx) => (idx === i ? { ...row, status: "running" } : row)),
        );
        await new Promise((res) => setTimeout(res, 260 + Math.random() * 180));
      }
      const result = await scanPromise;
      if (cancelled) return;
      s.setScan(result);
      setRows((r) =>
        r.map((row, idx) => ({
          ...row,
          status: "done",
          result: SCAN_STEPS[idx].passLabel(result),
        })),
      );
      setDone(true);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const domain = extractDomain(s.website);
  const findings = rows.filter((r) => r.result);
  const skipped = findings.filter((r) => r.result!.ok === "skip").length;
  const passes = findings.filter((r) => r.result!.ok === "pass").length;
  const warns = findings.filter((r) => r.result!.ok === "warn").length;
  const fails = findings.filter((r) => r.result!.ok === "fail").length;

  return (
    <PhaseShell maxWidth="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs uppercase tracking-widest text-[color:var(--cyan)]">
          Passive Exposure Scan
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Scanning <span className="text-gradient-cyan">{domain}</span>…
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          We're checking your public-facing security posture. This uses only passive,
          public data — no logins, no installs, no traffic to internal systems.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-strong rounded-3xl p-2">
          <div className="flex items-center justify-between border-b border-ink/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-muted-foreground">
                shield-scan · {domain}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              secure channel
            </span>
          </div>
          <div className="max-h-[520px] overflow-hidden p-4 font-mono text-sm">
            <div className="text-muted-foreground">$ shield-scan --passive {domain}</div>
            <AnimatePresence initial={false}>
              {rows.map((r) => (
                <motion.div
                  key={r.key}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-1.5 flex items-center gap-2"
                >
                  {r.status === "pending" && (
                    <span className="text-muted-foreground">›</span>
                  )}
                  {r.status === "running" && (
                    <Loader2
                      size={14}
                      className="animate-spin text-[color:var(--cyan)]"
                    />
                  )}
                  {r.status === "done" && r.result?.ok === "pass" && (
                    <Check size={14} style={{ color: "var(--success)" }} />
                  )}
                  {r.status === "done" && r.result?.ok === "warn" && (
                    <AlertTriangle size={14} style={{ color: "var(--warning)" }} />
                  )}
                  {r.status === "done" && r.result?.ok === "fail" && (
                    <X size={14} style={{ color: "var(--danger)" }} />
                  )}
                  {r.status === "done" && r.result?.ok === "skip" && (
                    <MinusCircle size={14} className="text-muted-foreground" />
                  )}
                  <span
                    className={
                      r.status === "done"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {r.label}
                  </span>
                  {r.result && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {r.result.text}
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-[color:var(--cyan)]"
              >
                › scan complete · {passes} pass · {warns} warn · {fails} fail · {skipped} n/a
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Pass", value: passes, color: "var(--success)" },
              { label: "Warn", value: warns, color: "var(--warning)" },
              { label: "Fail", value: fails, color: "var(--danger)" },
            ].map((k) => (
              <div key={k.label} className="glass rounded-2xl p-4 text-center">
                <div
                  className="text-3xl font-semibold"
                  style={{ color: k.color, fontVariantNumeric: "tabular-nums" }}
                >
                  {k.value}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {k.label}
                </div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-semibold">Live findings</div>
            <div className="mt-3 space-y-2 text-sm">
              {findings.slice(0, 8).map((f) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between border-b border-ink/5 pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">{f.result!.text}</span>
                  <span
                    className="text-[10px] font-semibold uppercase"
                    style={{
                      color:
                        f.result!.ok === "pass"
                          ? "var(--success)"
                          : f.result!.ok === "warn"
                            ? "var(--warning)"
                            : f.result!.ok === "skip"
                              ? "var(--muted-foreground)"
                              : "var(--danger)",
                    }}
                  >
                    {f.result!.ok}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            disabled={!done}
            onClick={() => s.setPhase("profile")}
            whileHover={done ? { y: -2 } : undefined}
            whileTap={done ? { scale: 0.98 } : undefined}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-all disabled:cursor-wait disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
              boxShadow:
                "0 20px 40px -18px color-mix(in oklab, var(--cyan) 70%, transparent)",
            }}
          >
            {done ? (
              <>
                Continue to assessment <ArrowRight size={18} />
              </>
            ) : (
              <>
                Scanning… <Loader2 size={16} className="animate-spin" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </PhaseShell>
  );
}
