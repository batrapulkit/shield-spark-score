import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, ArrowLeft, Check, Loader2, MinusCircle, X } from "lucide-react";
import { PhaseShell } from "@/components/shield/PhaseShell";
import { useAssessment } from "@/lib/assessment/store";
import { SCAN_STEPS, extractDomain, emptyScan } from "@/lib/assessment/scan";
import { runScan } from "@/lib/assessment/scan.functions";

const SHORT_EXPLANATIONS: Record<string, string> = {
  reach: "Checks if your website is live and accessible to visitors on the internet.",
  https: "Verifies that your website encrypts data so hackers can't steal customer info.",
  ssl: "Makes sure your website's security certificate is valid and trusted by browsers.",
  spf: "Checks if your email is protected against people sending fake emails pretending to be you.",
  dkim: "Verifies that emails from your domain have a digital signature proving they're legitimate.",
  dmarc: "Ensures you have rules telling email providers what to do with suspicious emails from your domain.",
  mx: "Confirms your email delivery system is set up correctly so you can receive messages.",
  dnssec: "Checks if your website address is protected from being secretly redirected to a fake site.",
  caa: "Verifies that only authorised security providers can issue certificates for your website.",
  tls: "Ensures browsers are forced to always use a secure, encrypted connection to your site.",
  headers: "Checks for invisible security shields that protect your visitors from common web attacks.",
  cookies: "Verifies that your website's stored user data (cookies) is protected from theft.",
  mixed: "Checks if your secure website accidentally loads any unprotected content.",
  banner: "Looks for server info leaks that could tell hackers exactly how to attack you.",
  files: "Scans for sensitive files (like backups or configs) accidentally left open to the public.",
  subdomains: "Lists all the sub-addresses tied to your domain to spot forgotten or risky ones.",
  ports: "Checks for hidden doorways into your server that shouldn't be open to the internet.",
  tech: "Identifies what software your website runs on to check for known vulnerabilities.",
  breach: "Checks if any of your company email addresses have appeared in known data breaches.",
};

interface RowState {
  key: string;
  label: string;
  status: "pending" | "running" | "done";
  result?: { ok: "pass" | "warn" | "fail" | "skip"; text: string };
}

