import type { ScanResult } from "./types";
import dnsPromises from "node:dns/promises";
import https from "node:https";
import http from "node:http";

const DOH = "https://cloudflare-dns.com/dns-query";
const UA = "ShieldScore/1.0 (+passive-scan)";

async function fetchDomainBypassingSsl(
  url: string,
  depth = 0
): Promise<{ reachable: boolean; headers: Headers; html: string; finalUrl: string }> {
  if (depth > 5) {
    throw new Error("Too many redirects");
  }

  return new Promise((resolve, reject) => {
    try {
      const parsed = new URL(url);
      const isHttps = parsed.protocol === "https:";
      const client = isHttps ? https : http;

      const options: https.RequestOptions = {
        hostname: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: "GET",
        headers: { "User-Agent": UA },
        timeout: 10000,
      };

      if (isHttps) {
        options.agent = new https.Agent({ rejectUnauthorized: false });
      }

      const req = client.request(options, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, url).toString();
          fetchDomainBypassingSsl(redirectUrl, depth + 1)
            .then(resolve)
            .catch(() => {
              const headers = new Headers();
              for (const [key, val] of Object.entries(res.headers)) {
                if (val !== undefined) {
                  headers.set(key, Array.isArray(val) ? val.join(", ") : val);
                }
              }
              resolve({
                reachable: true,
                headers,
                html: "",
                finalUrl: url,
              });
            });
          return;
        }

        const headers = new Headers();
        for (const [key, val] of Object.entries(res.headers)) {
          if (val !== undefined) {
            headers.set(key, Array.isArray(val) ? val.join(", ") : val);
          }
        }

        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          if (body.length < 300000) {
            body += chunk;
          }
        });
        res.on("end", () => {
          resolve({
            reachable: true,
            headers,
            html: body,
            finalUrl: url,
          });
        });
      });

      req.on("error", (err) => {
        reject(err);
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Timeout"));
      });

      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

