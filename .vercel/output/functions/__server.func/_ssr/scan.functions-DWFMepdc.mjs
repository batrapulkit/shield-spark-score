import { n as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { a as objectType, i as enumType, n as arrayType, o as stringType, r as booleanType, t as anyType } from "../_libs/zod.mjs";
import { d as computeFlags, f as computeND, m as computeScore, p as computePriority, v as isSensitive, y as mockScan } from "./engine-B1qeQA5Y.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import nodeHTTP from "node:http";
import nodeHTTPS from "node:https";
import dnsPromises from "node:dns/promises";
import * as fs from "fs";
import * as path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/scan.functions-DWFMepdc.js
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
async function fetchDomainBypassingSsl(url, depth = 0) {
	if (depth > 5) throw new Error("Too many redirects");
	return new Promise((resolve, reject) => {
		try {
			const parsed = new URL(url);
			const isHttps = parsed.protocol === "https:";
			const client = isHttps ? nodeHTTPS : nodeHTTP;
			const options = {
				hostname: parsed.hostname,
				port: parsed.port || (isHttps ? 443 : 80),
				path: parsed.pathname + parsed.search,
				method: "GET",
				headers: { "User-Agent": UA },
				timeout: 1e4
			};
			if (isHttps) options.agent = new nodeHTTPS.Agent({ rejectUnauthorized: false });
			const req = client.request(options, (res) => {
				if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
					fetchDomainBypassingSsl(new URL(res.headers.location, url).toString(), depth + 1).then(resolve).catch(() => {
						const headers = new Headers();
						for (const [key, val] of Object.entries(res.headers)) if (val !== void 0) headers.set(key, Array.isArray(val) ? val.join(", ") : val);
						resolve({
							reachable: true,
							headers,
							html: "",
							finalUrl: url
						});
					});
					return;
				}
				const headers = new Headers();
				for (const [key, val] of Object.entries(res.headers)) if (val !== void 0) headers.set(key, Array.isArray(val) ? val.join(", ") : val);
				let body = "";
				res.setEncoding("utf8");
				res.on("data", (chunk) => {
					if (body.length < 3e5) body += chunk;
				});
				res.on("end", () => {
					resolve({
						reachable: true,
						headers,
						html: body,
						finalUrl: url
					});
				});
			});
			req.on("error", (err) => {
				reject(err);
			});
			req.on("timeout", () => {
				req.destroy();
				reject(/* @__PURE__ */ new Error("Timeout"));
			});
			req.end();
		} catch (err) {
			reject(err);
		}
	});
}
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
async function systemDns(name, type) {
	try {
		if (type === "TXT") return (await dnsPromises.resolveTxt(name)).map((r) => r.join(" "));
		if (type === "A") return await dnsPromises.resolve4(name);
		if (type === "MX") return (await dnsPromises.resolveMx(name)).map((r) => `${r.priority} ${r.exchange}`);
		if (type === "CNAME") return await dnsPromises.resolveCname(name);
		if (type === "NS") return await dnsPromises.resolveNs(name);
		if (type === "CAA") return (await dnsPromises.resolveCaa(name)).map((r) => `${r.critical ?? r.flag ?? 0} ${r.tag} "${r.value}"`);
		return [];
	} catch (err) {
		if (err.code !== "ENODATA" && err.code !== "ENOTFOUND") console.warn(`System DNS query failed for ${name} (${type}):`, err.message || err);
		return [];
	}
}
async function dns(name, type) {
	try {
		const list = await systemDns(name, type);
		if (list && list.length > 0) return list;
	} catch {}
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
async function fetchEmailBreaches(email) {
	if (!email || !email.includes("@")) return [];
	try {
		const res = await fetch(`https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`, {
			headers: { "user-agent": UA },
			signal: AbortSignal.timeout(6e3)
		});
		if (res.status === 404) return [];
		if (!res.ok) return [];
		const data = await res.json();
		if (data && data.breaches && Array.isArray(data.breaches)) return data.breaches.flat().filter((b) => typeof b === "string");
		return [];
	} catch (err) {
		console.error(`Error checking breaches for ${email}:`, err);
		return [];
	}
}
async function scanDomain(domain, emails) {
	const [txt, dmarcTxt, dkim, mxRaw, nsRaw, caaRaw, dnssecJson, breachListRaw] = await Promise.all([
		dns(domain, "TXT"),
		dns(`_dmarc.${domain}`, "TXT"),
		hasDkim(domain),
		dns(domain, "MX"),
		dns(domain, "NS"),
		dns(domain, "CAA"),
		dnsQuery(domain, "A"),
		Promise.all(emails.map((e) => fetchEmailBreaches(e)))
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
		const res = await fetchDomainBypassingSsl(`https://${domain}/`);
		reachable = true;
		https = res.finalUrl.startsWith("https://");
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
		const html = res.html.slice(0, 3e5);
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
			count: [...new Set(breachListRaw.flat())].length,
			breaches: [...new Set(breachListRaw.flat())],
			checked: emails.length > 0
		},
		tech
	};
}
var supabaseUrl = process.env.SUPABASE_URL;
var supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
var supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
var supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
var supabaseAdminClient = supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey) ? createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey || "", { auth: { persistSession: false } }) : null;
var LOCAL_DB_PATH = path.join(process.cwd(), "tmp", "local_db.json");
function ensureLocalDb() {
	const dir = path.dirname(LOCAL_DB_PATH);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
	if (!fs.existsSync(LOCAL_DB_PATH)) fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({
		submissions: [],
		settings: null
	}, null, 2));
}
function readLocalDb() {
	ensureLocalDb();
	try {
		return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf-8"));
	} catch (err) {
		console.error("Failed to read local fallback DB:", err);
		return {
			submissions: [],
			settings: null
		};
	}
}
function writeLocalDb(data) {
	ensureLocalDb();
	try {
		fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
	} catch (err) {
		console.error("Failed to write to local fallback DB:", err);
	}
}
async function saveSubmissionToDb(lead, profile, answers, scan) {
	const scoreResult = computeScore(profile, answers, scan);
	const newRecord = {
		name: lead.name,
		email: lead.email,
		business: lead.business || null,
		phone: lead.phone || null,
		role: lead.role || null,
		decision_maker: lead.decisionMaker,
		consent: lead.consent,
		score: scoreResult.final,
		scan_result: scan,
		answers,
		profile,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	const clientToUse = supabaseAdminClient || supabase;
	if (clientToUse) try {
		console.log(`Saving submission in Supabase for ${lead.email}...`);
		const { data, error } = await clientToUse.from("submissions").insert(newRecord).select();
		if (error) throw error;
		console.log("Successfully saved submission to Supabase.");
		return data;
	} catch (err) {
		console.warn("Supabase insertion failed. Falling back to local file database. Error:", err);
	}
	else console.warn("Supabase client not initialized. Falling back to local file database.");
	const db = readLocalDb();
	db.submissions = db.submissions.filter((s) => s.email !== lead.email);
	db.submissions.unshift(newRecord);
	writeLocalDb(db);
	console.log("Successfully saved submission to local fallback database file.");
	return [newRecord];
}
async function getSubmissions() {
	let remoteSubmissions = [];
	if (supabaseAdminClient) try {
		const { data, error } = await supabaseAdminClient.from("submissions").select("*").neq("email", "_settings@shield-identity.local").order("created_at", { ascending: false });
		if (error) throw error;
		if (data) remoteSubmissions = data;
	} catch (err) {
		console.warn("Could not fetch submissions from Supabase remote DB, returning cached data. Reason:", err.message || err);
	}
	const db = readLocalDb();
	const merged = [...remoteSubmissions];
	const remoteEmails = new Set(remoteSubmissions.map((s) => s.email));
	for (const localSub of db.submissions) if (!remoteEmails.has(localSub.email)) merged.push(localSub);
	return merged.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
}
async function deleteSubmission(email) {
	const db = readLocalDb();
	db.submissions = db.submissions.filter((s) => s.email !== email);
	writeLocalDb(db);
	console.log(`Deleted submission for ${email} from local database.`);
	if (supabaseAdminClient) try {
		const { error } = await supabaseAdminClient.from("submissions").delete().eq("email", email);
		if (error) throw error;
		console.log(`Deleted remote submission for ${email} in Supabase.`);
	} catch (err) {
		console.warn("Could not delete from remote Supabase table:", err);
	}
	return { success: true };
}
async function getGlobalSettings() {
	if (supabaseAdminClient) try {
		const { data, error } = await supabaseAdminClient.from("submissions").select("answers").eq("email", "_settings@shield-identity.local").maybeSingle();
		if (error) throw error;
		if (data?.answers) return data.answers;
	} catch (err) {
		console.log("Could not load global settings from Supabase, loading from local cache. Reason:", err.message || err);
	}
	return readLocalDb().settings;
}
async function saveGlobalSettings(settings) {
	const db = readLocalDb();
	db.settings = settings;
	writeLocalDb(db);
	console.log("Global settings saved to local database file.");
	if (supabaseAdminClient) try {
		const { data: existing, error: checkError } = await supabaseAdminClient.from("submissions").select("email").eq("email", "_settings@shield-identity.local").maybeSingle();
		if (checkError) throw checkError;
		const payload = {
			email: "_settings@shield-identity.local",
			name: "Global Settings",
			business: "Shield Score System",
			phone: "0000000000",
			role: "System Admin",
			decision_maker: "Yes, I decide",
			consent: true,
			score: 100,
			answers: settings,
			profile: {},
			scan_result: {}
		};
		let query;
		if (existing) query = supabaseAdminClient.from("submissions").update(payload).eq("email", "_settings@shield-identity.local");
		else query = supabaseAdminClient.from("submissions").insert(payload);
		const { data, error } = await query.select();
		if (error) throw error;
		console.log("Successfully saved settings to remote Supabase DB.");
		return data;
	} catch (err) {
		console.warn("Could not save settings to remote Supabase DB. Saved locally instead. Reason:", err.message || err);
	}
	return [settings];
}
var cachedToken = null;
var tokenExpiresAt = 0;
async function getZohoAccessToken() {
	const now = Date.now();
	if (cachedToken && tokenExpiresAt > now + 6e4) return cachedToken;
	const clientId = process.env.ZOHO_CLIENT_ID;
	const clientSecret = process.env.ZOHO_CLIENT_SECRET;
	const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
	const oauthUrl = process.env.ZOHO_OAUTH_URL || "https://accounts.zohocloud.ca/oauth/v2/token";
	if (!clientId || !clientSecret || !refreshToken) throw new Error("Missing Zoho credentials in environment variables.");
	console.log("Refreshing Zoho access token...");
	const response = await fetch(oauthUrl, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			refresh_token: refreshToken,
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: "refresh_token"
		})
	});
	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(`Failed to refresh Zoho token: status ${response.status}, body: ${errorBody}`);
	}
	const data = await response.json();
	cachedToken = data.access_token;
	tokenExpiresAt = now + data.expires_in * 1e3;
	console.log("Successfully refreshed Zoho access token. Expires in:", data.expires_in, "seconds.");
	return cachedToken;
}
async function createZohoLead(lead, profile, answers, scan) {
	const token = await getZohoAccessToken();
	const apiBase = process.env.ZOHO_API_BASE || "https://www.zohoapis.ca/crm/v7";
	console.log(`Submitting lead ${lead.email} to Zoho CRM...`);
	const score = computeScore(profile, answers, scan);
	const priority = computePriority(computeFlags(profile, answers, scan), scan, isSensitive(profile, answers), score.final, lead.decisionMaker);
	const nd = computeND(profile, answers, scan, lead.decisionMaker, score.final);
	const [firstName, ...lastNameParts] = lead.name.trim().split(" ");
	const lastName = lastNameParts.join(" ") || firstName;
	const descriptionParts = [
		`=== SHIELD SECURITY SCORE REPORT ===`,
		`Shield Score: ${score.final}/100 (${score.band})`,
		`Priority Tier: ${priority.band} (Priority Score: ${priority.score}/15)`,
		`Complimentary Network Scan Qualified: ${nd.qualified ? "Yes" : "No"}`,
		`Reason: ${nd.reason}`,
		``,
		`=== ORGANIZATION PROFILE ===`,
		`Industry: ${profile.industry || "Not Answered"}`,
		`Size: ${profile.size || "Not Answered"}`,
		`IT Management: ${profile.it || "Not Answered"}`,
		`Structure: ${profile.setup || "Not Answered"}`,
		``,
		`=== EMAIL & DOMAIN PASSIVE SCAN ===`,
		`Domain: ${scan?.domain || lead.business}`,
		`Reachable: ${scan?.reachable ? "Yes" : "No"}`,
		`HTTPS enabled: ${scan?.https ? "Yes" : "No"}`,
		`SPF configured: ${scan?.spf ? "Yes" : "No"}`,
		`DKIM configured: ${scan?.dkim ? "Yes" : "No"}`,
		`DMARC policy: ${scan?.dmarcPolicy || "N/A"}`,
		`Exposed credentials count: ${scan?.breach?.checked ? scan.breach.count : "Not checked"}`,
		scan?.breach?.count && scan.breach.count > 0 ? `Breached databases: ${scan.breach.breaches.join(", ")}` : null,
		``,
		`=== CRITICAL COMPLIANCE DETAILS ===`,
		`Consent to Contact: ${lead.consent ? "Yes" : "No"}`,
		`Is Decision Maker: ${lead.decisionMaker}`
	].filter((p) => p !== null);
	const payload = { data: [{
		First_Name: lastNameParts.length > 0 ? firstName : "",
		Last_Name: lastName,
		Company: lead.business || "N/A",
		Email: lead.email,
		Phone: lead.phone,
		Designation: lead.role,
		Lead_Source: "Cybersecurity Shield Score Scan",
		Description: descriptionParts.join("\n")
	}] };
	const response = await fetch(`${apiBase}/Leads`, {
		method: "POST",
		headers: {
			Authorization: `Zoho-oauthtoken ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(payload)
	});
	if (!response.ok) {
		const errorBody = await response.text();
		console.error(`Zoho CRM Lead submission error: status ${response.status}, body: ${errorBody}`);
		throw new Error(`Zoho API error: ${response.statusText}`);
	}
	const result = await response.json();
	console.log(`Successfully created Zoho Lead. ID: ${result?.data?.[0]?.details?.id || "unknown"}`);
	return result;
}
var runScan_createServerFn_handler = createServerRpc({
	id: "ad940233a7c2d0ace956d672c49a239de172d3560a825a8e562ab161369076d0",
	name: "runScan",
	filename: "src/lib/assessment/scan.functions.ts"
}, (opts) => runScan.__executeServer(opts));
var runScan = createServerFn({ method: "POST" }).validator((data) => objectType({
	domain: stringType().min(3),
	emails: arrayType(stringType()).default([])
}).parse(data)).handler(runScan_createServerFn_handler, async ({ data }) => {
	try {
		const settings = await getGlobalSettings();
		if (settings && settings.scanMode === "mock") {
			console.log(`[Scan Engine] Running simulated MOCK scan for domain: ${data.domain}`);
			return mockScan(data.domain, data.emails);
		}
	} catch (err) {
		console.warn("Error checking scan settings, falling back to authentic scan:", err);
	}
	return scanDomain(data.domain, data.emails);
});
var runBreachCheck_createServerFn_handler = createServerRpc({
	id: "137eb6da1c2bb411071b447657c3ca0b01fb27723c9aceee5344950ea628ef54",
	name: "runBreachCheck",
	filename: "src/lib/assessment/scan.functions.ts"
}, (opts) => runBreachCheck.__executeServer(opts));
var runBreachCheck = createServerFn({ method: "POST" }).validator((data) => objectType({ email: stringType().email() }).parse(data)).handler(runBreachCheck_createServerFn_handler, async ({ data }) => {
	const breaches = await fetchEmailBreaches(data.email);
	return {
		count: breaches.length,
		breaches,
		checked: true
	};
});
var submitToCrm_createServerFn_handler = createServerRpc({
	id: "8323e29f9d7562c5cb171a71ee40ef0b477fd7aa0fad52be5b34941916ddbb8b",
	name: "submitToCrm",
	filename: "src/lib/assessment/scan.functions.ts"
}, (opts) => submitToCrm.__executeServer(opts));
var submitToCrm = createServerFn({ method: "POST" }).validator((data) => objectType({
	lead: anyType(),
	profile: anyType(),
	answers: anyType(),
	scan: anyType().nullable()
}).parse(data)).handler(submitToCrm_createServerFn_handler, async ({ data }) => {
	let dbSuccess = false;
	let crmSuccess = false;
	let dbResult = null;
	let crmResult = null;
	let isCrmSyncEnabled = true;
	try {
		const settings = await getGlobalSettings();
		if (settings && settings.zohoEnabled === false) isCrmSyncEnabled = false;
	} catch (err) {
		console.warn("Could not check settings for Zoho status, defaulting to enabled:", err);
	}
	try {
		dbResult = await saveSubmissionToDb(data.lead, data.profile, data.answers, data.scan);
		dbSuccess = true;
	} catch (dbError) {
		console.error("Failed to save submission to Supabase:", dbError);
	}
	if (isCrmSyncEnabled) try {
		crmResult = await createZohoLead(data.lead, data.profile, data.answers, data.scan);
		crmSuccess = true;
	} catch (crmError) {
		console.error("Failed to sync lead to Zoho CRM:", crmError);
	}
	else {
		console.log("Zoho CRM sync skipped because it is disabled in global settings.");
		crmResult = {
			status: "skipped",
			message: "CRM Sync disabled in system settings"
		};
	}
	return {
		db: {
			success: dbSuccess,
			data: dbResult
		},
		crm: {
			success: crmSuccess,
			data: crmResult
		}
	};
});
var getAdminSettings_createServerFn_handler = createServerRpc({
	id: "0e5ce2c2379f46651d1689363e13062dc53a8d8a3510279ce290c4ac8ec52e2c",
	name: "getAdminSettings",
	filename: "src/lib/assessment/scan.functions.ts"
}, (opts) => getAdminSettings.__executeServer(opts));
var getAdminSettings = createServerFn({ method: "GET" }).handler(getAdminSettings_createServerFn_handler, async () => {
	try {
		return await getGlobalSettings() || {
			calendlyUrl: "https://shield-identity.com/contact",
			zohoEnabled: true,
			scanMode: "authentic"
		};
	} catch (err) {
		console.error("Failed to load settings server-side, returning defaults:", err);
		return {
			calendlyUrl: "https://shield-identity.com/contact",
			zohoEnabled: true,
			scanMode: "authentic"
		};
	}
});
var saveAdminSettings_createServerFn_handler = createServerRpc({
	id: "d2d8ec452e6ddeed8030f790214ec130168c0286abc060f78f21b7cf7ee1ef20",
	name: "saveAdminSettings",
	filename: "src/lib/assessment/scan.functions.ts"
}, (opts) => saveAdminSettings.__executeServer(opts));
var saveAdminSettings = createServerFn({ method: "POST" }).validator((data) => objectType({
	password: stringType(),
	settings: objectType({
		calendlyUrl: stringType().url(),
		zohoEnabled: booleanType(),
		scanMode: enumType(["authentic", "mock"])
	})
}).parse(data)).handler(saveAdminSettings_createServerFn_handler, async ({ data }) => {
	const expectedPassword = process.env.ADMIN_PASSWORD || "shield-admin-2026";
	if (data.password !== expectedPassword) throw new Error("Unauthorized: Invalid password");
	return saveGlobalSettings(data.settings);
});
var getSubmissionsList_createServerFn_handler = createServerRpc({
	id: "307b6fee2df828a49966abc4bd4192e2f2e0882307bde0bb563b35183d4c6050",
	name: "getSubmissionsList",
	filename: "src/lib/assessment/scan.functions.ts"
}, (opts) => getSubmissionsList.__executeServer(opts));
var getSubmissionsList = createServerFn({ method: "POST" }).validator((data) => objectType({ password: stringType() }).parse(data)).handler(getSubmissionsList_createServerFn_handler, async ({ data }) => {
	const expectedPassword = process.env.ADMIN_PASSWORD || "shield-admin-2026";
	if (data.password !== expectedPassword) throw new Error("Unauthorized: Invalid password");
	return getSubmissions();
});
var deleteSubmissionRecord_createServerFn_handler = createServerRpc({
	id: "0ee3879f33d0346abaf75b01d1eb8cb265a666fb1e26ea0414c654a7562bd714",
	name: "deleteSubmissionRecord",
	filename: "src/lib/assessment/scan.functions.ts"
}, (opts) => deleteSubmissionRecord.__executeServer(opts));
var deleteSubmissionRecord = createServerFn({ method: "POST" }).validator((data) => objectType({
	password: stringType(),
	email: stringType()
}).parse(data)).handler(deleteSubmissionRecord_createServerFn_handler, async ({ data }) => {
	const expectedPassword = process.env.ADMIN_PASSWORD || "shield-admin-2026";
	if (data.password !== expectedPassword) throw new Error("Unauthorized: Invalid password");
	return deleteSubmission(data.email);
});
//#endregion
export { deleteSubmissionRecord_createServerFn_handler, getAdminSettings_createServerFn_handler, getSubmissionsList_createServerFn_handler, runBreachCheck_createServerFn_handler, runScan_createServerFn_handler, saveAdminSettings_createServerFn_handler, submitToCrm_createServerFn_handler };