const STEP_EXPLANATIONS: Record<string, {
  title: string;
  what: string;
  meaning: string;
  resolve: string;
}> = {
  reach: {
    title: "Domain Resolution",
    what: "Verifies if your business website is publicly reachable and resolves correctly to an IP address.",
    meaning: "If a domain is not reachable, customers cannot access your website, leading to an immediate loss of trust and revenue.",
    resolve: "Ensure your domain is pointed to a valid web host via name server settings and the web server is online.",
  },
  https: {
    title: "HTTPS Encryption",
    what: "Checks if internet browsing traffic to your website is encrypted using SSL/TLS (HTTPS).",
    meaning: "Without HTTPS, malicious actors on the same network can intercept sensitive data, and browsers will flag your site as 'Not Secure'.",
    resolve: "Install an SSL certificate (e.g. Let's Encrypt) and configure your web server to redirect all HTTP traffic to HTTPS.",
  },
  ssl: {
    title: "SSL Certificate Validation",
    what: "Verifies that the website's SSL/TLS certificate is valid, not expired, and issued by a trusted authority.",
    meaning: "An invalid certificate triggers scary browser warnings that prevent users from entering your site entirely.",
    resolve: "Renew your SSL certificate regularly or configure automatic renewals through platforms like Let's Encrypt, Cloudflare, or AWS.",
  },
  spf: {
    title: "SPF (Sender Policy Framework)",
    what: "A DNS record specifying which mail servers are permitted to send email on behalf of your domain.",
    meaning: "Missing SPF records allow spammers to easily impersonate your business name, leading to domain blacklisting and poor email deliverability.",
    resolve: "Add a TXT record to your DNS settings containing your authorized mail delivery services (e.g., v=spf1 include:_spf.google.com ~all).",
  },
  dkim: {
    title: "DKIM (DomainKeys Identified Mail)",
    what: "An email authentication method that adds a cryptographic signature to emails, verifying they were sent by the domain owner.",
    meaning: "Without DKIM, email providers cannot guarantee that incoming mail hasn't been modified in transit, often routing them directly to Spam.",
    resolve: "Generate a public-private key pair in your email system (Workspace, O365) and publish the public key as a DNS TXT record.",
  },
  dmarc: {
    title: "DMARC (Domain-based Message Authentication)",
    what: "An email validation system that defines how a receiver should handle emails from your domain that fail SPF/DKIM checks.",
    meaning: "If DMARC is missing or misconfigured (e.g. policy set to 'none'), spammers can spoof your brand with absolute impunity.",
    resolve: "Publish a DMARC TXT record in your DNS settings specifying a quarantine or reject policy (e.g., v=DMARC1; p=quarantine; pct=100).",
  },
  mx: {
    title: "MX (Mail Exchange) Records",
    what: "DNS records that route incoming emails to your correct email provider servers.",
    meaning: "Incorrect or missing MX records mean your business cannot receive any incoming customer or partner emails.",
    resolve: "Ensure your domain's DNS MX records point to your designated mail service provider (e.g. Google Workspace, Microsoft 365).",
  },
  dnssec: {
    title: "DNSSEC (DNS Security Extensions)",
    what: "Validates DNS queries cryptographically to prevent spoofing and DNS poisoning attacks.",
    meaning: "Without DNSSEC, attackers could redirect your website traffic or email routes to their malicious servers.",
    resolve: "Configure and enable DNSSEC in your domain registrar control panel (e.g. GoDaddy, Namecheap) to sign the zones.",
  },
  caa: {
    title: "CAA (Certification Authority Authorization)",
    what: "A DNS record that restricts which Certificate Authorities (CAs) are allowed to issue SSL certificates for your domain.",
    meaning: "Failing to set a CAA record allows rogue authorities to issue unauthorized SSL certificates for your brand.",
    resolve: "Add CAA records to your domain's DNS manager specifying your trusted issuers (e.g., issue 'letsencrypt.org').",
  },
  tls: {
    title: "HSTS (HTTP Strict Transport Security)",
    what: "A security header instructing browsers to connect to your website exclusively over secure HTTPS channels.",
    meaning: "Without HSTS, users are vulnerable to SSL stripping attacks, where an attacker downgrades their connection back to unencrypted HTTP.",
    resolve: "Add the Strict-Transport-Security header to your web server's responses (e.g., max-age=63072000; includeSubDomains; preload).",
  },
  headers: {
    title: "Security Headers",
    what: "Verifies the presence of key defense-in-depth headers like CSP, X-Frame-Options, and X-Content-Type-Options.",
    meaning: "Missing security headers expose your website visitors to clickjacking, cross-site scripting (XSS), and content sniffing exploits.",
    resolve: "Add required headers (like Content-Security-Policy, X-Frame-Options: DENY, and X-Content-Type-Options: nosniff) on your web host.",
  },
  cookies: {
    title: "Cookie Security Flags",
    what: "Checks if cookies are set with secure attributes (Secure, HttpOnly, and SameSite).",
    meaning: "Cookies lacking these flags can be stolen via XSS or intercepted over unencrypted network nodes.",
    resolve: "Set 'HttpOnly; Secure; SameSite=Strict' in all cookie headers on your server.",
  },
  mixed: {
    title: "Mixed Content Checks",
    what: "Audits whether your secure HTTPS site contains links or loading elements using insecure HTTP.",
    meaning: "Mixed content allows attackers to tamper with or spy on parts of an otherwise encrypted page, undermining visitor safety.",
    resolve: "Update all database references and asset paths (images, scripts, styles) on your website to use prefix 'https://'.",
  },
  banner: {
    title: "Software Version Disclosure",
    what: "Scans server response headers (like Server, X-Powered-By) to check if your server software names and versions are exposed.",
    meaning: "Disclosing exact version numbers helps attackers find matching public CVE exploits to target your server directly.",
    resolve: "Disable server signature banners in your web server config files (e.g. set 'server_tokens off' in Nginx).",
  },
  files: {
    title: "Exposed Sensitive Files",
    what: "Checks if sensitive installation folders, backups, or git configuration files are publicly accessible (e.g., .git/config, config.php.bak).",
    meaning: "Exposed config files can leak database credentials, source code secrets, and private business assets to the public web.",
    resolve: "Remove backup files from web roots and restrict folder permissions using web server rules (e.g. .htaccess or Nginx deny rules).",
  },
  subdomains: {
    title: "Subdomain Footprint Check",
    what: "Queries public certificate logs to list all subdomains registered to your brand.",
    meaning: "Finding obsolete or abandoned subdomains (e.g. staging, old promotions) exposes your business to subdomain hijacking.",
    resolve: "Audit your subdomain certificates and de-register obsolete domains, deleting any dns entries.",
  },
  ports: {
    title: "Exposed Network Ports",
    what: "Scans for open HTTP/HTTPS port overrides that are publicly listening (e.g., 8080, 8443).",
    meaning: "Exposing non-standard admin portals or debug ports invites automated brute-force attacks and scans.",
    resolve: "Close non-essential ports at the wall registry/firewall layer, wrapping access inside a secure VPN.",
  },
  tech: {
    title: "Technology Stack Fingerprint",
    what: "Identifies front-end libraries, CMS platforms, or analytics software running on your website.",
    meaning: "Using outdated or unsupported software platforms (like end-of-life WordPress versions) creates critical attack angles.",
    resolve: "Keep all plugins, web software frameworks, and script integrations updated to their latest patches.",
  },
  breach: {
    title: "Data Breach Exposure Check",
    what: "Audits if your company emails are listed in known public database breaches.",
    meaning: "Compromised credentials lead directly to account takeovers, spear-phishing attacks, and identity fraud.",
    resolve: "Enforce multi-factor authentication (MFA) across all employee accounts and mandate immediate password resets.",
  },
};

