import type { ScanResult } from "./types";

export function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

export function emptyScan(domain: string, emails: string[]): ScanResult {
  return {
    domain,
    emails,
    reachable: false,
    https: false,
    ssl: "weak",
    spf: false,
    dkim: false,
    dmarc: false,
    dmarcPolicy: "missing",
    tlsBad: false,
    headers: false,
    headersFound: [],
    headersMissing: [],
    mx: [],
    mailProvider: null,
    caa: false,
    dnssec: false,
    nameservers: [],
    subdomains: [],
    subdomainsChecked: false,
    exposedPaths: [],
    exposedPathsChecked: false,
    cookieIssues: [],
    cookiesChecked: false,
    mixedContent: 0,
    banner: null,
    ports: [],
    portsChecked: false,
    breach: { count: 0, breaches: [], checked: false },
    tech: [],
  };
}

export function mockScan(domain: string, emails: string[]): ScanResult {
  return {
    domain,
    emails,
    reachable: true,
    https: true,
    ssl: "valid" as const,
    spf: true,
    dkim: false,
    dmarc: false,
    dmarcPolicy: "missing" as const,
    tlsBad: false,
    headers: false,
    headersFound: ["HSTS", "X-Frame-Options", "X-Content-Type-Options"],
    headersMissing: ["CSP", "Referrer-Policy", "Permissions-Policy"],
    mx: ["mx1.clean-mail.com", "mx2.clean-mail.com"],
    mailProvider: "Office 365",
    caa: false,
    dnssec: false,
    nameservers: ["dns1.registrar.com", "dns2.registrar.com"],
    subdomains: ["www." + domain, "mail." + domain],
    subdomainsChecked: true,
    exposedPaths: [],
    exposedPathsChecked: true,
    cookieIssues: ["session_id: no HttpOnly"],
    cookiesChecked: true,
    mixedContent: 1,
    banner: "nginx/1.18.0",
    ports: [],
    portsChecked: true,
    breach: {
      count: emails.length > 0 ? 2 : 0,
      breaches: emails.length > 0 ? ["linkedin", "canva"] : [],
      checked: emails.length > 0,
    },
    tech: ["WordPress", "Nginx", "Google Analytics"],
  };
}

export interface ScanStep {
  key: string;
  label: string;
  passLabel: (r: ScanResult) => { ok: "pass" | "warn" | "fail" | "skip"; text: string };
}