async function dnsQuery(name: string, type: string) {
  try {
    const res = await fetch(`${DOH}?name=${encodeURIComponent(name)}&type=${type}`, {
      headers: { accept: "application/dns-json" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    return (await res.json()) as {
      AD?: boolean;
      Answer?: { data: string; type: number }[];
    };
  } catch {
    return null;
  }
}

async function systemDns(
  name: string,
  type: "TXT" | "A" | "MX" | "CNAME" | "NS" | "CAA"
): Promise<string[]> {
  try {
    if (type === "TXT") {
      const records = await dnsPromises.resolveTxt(name);
      return records.map(r => r.join(" "));
    }
    if (type === "A") {
      return await dnsPromises.resolve4(name);
    }
    if (type === "MX") {
      const records = await dnsPromises.resolveMx(name);
      return records.map((r) => `${r.priority} ${r.exchange}`);
    }
    if (type === "CNAME") {
      return await dnsPromises.resolveCname(name);
    }
    if (type === "NS") {
      return await dnsPromises.resolveNs(name);
    }
    if (type === "CAA") {
      const records = await dnsPromises.resolveCaa(name);
      return records.map((r: any) => `${r.critical ?? r.flag ?? 0} ${r.tag} "${r.value}"`);
    }
    return [];
  } catch (err: any) {
    if (err.code !== "ENODATA" && err.code !== "ENOTFOUND") {
      console.warn(`System DNS query failed for ${name} (${type}):`, err.message || err);
    }
    return [];
  }
}

async function dns(name: string, type: "TXT" | "A" | "MX" | "CNAME" | "NS" | "CAA") {
  // 1. Try local system DNS resolution first (robust, VPN/intranet safe)
  try {
    const list = await systemDns(name, type);
    if (list && list.length > 0) {
      return list;
    }
  } catch {
    // Fall back to DoH
  }

  // 2. DoH alternative
  const json = await dnsQuery(name, type);
  return (json?.Answer ?? []).map((a) =>
    a.data.replace(/^"|"$/g, "").replace(/"\s*"/g, ""),
  );
}

const DKIM_SELECTORS = [
  "selector1",
  "selector2",
  "google",
  "default",
  "k1",
  "k2",
  "s1",
  "s2",
  "mail",
  "dkim",
  "zoho",
  "mandrill",
  "everlytickey1",
];

async function hasDkim(domain: string) {
  const results = await Promise.all(
    DKIM_SELECTORS.map(async (sel) => {
      const host = `${sel}._domainkey.${domain}`;
      const [txt, cname] = await Promise.all([dns(host, "TXT"), dns(host, "CNAME")]);
      return txt.some((t) => /v=DKIM1|p=[A-Za-z0-9+/]/i.test(t)) || cname.length > 0;
    }),
  );
  return results.some(Boolean);
}

function detectMailProvider(mx: string[]): string | null {
  const joined = mx.join(" ").toLowerCase();
  if (/google|googlemail/.test(joined)) return "Google Workspace";
  if (/outlook|protection\.outlook|microsoft/.test(joined)) return "Microsoft 365";
  if (/zoho/.test(joined)) return "Zoho Mail";
  if (/proton/.test(joined)) return "Proton Mail";
  if (/mimecast/.test(joined)) return "Mimecast";
  if (/barracuda/.test(joined)) return "Barracuda";
  if (/secureserver|godaddy/.test(joined)) return "GoDaddy";
  if (/ionos|1and1/.test(joined)) return "IONOS";
  if (/mailgun|sendgrid|mailchimp/.test(joined)) return "Transactional provider";
  if (/cpanel|hostgator|bluehost|namecheap|privateemail/.test(joined))
    return "Shared hosting mail";
  return mx.length ? "Self-hosted / other" : null;
}

function detectTech(headers: Headers, html: string) {
  const tech = new Set<string>();
  const server = (headers.get("server") ?? "").toLowerCase();
  const powered = (headers.get("x-powered-by") ?? "").toLowerCase();
  if (headers.get("cf-ray") || server.includes("cloudflare")) tech.add("Cloudflare");
  if (server.includes("nginx")) tech.add("Nginx");
  if (server.includes("apache")) tech.add("Apache");
  if (server.includes("microsoft-iis")) tech.add("IIS");
  if (powered.includes("php")) tech.add("PHP");
  if (powered.includes("asp.net")) tech.add("ASP.NET");
  if (headers.get("x-shopify-stage") || /cdn\.shopify\.com/i.test(html)) tech.add("Shopify");
  if (/wp-content|wp-includes/i.test(html)) tech.add("WordPress");
  if (/_next\/static/i.test(html)) tech.add("Next.js");
  if (/googletagmanager\.com|google-analytics\.com/i.test(html)) tech.add("Google Analytics");
  if (/js\.hs-scripts\.com|hubspot/i.test(html)) tech.add("HubSpot");
  if (/wix\.com|parastorage/i.test(html)) tech.add("Wix");
  if (/squarespace/i.test(html)) tech.add("Squarespace");
  if (/webflow/i.test(html)) tech.add("Webflow");
  return [...tech];
}

// Version-disclosing banners are a real, low-severity finding.
function versionBanner(headers: Headers): string | null {
  for (const key of ["server", "x-powered-by", "x-aspnet-version"]) {
    const v = headers.get(key);
    if (v && /\d+\.\d+/.test(v)) return `${key}: ${v}`;
  }
  return null;
}

function cookieProblems(headers: Headers): { issues: string[]; checked: boolean } {
  const raw =
    typeof (headers as unknown as { getSetCookie?: () => string[] }).getSetCookie ===
    "function"
      ? (headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
      : headers.get("set-cookie")
        ? [headers.get("set-cookie")!]
        : [];
  if (!raw.length) return { issues: [], checked: false };
  const issues: string[] = [];
  for (const c of raw) {
    const name = c.split("=")[0]?.trim() ?? "cookie";
    if (!/;\s*secure/i.test(c)) issues.push(`${name}: no Secure`);
    if (!/;\s*httponly/i.test(c)) issues.push(`${name}: no HttpOnly`);
    if (!/;\s*samesite/i.test(c)) issues.push(`${name}: no SameSite`);
  }
  return { issues: issues.slice(0, 6), checked: true };
}

// Certificate Transparency logs are public and need no API key.
async function ctSubdomains(domain: string): Promise<string[] | null> {
  try {
    const res = await fetch(
      `https://crt.sh/?q=${encodeURIComponent(`%.${domain}`)}&output=json`,
      { headers: { accept: "application/json", "user-agent": UA }, signal: AbortSignal.timeout(15000) },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as { name_value?: string }[];
    const set = new Set<string>();
    for (const r of rows) {
      for (const n of (r.name_value ?? "").split("\n")) {
        const host = n.trim().toLowerCase();
        if (!host || host.startsWith("*.") || !host.endsWith(domain)) continue;
        if (host === domain) continue;
        set.add(host);
      }
    }
    return [...set].sort();
  } catch {
    return null;
  }
}

const SENSITIVE_PATHS: { path: string; detail: string; match: RegExp }[] = [
  { path: "/.env", detail: "Environment file publicly readable", match: /^[A-Z0-9_]+=|APP_KEY|DB_PASSWORD/m },
  { path: "/.git/HEAD", detail: "Git repository exposed", match: /^ref:\s+refs\// },
  { path: "/wp-config.php.bak", detail: "WordPress config backup exposed", match: /DB_PASSWORD|define\(/ },
  { path: "/server-status", detail: "Apache server-status page public", match: /Apache Server Status/i },
  { path: "/phpinfo.php", detail: "phpinfo() page public", match: /phpinfo\(\)|PHP Version/i },
  { path: "/backup.zip", detail: "Backup archive publicly downloadable", match: /^PK/ },
];

async function probePath(base: string, p: (typeof SENSITIVE_PATHS)[number]) {
  try {
    const res = await fetch(`${base}${p.path}`, {
      redirect: "manual",
      headers: { "user-agent": UA },
      signal: AbortSignal.timeout(6000),
    });
    if (res.status !== 200) return null;
    const body = (await res.text()).slice(0, 4000);
    if (/<html/i.test(body) && !p.match.test(body)) return null; // custom 200 error page
    if (!p.match.test(body)) return null;
    return { path: p.path, detail: p.detail };
  } catch {
    return null;
  }
}

// Only ports reachable over HTTP(S) from a serverless runtime — reported honestly.
const WEB_PORTS: { port: number; name: string; scheme: "http" | "https" }[] = [
  { port: 8080, name: "HTTP alt (8080)", scheme: "http" },
  { port: 8443, name: "HTTPS alt (8443)", scheme: "https" },
];

async function probePort(domain: string, p: (typeof WEB_PORTS)[number]) {
  try {
    const res = await fetch(`${p.scheme}://${domain}:${p.port}/`, {
      redirect: "manual",
      headers: { "user-agent": UA },
      signal: AbortSignal.timeout(5000),
    });
    return res.status > 0 ? { port: p.port, name: p.name } : null;
  } catch {
    return null;
  }
}

export async function fetchEmailBreaches(email: string): Promise<string[]> {
  if (!email || !email.includes("@")) return [];
  try {
    const res = await fetch(`https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`, {
      headers: { "user-agent": UA },
      signal: AbortSignal.timeout(6000),
    });
    if (res.status === 404) {
      return [];
    }
    if (!res.ok) {
      return [];
    }
    const data = await res.json() as { breaches?: unknown };
    if (data && data.breaches && Array.isArray(data.breaches)) {
      const flatList = data.breaches.flat();
      return flatList.filter((b): b is string => typeof b === "string");
    }
    return [];
  } catch (err) {
    console.error(`Error checking breaches for ${email}:`, err);
    return [];
  }
}

export async function scanDomain(domain: string, emails: string[]): Promise<ScanResult> {

  const [txt, dmarcTxt, dkim, mxRaw, nsRaw, caaRaw, dnssecJson, breachListRaw] = await Promise.all([
    dns(domain, "TXT"),
    dns(`_dmarc.${domain}`, "TXT"),
    hasDkim(domain),
    dns(domain, "MX"),
    dns(domain, "NS"),
    dns(domain, "CAA"),
    dnsQuery(domain, "A"),
    Promise.all(emails.map((e) => fetchEmailBreaches(e))),
  ]);

  const spf = txt.some((t) => /v=spf1/i.test(t));
  const dmarcRecord = dmarcTxt.find((t) => /v=DMARC1/i.test(t));
  const dmarc = Boolean(dmarcRecord && !/p=none/i.test(dmarcRecord));
  const mx = mxRaw
    .map((m) => m.replace(/^\d+\s+/, "").replace(/\.$/, ""))
    .filter(Boolean);
  const nameservers = nsRaw.map((n) => n.replace(/\.$/, ""));

  let https = false;
  let ssl: "valid" | "weak" = "weak";
  let hsts = false;
  let tech: string[] = [];
  let reachable = false;
  let headersFound: string[] = [];
  let headersMissing: string[] = [];
  let cookieIssues: string[] = [];
  let cookiesChecked = false;
  let mixedContent = 0;
  let banner: string | null = null;

  try {
    const res = await fetchDomainBypassingSsl(`https://${domain}/`);




    reachable = true;
    https = res.finalUrl.startsWith("https://");
    ssl = "valid"; // a completed TLS handshake means the chain validated
    const h = res.headers;
    const checks: [string, string][] = [
      ["strict-transport-security", "HSTS"],
      ["content-security-policy", "CSP"],
      ["x-frame-options", "X-Frame-Options"],
      ["x-content-type-options", "X-Content-Type-Options"],
      ["referrer-policy", "Referrer-Policy"],
      ["permissions-policy", "Permissions-Policy"],
    ];
    for (const [key, label] of checks) {
      if (h.get(key)) headersFound.push(label);
      else headersMissing.push(label);
    }
    hsts = headersFound.includes("HSTS");
    banner = versionBanner(h);
    const ck = cookieProblems(h);
    cookieIssues = ck.issues;
    cookiesChecked = ck.checked;
    const html = res.html.slice(0, 300_000);
    tech = detectTech(h, html);
    mixedContent = (
      html.match(/(?:src|href)=["']http:\/\/(?!localhost)/gi) ?? []
    ).length;
  } catch {
    reachable = false;
  }

  const base = reachable ? `https://${domain}` : null;
  const [subs, exposedRaw, portsRaw] = await Promise.all([
    ctSubdomains(domain),
    base
      ? Promise.all(SENSITIVE_PATHS.map((p) => probePath(base, p)))
      : Promise.resolve(null),
    Promise.all(WEB_PORTS.map((p) => probePort(domain, p))),
  ]);

  const exposedPaths = (exposedRaw ?? []).filter(Boolean) as {
    path: string;
    detail: string;
  }[];
  const ports = portsRaw.filter(Boolean) as { port: number; name: string }[];

  return {
    domain,
    emails,
    reachable,
    https,
    ssl,
    spf,
    dkim,
    dmarc,
    dmarcPolicy: dmarcRecord
      ? /p=none/i.test(dmarcRecord)
        ? "none"
        : /p=quarantine/i.test(dmarcRecord)
          ? "quarantine"
          : "reject"
      : "missing",
    tlsBad: reachable && !hsts,
    headers: headersFound.length >= 4,
    headersFound,
    headersMissing,
    mx,
    mailProvider: detectMailProvider(mx),
    caa: caaRaw.length > 0,
    dnssec: Boolean(dnssecJson?.AD),
    nameservers,
    subdomains: subs ?? [],
    subdomainsChecked: subs !== null,
    exposedPaths,
    exposedPathsChecked: exposedRaw !== null,
    cookieIssues,
    cookiesChecked,
    mixedContent,
    banner,
    ports,
    portsChecked: true,
    breach: {
      count: [...new Set(breachListRaw.flat())].length,
      breaches: [...new Set(breachListRaw.flat())],
      checked: emails.length > 0,
    },
    tech,
  };
}