export function ScanPhase() {
  const s = useAssessment();
  const [rows, setRows] = useState<RowState[]>(
    SCAN_STEPS.map((st) => ({ key: st.key, label: st.label, status: "pending" })),
  );
  const [done, setDone] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<RowState | null>(null);

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
      <div className="mb-6 flex justify-start">
        <button
          onClick={() => s.setPhase("hook")}
          disabled={done}
          className="inline-flex items-center gap-2 rounded-full text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs uppercase tracking-widest text-[color:var(--cyan)]">
          Passive Exposure Scan
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Scanning <span className="text-gradient-cyan">{domain}</span>…
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          We're checking your public-facing security posture. This uses only passive,
          public data - no logins, no installs, no traffic to internal systems.
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
          <div className="max-h-[720px] overflow-y-auto p-4 font-mono text-sm">
            <div className="text-muted-foreground">$ shield-scan --passive {domain}</div>
            <AnimatePresence initial={false}>
              {rows.map((r) => (
                <motion.div
                  key={r.key}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-2 flex items-start gap-2"
                >
                  <div className="mt-[2px] shrink-0">
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
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <span
                      className={
                        r.status === "done"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {r.label}
                    </span>
                    {SHORT_EXPLANATIONS[r.key] && (
                      <div className="text-[11px] text-muted-foreground/60 leading-tight mt-1 font-sans">
                        {SHORT_EXPLANATIONS[r.key]}
                      </div>
                    )}
                  </div>
                  {r.result && (
                    <span 
                      title={r.result.text}
                      className="text-xs text-muted-foreground max-w-[40%] sm:max-w-[50%] truncate text-right shrink-0"
                    >
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

        <div className="space-y-4 pb-24 md:pb-0">
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
            <div className="flex items-center justify-between font-sans">
              <div className="text-sm font-semibold">Live findings</div>
              <span className="text-[10px] text-muted-foreground/75 italic">Click row for details</span>
            </div>
            <div className="mt-3 space-y-1.5 text-sm">
              {findings.slice(0, 8).map((f) => (
                <button
                  key={f.key}
                  disabled={f.status !== "done"}
                  onClick={() => setSelectedCheck(f)}
                  className="flex w-full items-center justify-between border-b border-ink/5 pb-2 last:border-0 hover:bg-ink/5 p-1 px-2 -mx-2 rounded-lg transition-colors text-left disabled:pointer-events-none cursor-pointer"
                >
                  <span className="text-muted-foreground mr-2 truncate">{f.result!.text}</span>
                  <span
                    className="text-[10px] font-semibold uppercase shrink-0"
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
                </button>
              ))}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/88 backdrop-blur-md border-t border-border/40 z-50 md:relative md:p-0 md:bg-transparent md:border-t-0 md:z-auto md:shadow-none">
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
      </div>

      {/* Interactive check explanation slide-up detail modal */}
      <AnimatePresence>
        {selectedCheck && (() => {
          const info = STEP_EXPLANATIONS[selectedCheck.key] || {
            title: selectedCheck.label,
            what: "We ran this check to determine public vulnerabilities associated with your domain.",
            meaning: "This parameter forms a core element of your domain's public cyber exposure threat score.",
            resolve: "Update DNS values, security header configurations, or server software settings to address warnings.",
          };
          
          const statusColor =
            selectedCheck.result?.ok === "pass"
              ? "var(--success)"
              : selectedCheck.result?.ok === "warn"
                ? "var(--warning)"
                : selectedCheck.result?.ok === "skip"
                  ? "var(--muted-foreground)"
                  : "var(--danger)";

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCheck(null)}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-strong max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 relative border border-ink/10"
              >
                <button
                  onClick={() => setSelectedCheck(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-ink/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-3">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0 animate-pulse"
                    style={{ backgroundColor: statusColor }}
                  />
                  <h3 className="text-xl font-bold text-foreground pr-6">{info.title}</h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="space-y-1">
                    <h5 className="font-semibold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground">What this is</h5>
                    <p className="text-muted-foreground leading-relaxed">{info.what}</p>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-semibold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground">Meaning & Security Risk</h5>
                    <p className="text-muted-foreground leading-relaxed">{info.meaning}</p>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-semibold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground">How to resolve</h5>
                    <p className="text-muted-foreground leading-relaxed">{info.resolve}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedCheck(null)}
                    className="w-full text-center py-2.5 rounded-xl bg-ink/10 hover:bg-ink/15 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Close Overview
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </PhaseShell>
  );
}
