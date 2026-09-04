import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Lock,
  Mail,
  ShieldCheck,
  MapPin,
  ServerOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { PhaseShell } from "@/components/shield/PhaseShell";
import { useAssessment } from "@/lib/assessment/store";
import { CaptchaVerify } from "@/components/shield/CaptchaVerify";

export function HookPhase() {
  const s = useAssessment();
  const [website, setWebsite] = useState(s.website);
  const [email, setEmail] = useState(s.email);
  const [consent, setConsent] = useState(s.consent);
  const [captchaPassed, setCaptchaPassed] = useState(false);

  const websiteValid = /^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(
    website.replace(/^https?:\/\//, "").replace(/^www\./, ""),
  );

  const submit = () => {
    if (!websiteValid || !consent || !captchaPassed) return;
    s.setWebsite(website);
    s.setEmail(email);
    s.setConsent(consent);
    s.setPhase("scan");
  };

  return (
    <PhaseShell maxWidth="max-w-5xl">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/5 px-3 py-1 text-xs text-muted-foreground"
          >
            <ShieldCheck size={14} className="text-[color:var(--cyan)]" />
            Shield Score · Automated Cybersecurity Assessment
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Discover your business{" "}
            <span className="text-gradient-cyan">cyber risk</span> in under 3 minutes.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 max-w-xl text-lg text-muted-foreground"
          >
            Get an instant Shield Score based on your website, email security, and
            cybersecurity practices - built for Canadian SMBs, no installation
            required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-8 space-y-3"
          >
            <div className="glass rounded-2xl p-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <Globe size={18} className="text-muted-foreground" />
                <input
                  autoFocus
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Enter your company website (e.g. yourcompany.com)"
                  className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                  aria-label="Website"
                />
              </div>
            </div>

            <div className="glass rounded-2xl p-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <Mail size={18} className="text-muted-foreground" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Your email address (optional - unlocks breach check)"
                  className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                  aria-label="Email"
                />
              </div>
            </div>

            <label className="mt-1 flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[color:var(--cyan)]"
              />
              <span>
                I authorise a passive external scan of my domain (public data only, no
                logins, no installation).
              </span>
            </label>

            <div className="pt-2">
              <CaptchaVerify onVerify={setCaptchaPassed} />
            </div>

            <motion.button
              onClick={submit}
              disabled={!websiteValid || !consent || !captchaPassed}
              whileHover={websiteValid && consent && captchaPassed ? { y: -2 } : undefined}
              whileTap={websiteValid && consent && captchaPassed ? { scale: 0.98 } : undefined}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              style={{
                background:
                  "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
                boxShadow:
                  "0 20px 40px -18px color-mix(in oklab, var(--cyan) 70%, transparent)",
              }}
            >
              Scan My Business
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { icon: ServerOff, label: "Passive Scan Only" },
              { icon: Lock, label: "No Installation Required" },
              { icon: MapPin, label: "Trusted by Canadian Businesses" },
            ].map((b) => (
              <div
                key={b.label}
                className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground"
              >
                <b.icon size={14} className="text-[color:var(--cyan)]" />
                {b.label}
              </div>
            ))}
          </div>
        </div>

        <HeroPreview />
      </div>

      {/* Alternative Consultation CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 border-t border-ink/10 pt-8"
      >
        <div className="glass-strong rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-ink/10 relative overflow-hidden backdrop-blur-md">
          {/* Subtle gradient light */}
          <div className="absolute -left-12 -top-12 h-24 w-24 rounded-full bg-[color:var(--cyan)] opacity-[0.06] blur-xl" />
          
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-semibold text-foreground">
              Prefer a live walkthrough with a security expert?
            </h4>
            <p className="text-sm text-muted-foreground max-w-xl">
              Skip the automated scanner and book a direct 1-on-1 assessment check. We'll crawl your site and explain your security posture live.
            </p>
          </div>
          <a
            href={s.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto text-center shrink-0 rounded-2xl px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-103 active:scale-97 border border-white/10 hover:shadow-[0_8px_30px_rgb(85,225,245,0.25)]"
            style={{
              background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
            }}
          >
            Book Free Briefing Directly
          </a>
        </div>
      </motion.div>
    </PhaseShell>
  );
}

function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="glass-strong relative rounded-3xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Live Shield Score
          </div>
          <div className="mt-1 text-2xl font-semibold">Acme Corp</div>
        </div>
      </div>

      <div className="relative mx-auto mt-6 flex h-52 w-52 items-center justify-center">
        <svg width="208" height="208" className="-rotate-90">
          <circle
            cx="104"
            cy="104"
            r="88"
            stroke="oklch(0.32 0.07 285 / 0.15)"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="104"
            cy="104"
            r="88"
            stroke="var(--cyan)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={2 * Math.PI * 88}
            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - 0.68) }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-5xl font-semibold">68</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            / 100
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {[
          { label: "MFA Enforced", ok: true },
          { label: "DMARC Missing", ok: false },
          { label: "Backups Tested", ok: true },
          { label: "0 Exposed Ports", ok: true },
        ].map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex items-center justify-between rounded-lg bg-ink/5 px-3 py-2 text-sm"
          >
            <span>{r.label}</span>
            {r.ok ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[color:var(--success)]">
                <CheckCircle2 size={13} /> Secure
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[color:var(--danger)]">
                <AlertCircle size={13} /> Gap Detected
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
