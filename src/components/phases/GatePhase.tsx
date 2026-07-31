import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { PhaseShell } from "@/components/shield/PhaseShell";
import { extractDomain } from "@/lib/assessment/scan";
import { useAssessment } from "@/lib/assessment/store";
import { runBreachCheck } from "@/lib/assessment/scan.functions";
import type { DecisionMaker, Lead } from "@/lib/assessment/types";

interface FormValues {
  name: string;
  business: string;
  email: string;
  phone: string;
  role: string;
  decisionMaker: DecisionMaker;
  consent: boolean;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="group relative block">
      <div className="glass rounded-2xl border border-ink/10 px-4 pb-2 pt-5 transition-colors focus-within:border-[color:var(--cyan)]/60">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        {children}
      </div>
      {error && (
        <div className="mt-1 pl-2 text-xs text-[color:var(--danger)]">{error}</div>
      )}
    </label>
  );
}

export function GatePhase() {
  const s = useAssessment();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      name: s.lead?.name ?? "",
      email: s.lead?.email ?? s.email ?? "",
      business: s.lead?.business ?? extractDomain(s.website),
      phone: s.lead?.phone ?? "",
      role: s.lead?.role ?? "",
      decisionMaker: s.lead?.decisionMaker ?? "Yes, I decide",
      consent: s.lead?.consent ?? true,
    },
  });

  const dm = watch("decisionMaker");

  const submit = async (v: FormValues) => {
    const lead: Lead = { ...v };
    s.setLead(lead);

    if (v.email && s.scan) {
      const emailLower = v.email.toLowerCase().trim();
      const alreadyChecked = s.scan.emails.some(
        (e) => e.toLowerCase().trim() === emailLower,
      );
      if (!alreadyChecked) {
        try {
          const result = await runBreachCheck({ data: { email: emailLower } });
          s.setScan({
            ...s.scan,
            emails: [emailLower],
            breach: result,
          });
        } catch (err) {
          console.error("Failed to check breaches at GatePhase:", err);
        }
      }
    }

    s.setPhase("results");
  };

  return (
    <PhaseShell maxWidth="max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs uppercase tracking-widest text-[color:var(--cyan)]">
          Almost there
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Where should we send your Shield Score report?
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          We'll unlock your full dashboard, tailored recommendations, and — if you
          qualify — an offer for a complimentary internal network assessment.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(submit)} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.name?.message}>
            <input
              autoFocus
              {...register("name", { required: "Required", minLength: { value: 2, message: "Enter your name" } })}
              className="mt-1 w-full bg-transparent text-base text-foreground focus:outline-none"
            />
          </Field>
          <Field label="Business" error={errors.business?.message}>
            <input
              {...register("business", { required: "Required" })}
              className="mt-1 w-full bg-transparent text-base text-foreground focus:outline-none"
            />
          </Field>
          <Field label="Work email" error={errors.email?.message}>
            <input
              type="email"
              {...register("email", {
                required: "Required",
                pattern: { value: /.+@.+\..+/, message: "Enter a valid email" },
              })}
              className="mt-1 w-full bg-transparent text-base text-foreground focus:outline-none"
            />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <input
              type="tel"
              {...register("phone", { required: "Required", minLength: { value: 7, message: "Enter a valid phone" } })}
              className="mt-1 w-full bg-transparent text-base text-foreground focus:outline-none"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Your role" error={errors.role?.message}>
              <input
                {...register("role", { required: "Required" })}
                placeholder="Owner, IT Manager, Office Manager…"
                className="mt-1 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </Field>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Are you the decision-maker for IT & security?
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(["Yes, I decide", "I share that decision", "No, someone else does"] as const).map(
              (opt) => {
                const selected = dm === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue("decisionMaker", opt)}
                    className="rounded-xl border px-3 py-3 text-sm transition-all"
                    style={{
                      borderColor: selected
                        ? "color-mix(in oklab, var(--cyan) 60%, transparent)"
                        : "color-mix(in oklab, white 15%, transparent)",
                      background: selected
                        ? "color-mix(in oklab, var(--cyan) 12%, transparent)"
                        : "transparent",
                      color: selected ? "var(--cyan-glow)" : "var(--foreground)",
                    }}
                  >
                    {opt}
                  </button>
                );
              },
            )}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            {...register("consent")}
            className="mt-1 h-4 w-4 accent-[color:var(--cyan)]"
          />
          <span>
            I consent to Shield Identity contacting me about my results (CASL
            compliant, unsubscribe any time).
          </span>
        </label>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => s.setPhase("quick")}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <motion.button
            type="submit"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-primary-foreground"
            style={{
              background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
              boxShadow:
                "0 20px 40px -18px color-mix(in oklab, var(--cyan) 70%, transparent)",
            }}
          >
            Unlock my Shield Score <ArrowRight size={16} />
          </motion.button>
        </div>

        <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
          <Lock size={12} /> Encrypted transmission · Data used only to generate your report.
        </div>
      </form>
    </PhaseShell>
  );
}