export const SCAN_STEPS: ScanStep[] = [
  {
    key: "reach",
    label: "Resolving domain...",
    passLabel: (r) => ({
      ok: r.reachable ? "pass" : "warn",
      text: r.reachable ? "Site Reachable" : "Site Did Not Respond",
    }),
  },
  {
    key: "https",
    label: "Checking HTTPS...",
    passLabel: (r) =>
      !r.reachable
        ? { ok: "skip", text: "Not Checked" }
        : { ok: r.https ? "pass" : "fail", text: r.https ? "HTTPS Enforced" : "HTTPS Not Enforced" },
  },
  {
    key: "ssl",
    label: "Validating SSL certificate...",
    passLabel: (r) =>
      !r.reachable
        ? { ok: "skip", text: "Not Checked" }
        : { ok: r.ssl === "valid" ? "pass" : "warn", text: r.ssl === "valid" ? "Certificate Valid" : "Certificate Issue" },
  },
  {
    key: "spf",
    label: "Looking up SPF record...",
    passLabel: (r) => ({ ok: r.spf ? "pass" : "fail", text: r.spf ? "SPF Found" : "SPF Missing" }),
  },
  {
    key: "dkim",
    label: "Looking up DKIM selectors...",
    passLabel: (r) => ({ ok: r.dkim ? "pass" : "warn", text: r.dkim ? "DKIM Found" : "No DKIM On Common Selectors" }),
  },
  {
    key: "dmarc",
    label: "Looking up DMARC record...",
    passLabel: (r) => ({
      ok: r.dmarcPolicy === "missing" ? "fail" : r.dmarcPolicy === "none" ? "warn" : "pass",
      text: r.dmarcPolicy === "missing" ? "DMARC Missing" : `DMARC p=${r.dmarcPolicy}`,
    }),
  },
  {
    key: "mx",
    label: "Checking mail routing (MX)...",
    passLabel: (r) => ({
      ok: r.mx.length ? "pass" : "warn",
      text: r.mx.length ? `Mail: ${r.mailProvider}` : "No MX Records Found",
    }),
  },
  {
    key: "dnssec",
    label: "Checking DNSSEC validation...",
    passLabel: (r) => ({
      ok: r.dnssec ? "pass" : "warn",
      text: r.dnssec ? "DNSSEC Validated" : "DNSSEC Not Enabled",
    }),
  },
  {
    key: "caa",
    label: "Checking CAA certificate policy...",
    passLabel: (r) => ({
      ok: r.caa ? "pass" : "warn",
      text: r.caa ? "CAA Record Set" : "No CAA Record",
    }),
  },
  {
    key: "tls",
    label: "Checking HSTS / transport policy...",
    passLabel: (r) =>
      !r.reachable
        ? { ok: "skip", text: "Not Checked" }
        : { ok: r.tlsBad ? "warn" : "pass", text: r.tlsBad ? "HSTS Not Set" : "HSTS Enabled" },
  },
  {
    key: "headers",
    label: "Checking security headers...",
    passLabel: (r) =>
      !r.reachable
        ? { ok: "skip", text: "Not Checked" }
        : {
            ok: r.headers ? "pass" : "warn",
            text: r.headersMissing.length
              ? `Missing: ${r.headersMissing.join(", ")}`
              : "All Security Headers Present",
          },
  },
  {
    key: "cookies",
    label: "Checking cookie security flags...",
    passLabel: (r) =>
      !r.cookiesChecked
        ? { ok: "skip", text: "No Cookies Set On Homepage" }
        : {
            ok: r.cookieIssues.length ? "warn" : "pass",
            text: r.cookieIssues.length
              ? `${r.cookieIssues.length} Cookie Flag Issue(s)`
              : "Cookies Correctly Flagged",
          },
  },
  {
    key: "mixed",
    label: "Checking for insecure (mixed) content...",
    passLabel: (r) =>
      !r.reachable
        ? { ok: "skip", text: "Not Checked" }
        : {
            ok: r.mixedContent ? "warn" : "pass",
            text: r.mixedContent
              ? `${r.mixedContent} Insecure HTTP Reference(s)`
              : "No Mixed Content",
          },
  },
  {
    key: "banner",
    label: "Checking software version disclosure...",
    passLabel: (r) =>
      !r.reachable
        ? { ok: "skip", text: "Not Checked" }
        : {
            ok: r.banner ? "warn" : "pass",
            text: r.banner ? `Version Disclosed — ${r.banner}` : "No Version Disclosure",
          },
  },
  {
    key: "files",
    label: "Probing for exposed sensitive files...",
    passLabel: (r) =>
      !r.exposedPathsChecked
        ? { ok: "skip", text: "Not Checked" }
        : {
            ok: r.exposedPaths.length ? "fail" : "pass",
            text: r.exposedPaths.length
              ? `Exposed: ${r.exposedPaths.map((p) => p.path).join(", ")}`
              : "No Exposed Sensitive Files",
          },
  },
  {
    key: "subdomains",
    label: "Enumerating subdomains via certificate logs...",
    passLabel: (r) =>
      !r.subdomainsChecked
        ? { ok: "skip", text: "Certificate Log Unavailable" }
        : {
            ok: r.subdomains.length > 25 ? "warn" : "pass",
            text: `${r.subdomains.length} Subdomain(s) In Public CT Logs`,
          },
  },
  {
    key: "ports",
    label: "Checking exposed alternate web ports...",
    passLabel: (r) =>
      !r.portsChecked
        ? { ok: "skip", text: "Not Checked" }
        : {
            ok: r.ports.length ? "warn" : "pass",
            text: r.ports.length
              ? `Open: ${r.ports.map((p) => p.name).join(", ")}`
              : "No Alternate Web Ports Open (8080/8443)",
          },
  },
  {
    key: "tech",
    label: "Fingerprinting website technologies...",
    passLabel: (r) => ({
      ok: r.tech.length ? "pass" : "skip",
      text: r.tech.length ? `Tech Detected: ${r.tech.join(", ")}` : "No Public Fingerprint",
    }),
  },
  {
    key: "breach",
    label: "Checking known data breaches...",
    passLabel: (r) =>
      !r.breach.checked
        ? { ok: "skip", text: r.emails.length ? "Breach Lookup Requires Licensed Data Source" : "No Email Provided (skipped)" }
        : {
            ok: r.breach.count ? "fail" : "pass",
            text: r.breach.count
              ? `${r.breach.count} Breach Exposure${r.breach.count === 1 ? "" : "s"} Found`
              : "No Known Breaches",
          },
  },
];
