import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as objectType, r as stringType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan.functions-BmO3NvZ6.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var DOH = "https://cloudflare-dns.com/dns-query";
var UA = "ShieldScore/1.0 (+passive-scan)";
async function dnsQuery(name, type) {
	try {
		const res = await fetch(`${DOH}?name=${encodeURIComponent(name)}&type=${type}`, {
			headers: { accept: "application/dns-json" },
			signal: AbortSignal.timeout(6e3)
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}
async function dns(name, type) {
	return ((await dnsQuery(name, type))?.Answer ?? []).map((a) => a.data.replace(/^"|"$/g, "").replace(/"\s*"/g, ""));
}
var DKIM_SELECTORS = [
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
	"everlytickey1"
];
async function hasDkim(domain) {
	return (await Promise.all(DKIM_SELECTORS.map(async (sel) => {
		const host = `${sel}._domainkey.${domain}`;
		const [txt, cname] = await Promise.all([dns(host, "TXT"), dns(host, "CNAME")]);
		return txt.some((t) => /v=DKIM1|p=[A-Za-z0-9+/]/i.test(t)) || cname.length > 0;
	}))).some(Boolean);
}
function detectMailProvider(mx) {
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
	if (/cpanel|hostgator|bluehost|namecheap|privateemail/.test(joined)) return "Shared hosting mail";
	return mx.length ? "Self-hosted / other" : null;
}
function detectTech(headers, html) {
	const tech = /* @__PURE__ */ new Set();
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
function versionBanner(headers) {
	for (const key of [
		"server",
		"x-powered-by",
		"x-aspnet-version"
	]) {
		const v = headers.get(key);
		if (v && /\d+\.\d+/.test(v)) return `${key}: ${v}`;
	}
	return null;
}
function cookieProblems(headers) {
	const raw = typeof headers.getSetCookie === "function" ? headers.getSetCookie() : headers.get("set-cookie") ? [headers.get("set-cookie")] : [];
	if (!raw.length) return {
		issues: [],
		checked: false
	};
	const issues = [];
	for (const c of raw) {
		const name = c.split("=")[0]?.trim() ?? "cookie";
		if (!/;\s*secure/i.test(c)) issues.push(`${name}: no Secure`);
		if (!/;\s*httponly/i.test(c)) issues.push(`${name}: no HttpOnly`);
		if (!/;\s*samesite/i.test(c)) issues.push(`${name}: no SameSite`);
	}
	return {
		issues: issues.slice(0, 6),
		checked: true
	};
}
async function ctSubdomains(domain) {
	try {
		const res = await fetch(`https://crt.sh/?q=${encodeURIComponent(`%.${domain}`)}&output=json`, {
			headers: {
				accept: "application/json",
				"user-agent": UA
			},
			signal: AbortSignal.timeout(15e3)
		});
		if (!res.ok) return null;
		const rows = await res.json();
		const set = /* @__PURE__ */ new Set();
		for (const r of rows) for (const n of (r.name_value ?? "").split("\n")) {
			const host = n.trim().toLowerCase();
			if (!host || host.startsWith("*.") || !host.endsWith(domain)) continue;
			if (host === domain) continue;
			set.add(host);
		}
		return [...set].sort();
	} catch {
		return null;
	}
}
var SENSITIVE_PATHS = [
	{
		path: "/.env",
		detail: "Environment file publicly readable",
		match: /^[A-Z0-9_]+=|APP_KEY|DB_PASSWORD/m
	},
	{
		path: "/.git/HEAD",
		detail: "Git repository exposed",
		match: /^ref:\s+refs\//
	},
	{
		path: "/wp-config.php.bak",
		detail: "WordPress config backup exposed",
		match: /DB_PASSWORD|define\(/
	},
	{
		path: "/server-status",
		detail: "Apache server-status page public",
		match: /Apache Server Status/i
	},
	{
		path: "/phpinfo.php",
		detail: "phpinfo() page public",
		match: /phpinfo\(\)|PHP Version/i
	},
	{
		path: "/backup.zip",
		detail: "Backup archive publicly downloadable",
		match: /^PK/
	}
];
async function probePath(base, p) {
	try {
		const res = await fetch(`${base}${p.path}`, {
			redirect: "manual",
			headers: { "user-agent": UA },
			signal: AbortSignal.timeout(6e3)
		});
		if (res.status !== 200) return null;
		const body = (await res.text()).slice(0, 4e3);
		if (/<html/i.test(body) && !p.match.test(body)) return null;
		if (!p.match.test(body)) return null;
		return {
			path: p.path,
			detail: p.detail
		};
	} catch {
		return null;
	}
}
var WEB_PORTS = [{
	port: 8080,
	name: "HTTP alt (8080)",
	scheme: "http"
}, {
	port: 8443,
	name: "HTTPS alt (8443)",
	scheme: "https"
}];
async function probePort(domain, p) {
	try {
		return (await fetch(`${p.scheme}://${domain}:${p.port}/`, {
			redirect: "manual",
			headers: { "user-agent": UA },
			signal: AbortSignal.timeout(5e3)
		})).status > 0 ? {
			port: p.port,
			name: p.name
		} : null;
	} catch {
		return null;
	}
}
async function scanDomain(domain, emails) {
	const [txt, dmarcTxt, dkim, mxRaw, nsRaw, caaRaw, dnssecJson] = await Promise.all([
		dns(domain, "TXT"),
		dns(`_dmarc.${domain}`, "TXT"),
		hasDkim(domain),
		dns(domain, "MX"),
		dns(domain, "NS"),
		dns(domain, "CAA"),
		dnsQuery(domain, "A")
	]);
	const spf = txt.some((t) => /v=spf1/i.test(t));
	const dmarcRecord = dmarcTxt.find((t) => /v=DMARC1/i.test(t));
	const dmarc = Boolean(dmarcRecord && !/p=none/i.test(dmarcRecord));
	const mx = mxRaw.map((m) => m.replace(/^\d+\s+/, "").replace(/\.$/, "")).filter(Boolean);
	const nameservers = nsRaw.map((n) => n.replace(/\.$/, ""));
	let https = false;
	let ssl = "weak";
	let hsts = false;
	let tech = [];
	let reachable = false;
	let headersFound = [];
	let headersMissing = [];
	let cookieIssues = [];
	let cookiesChecked = false;
	let mixedContent = 0;
	let banner = null;
	try {
		const res = await fetch(`https://${domain}/`, {
			redirect: "follow",
			headers: { "user-agent": UA },
			signal: AbortSignal.timeout(1e4)
		});
		reachable = true;
		https = res.url.startsWith("https://");
		ssl = "valid";
		const h = res.headers;
		for (const [key, label] of [
			["strict-transport-security", "HSTS"],
			["content-security-policy", "CSP"],
			["x-frame-options", "X-Frame-Options"],
			["x-content-type-options", "X-Content-Type-Options"],
			["referrer-policy", "Referrer-Policy"],
			["permissions-policy", "Permissions-Policy"]
		]) if (h.get(key)) headersFound.push(label);
		else headersMissing.push(label);
		hsts = headersFound.includes("HSTS");
		banner = versionBanner(h);
		const ck = cookieProblems(h);
		cookieIssues = ck.issues;
		cookiesChecked = ck.checked;
		const html = (await res.text().catch(() => "")).slice(0, 3e5);
		tech = detectTech(h, html);
		mixedContent = (html.match(/(?:src|href)=["']http:\/\/(?!localhost)/gi) ?? []).length;
	} catch {
		reachable = false;
	}
	const base = reachable ? `https://${domain}` : null;
	const [subs, exposedRaw, portsRaw] = await Promise.all([
		ctSubdomains(domain),
		base ? Promise.all(SENSITIVE_PATHS.map((p) => probePath(base, p))) : Promise.resolve(null),
		Promise.all(WEB_PORTS.map((p) => probePort(domain, p)))
	]);
	const exposedPaths = (exposedRaw ?? []).filter(Boolean);
	const ports = portsRaw.filter(Boolean);
	return {
		domain,
		emails,
		reachable,
		https,
		ssl,
		spf,
		dkim,
		dmarc,
		dmarcPolicy: dmarcRecord ? /p=none/i.test(dmarcRecord) ? "none" : /p=quarantine/i.test(dmarcRecord) ? "quarantine" : "reject" : "missing",
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
			count: 0,
			breaches: [],
			checked: false
		},
		tech
	};
}
var runScan_createServerFn_handler = createServerRpc({
	id: "ad940233a7c2d0ace956d672c49a239de172d3560a825a8e562ab161369076d0",
	name: "runScan",
	filename: "src/lib/assessment/scan.functions.ts"
}, (opts) => runScan.__executeServer(opts));
var runScan = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	domain: stringType().min(3),
	emails: arrayType(stringType()).default([])
}).parse(data)).handler(runScan_createServerFn_handler, async ({ data }) => scanDomain(data.domain, data.emails));
//#endregion
export { runScan_createServerFn_handler };
