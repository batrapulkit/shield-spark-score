//#region node_modules/.nitro/vite/services/ssr/assets/engine-B1qeQA5Y.js
function extractDomain(url) {
	try {
		return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
	} catch {
		return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
	}
}
function emptyScan(domain, emails) {
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
		breach: {
			count: 0,
			breaches: [],
			checked: false
		},
		tech: []
	};
}
function mockScan(domain, emails) {
	return {
		domain,
		emails,
		reachable: true,
		https: true,
		ssl: "valid",
		spf: true,
		dkim: false,
		dmarc: false,
		dmarcPolicy: "missing",
		tlsBad: false,
		headers: false,
		headersFound: [
			"HSTS",
			"X-Frame-Options",
			"X-Content-Type-Options"
		],
		headersMissing: [
			"CSP",
			"Referrer-Policy",
			"Permissions-Policy"
		],
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
			checked: emails.length > 0
		},
		tech: [
			"WordPress",
			"Nginx",
			"Google Analytics"
		]
	};
}
var SCAN_STEPS = [
	{
		key: "reach",
		label: "Resolving domain...",
		passLabel: (r) => ({
			ok: r.reachable ? "pass" : "warn",
			text: r.reachable ? "Site Reachable" : "Site Did Not Respond"
		})
	},
	{
		key: "https",
		label: "Checking HTTPS...",
		passLabel: (r) => !r.reachable ? {
			ok: "skip",
			text: "Not Checked"
		} : {
			ok: r.https ? "pass" : "fail",
			text: r.https ? "HTTPS Enforced" : "HTTPS Not Enforced"
		}
	},
	{
		key: "ssl",
		label: "Validating SSL certificate...",
		passLabel: (r) => !r.reachable ? {
			ok: "skip",
			text: "Not Checked"
		} : {
			ok: r.ssl === "valid" ? "pass" : "warn",
			text: r.ssl === "valid" ? "Certificate Valid" : "Certificate Issue"
		}
	},
	{
		key: "spf",
		label: "Looking up SPF record...",
		passLabel: (r) => ({
			ok: r.spf ? "pass" : "fail",
			text: r.spf ? "SPF Found" : "SPF Missing"
		})
	},
	{
		key: "dkim",
		label: "Looking up DKIM selectors...",
		passLabel: (r) => ({
			ok: r.dkim ? "pass" : "warn",
			text: r.dkim ? "DKIM Found" : "No DKIM On Common Selectors"
		})
	},
	{
		key: "dmarc",
		label: "Looking up DMARC record...",
		passLabel: (r) => ({
			ok: r.dmarcPolicy === "missing" ? "fail" : r.dmarcPolicy === "none" ? "warn" : "pass",
			text: r.dmarcPolicy === "missing" ? "DMARC Missing" : `DMARC p=${r.dmarcPolicy}`
		})
	},
	{
		key: "mx",
		label: "Checking mail routing (MX)...",
		passLabel: (r) => ({
			ok: r.mx.length ? "pass" : "warn",
			text: r.mx.length ? `Mail: ${r.mailProvider}` : "No MX Records Found"
		})
	},
	{
		key: "dnssec",
		label: "Checking DNSSEC validation...",
		passLabel: (r) => ({
			ok: r.dnssec ? "pass" : "warn",
			text: r.dnssec ? "DNSSEC Validated" : "DNSSEC Not Enabled"
		})
	},
	{
		key: "caa",
		label: "Checking CAA certificate policy...",
		passLabel: (r) => ({
			ok: r.caa ? "pass" : "warn",
			text: r.caa ? "CAA Record Set" : "No CAA Record"
		})
	},
	{
		key: "tls",
		label: "Checking HSTS / transport policy...",
		passLabel: (r) => !r.reachable ? {
			ok: "skip",
			text: "Not Checked"
		} : {
			ok: r.tlsBad ? "warn" : "pass",
			text: r.tlsBad ? "HSTS Not Set" : "HSTS Enabled"
		}
	},
	{
		key: "headers",
		label: "Checking security headers...",
		passLabel: (r) => !r.reachable ? {
			ok: "skip",
			text: "Not Checked"
		} : {
			ok: r.headers ? "pass" : "warn",
			text: r.headersMissing.length ? `Missing: ${r.headersMissing.join(", ")}` : "All Security Headers Present"
		}
	},
	{
		key: "cookies",
		label: "Checking cookie security flags...",
		passLabel: (r) => !r.cookiesChecked ? {
			ok: "skip",
			text: "No Cookies Set On Homepage"
		} : {
			ok: r.cookieIssues.length ? "warn" : "pass",
			text: r.cookieIssues.length ? `${r.cookieIssues.length} Cookie Flag Issue(s)` : "Cookies Correctly Flagged"
		}
	},
	{
		key: "mixed",
		label: "Checking for insecure (mixed) content...",
		passLabel: (r) => !r.reachable ? {
			ok: "skip",
			text: "Not Checked"
		} : {
			ok: r.mixedContent ? "warn" : "pass",
			text: r.mixedContent ? `${r.mixedContent} Insecure HTTP Reference(s)` : "No Mixed Content"
		}
	},
	{
		key: "banner",
		label: "Checking software version disclosure...",
		passLabel: (r) => !r.reachable ? {
			ok: "skip",
			text: "Not Checked"
		} : {
			ok: r.banner ? "warn" : "pass",
			text: r.banner ? `Version Disclosed — ${r.banner}` : "No Version Disclosure"
		}
	},
	{
		key: "files",
		label: "Probing for exposed sensitive files...",
		passLabel: (r) => !r.exposedPathsChecked ? {
			ok: "skip",
			text: "Not Checked"
		} : {
			ok: r.exposedPaths.length ? "fail" : "pass",
			text: r.exposedPaths.length ? `Exposed: ${r.exposedPaths.map((p) => p.path).join(", ")}` : "No Exposed Sensitive Files"
		}
	},
	{
		key: "subdomains",
		label: "Enumerating subdomains via certificate logs...",
		passLabel: (r) => !r.subdomainsChecked ? {
			ok: "skip",
			text: "Certificate Log Unavailable"
		} : {
			ok: r.subdomains.length > 25 ? "warn" : "pass",
			text: `${r.subdomains.length} Subdomain(s) In Public CT Logs`
		}
	},
	{
		key: "ports",
		label: "Checking exposed alternate web ports...",
		passLabel: (r) => !r.portsChecked ? {
			ok: "skip",
			text: "Not Checked"
		} : {
			ok: r.ports.length ? "warn" : "pass",
			text: r.ports.length ? `Open: ${r.ports.map((p) => p.name).join(", ")}` : "No Alternate Web Ports Open (8080/8443)"
		}
	},
	{
		key: "tech",
		label: "Fingerprinting website technologies...",
		passLabel: (r) => ({
			ok: r.tech.length ? "pass" : "skip",
			text: r.tech.length ? `Tech Detected: ${r.tech.join(", ")}` : "No Public Fingerprint"
		})
	},
	{
		key: "breach",
		label: "Checking known data breaches...",
		passLabel: (r) => !r.breach.checked ? {
			ok: "skip",
			text: r.emails.length ? "Breach Lookup Requires Licensed Data Source" : "No Email Provided (skipped)"
		} : {
			ok: r.breach.count ? "fail" : "pass",
			text: r.breach.count ? `${r.breach.count} Breach Exposure${r.breach.count === 1 ? "" : "s"} Found` : "No Known Breaches"
		}
	}
];
var SIZE_OPTIONS = [
	"Just me (no staff)",
	"2–9",
	"10–49",
	"50–99",
	"100–249",
	"250+"
];
var IT_OPTIONS = [
	"Me / the owner",
	"Someone on our team",
	"An outside IT company",
	"No one, really"
];
var SETUP_OPTIONS = [
	"Everything's in the cloud (Microsoft 365, Google…)",
	"Cloud plus some office computers",
	"We run our own server(s) on site",
	"Files mostly live on individual computers",
	"Not sure"
];
var INDUSTRY_OPTIONS = [
	"Healthcare / dental / clinic",
	"Retail / e-commerce",
	"Restaurant / hospitality",
	"Professional services (legal, accounting, consulting)",
	"Finance / insurance",
	"Transport / logistics / trucking",
	"Manufacturing / warehousing",
	"Real estate / brokerage",
	"Trades / construction",
	"Nonprofit / community",
	"Something else"
];
/** Industries with a framework / sensitive-data extra question. */
var INDUSTRY_META = {
	"Healthcare / dental / clinic": {
		framework: "HIPAA / PIPEDA (health data)",
		industryQuestion: "Do you store patient or client health information electronically (EHR/EMR)?",
		industryExplainer: "Health information is regulated. Storing it electronically raises the bar for security controls, access logging, and breach notification."
	},
	"Retail / e-commerce": {
		framework: "PCI-DSS (card payments)",
		industryQuestion: "Are you taking credit or debit card payments through a website, terminal, or app?",
		industryExplainer: "Card acceptance triggers PCI-DSS obligations. This shapes what network segmentation and monitoring you need."
	},
	"Professional services (legal, accounting, consulting)": {
		framework: "PIPEDA / confidentiality obligations",
		industryQuestion: "Do you handle confidential client documents, legal files, or financial records?",
		industryExplainer: "Client-confidential data creates duties of care that map to specific security controls and incident response steps."
	},
	"Finance / insurance": {
		framework: "PCI-DSS / GLBA (financial data)",
		industryQuestion: "Do you process or store client financial information?",
		industryExplainer: "Financial services regulators expect documented controls, monitoring, and third-party risk oversight."
	},
	"Real estate / brokerage": {
		framework: "FINTRAC / wire-fraud controls",
		industryQuestion: "Do you handle wire transfers, deposits, or client financial information?",
		industryExplainer: "Real-estate wire-fraud is one of the top attack patterns. Verification steps and monitoring matter."
	}
};
var QUICK_QUESTIONS = [
	{
		id: "emailmfa",
		phase: "QUICK",
		question: "When signing in to work accounts, does everyone have to confirm the login using their phone or an authentication app?",
		explainer: "Multi-Factor Authentication (MFA) adds an extra layer of security. Even if a password is stolen, attackers usually can't access the account without the second verification step.",
		options: [
			{
				label: "Yes",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 2
	},
	{
		id: "edr",
		phase: "QUICK",
		question: "Is every work computer protected with antivirus or security software that stays up to date?",
		explainer: "Security software helps detect and block viruses, ransomware, and other threats. It only works well if it's installed and updated on every business device.",
		options: [
			{
				label: "Yes",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 2
	},
	{
		id: "backup",
		phase: "QUICK",
		question: "Are your important business files backed up regularly, stored separately, and tested to make sure they can be restored?",
		explainer: "Backups help you recover important files after ransomware, hardware failure, or accidental deletion. A backup is only useful if it can actually be restored when needed.",
		options: [
			{
				label: "Yes",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 2
	},
	{
		id: "train",
		phase: "QUICK",
		question: "Do your employees receive regular training on how to spot phishing emails and online scams?",
		explainer: "Most cyberattacks begin with a convincing email or message. Regular training helps employees recognize scams before they become costly incidents.",
		options: [
			{
				label: "Yes",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 2
	},
	{
		id: "incident",
		phase: "QUICK",
		question: "If your business was hacked tomorrow, would your team know exactly what to do first?",
		explainer: "Having a simple response plan helps reduce downtime and damage. Knowing who to contact and what actions to take can make a major difference during an attack.",
		options: [
			{
				label: "Yes",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 2
	},
	{
		id: "verify",
		phase: "QUICK",
		question: "If a supplier asked to change their bank details, would your team always verify it by phone before making a payment?",
		explainer: "Criminals often impersonate suppliers and request payment changes. Verifying requests using a trusted phone number helps prevent invoice and payment fraud.",
		options: [
			{
				label: "Yes",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 2
	}
];
var DEEP_QUESTIONS = [
	{
		id: "devices",
		phase: "DEEP",
		question: "Approximately how many computers, laptops, and servers are used for your business?",
		explainer: "The number of devices helps estimate the size of your technology environment and the level of protection your business may need.",
		options: [
			{
				label: "1–5",
				value: null
			},
			{
				label: "6–10",
				value: null
			},
			{
				label: "11–25",
				value: null
			},
			{
				label: "26–50",
				value: null
			},
			{
				label: "51+",
				value: null
			},
			{
				label: "Not sure",
				value: null
			}
		],
		weight: 0
	},
	{
		id: "emailtype",
		phase: "DEEP",
		question: "Does your business use its own email address (such as you@yourcompany.com), or free email services like Gmail or Outlook?",
		explainer: "Business email domains provide greater control over security, branding, and email protection than personal email accounts.",
		options: [
			{
				label: "Own domain",
				value: 1
			},
			{
				label: "A mix",
				value: .5
			},
			{
				label: "Free",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 1
	},
	{
		id: "assets",
		phase: "DEEP",
		question: "Do you keep a list of the computers, software, and online services your business uses?",
		explainer: "You can't protect what you don't know exists. Keeping an inventory makes it easier to manage updates, security, and support.",
		options: [
			{
				label: "Yes",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 1
	},
	{
		id: "patching",
		phase: "DEEP",
		question: "Are software updates installed regularly on all business computers and applications?",
		explainer: "Many cyberattacks exploit known software flaws that have already been fixed. Regular updates help close these security gaps.",
		options: [
			{
				label: "Yes",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 1
	},
	{
		id: "pw",
		phase: "DEEP",
		question: "Does everyone use a different, strong password for each work account?",
		explainer: "Reusing passwords means one stolen password can unlock multiple accounts. Unique passwords greatly reduce this risk.",
		options: [
			{
				label: "Manager",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 1
	},
	{
		id: "accessoff",
		phase: "DEEP",
		question: "When an employee leaves, are all of their work accounts disabled right away?",
		explainer: "Former employees should no longer have access to business systems. Removing accounts promptly helps prevent unauthorized access.",
		options: [
			{
				label: "Yes",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 1
	},
	{
		id: "monitor",
		phase: "DEEP",
		question: "Would you know if someone logged into your business accounts from another country or unusual location?",
		explainer: "Early detection helps stop attacks before they cause serious damage. Alerts can identify unusual logins or suspicious activity quickly.",
		options: [
			{
				label: "Yes",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 1
	},
	{
		id: "aiuse",
		phase: "DEEP",
		question: "Does your team use AI tools like ChatGPT, Microsoft Copilot, or Gemini for work?",
		explainer: "This helps us understand how AI is being used in your business and identify any related security considerations.",
		options: [
			{
				label: "Yes regularly",
				value: 0
			},
			{
				label: "Some",
				value: 0
			},
			{
				label: "No",
				value: 1
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 0
	},
	{
		id: "airules",
		phase: "DEEP",
		question: "Does your team know what business information should never be shared with AI tools like ChatGPT or Copilot?",
		explainer: "Employees should know what information is safe to share with AI tools. Clear guidelines help prevent confidential data from being exposed.",
		options: [
			{
				label: "Yes",
				value: 1
			},
			{
				label: "Sort of",
				value: .5
			},
			{
				label: "No",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 1
	},
	{
		id: "incidenthistory",
		phase: "DEEP",
		question: "Has your business experienced a cyberattack or data breach in the last two years?",
		explainer: "Previous incidents can highlight areas that may still need improvement. Understanding past events helps us provide more relevant recommendations.",
		options: [
			{
				label: "No",
				value: 1
			},
			{
				label: "Not sure",
				value: .5
			},
			{
				label: "Yes",
				value: 0
			}
		],
		weight: 2
	},
	{
		id: "remotework",
		phase: "DEEP",
		question: "Do employees work from home or use personal devices for work?",
		explainer: "Remote work and personal devices can increase security risks if they aren't properly managed.",
		options: [
			{
				label: "No",
				value: 1
			},
			{
				label: "Sometimes",
				value: .5
			},
			{
				label: "Yes",
				value: 0
			},
			{
				label: "Not sure",
				value: 0
			}
		],
		weight: 1
	}
];
function answerValue(qid, answer) {
	if (answer == null) return null;
	const q = [...QUICK_QUESTIONS, ...DEEP_QUESTIONS].find((x) => x.id === qid);
	if (!q) return null;
	const opt = q.options.find((o) => o.label === answer);
	return opt ? opt.value : null;
}
function isSolo(profile) {
	return profile.size === "Just me (no staff)";
}
function isLocalNet(profile) {
	return profile.setup === "Cloud plus some office computers" || profile.setup === "We run our own server(s) on site" || profile.setup === "Files mostly live on individual computers";
}
function staff10plus(profile) {
	return profile.size === "10–49" || profile.size === "50–99" || profile.size === "100–249" || profile.size === "250+";
}
function ownServer(profile) {
	return profile.setup === "We run our own server(s) on site";
}
function devices11plus(a) {
	return a.devices === "11–25" || a.devices === "26–50" || a.devices === "51+";
}
function isSensitive(profile, a) {
	return !!(profile.industry && INDUSTRY_META[profile.industry] && a.industryData === "Yes");
}
function computeScore(profile, answers, scan) {
	const all = [...QUICK_QUESTIONS, ...DEEP_QUESTIONS];
	let numerator = 0;
	let denominator = 0;
	for (const q of all) {
		if (q.weight === 0) continue;
		if (q.id === "train" && isSolo(profile)) continue;
		if (q.id === "accessoff" && isSolo(profile)) continue;
		if (q.id === "airules" && answers.aiuse === "No") continue;
		const v = answerValue(q.id, answers[q.id]);
		if (v == null) continue;
		numerator += v * q.weight;
		denominator += q.weight;
	}
	const base = denominator > 0 ? numerator / denominator * 100 : 0;
	let penalties = 0;
	if (scan) {
		if (!scan.spf) penalties += 6;
		if (!scan.dmarc) penalties += 10;
		if (scan.reachable && !scan.https) penalties += 8;
		if (scan.tlsBad) penalties += 5;
		if (scan.reachable && !scan.headers) penalties += 4;
		if (scan.exposedPathsChecked) penalties += Math.min(24, scan.exposedPaths.length * 12);
		if (scan.cookiesChecked && scan.cookieIssues.length) penalties += 3;
		if (scan.mixedContent > 0) penalties += 3;
		if (scan.banner) penalties += 2;
		if (scan.portsChecked && scan.ports.length > 0) penalties += 4;
		if (scan.breach.checked) penalties += Math.min(20, scan.breach.count * 6);
	}
	const final = Math.round(Math.max(0, Math.min(100, base - penalties * .6)));
	const band = final <= 40 ? "Exposed" : final <= 70 ? "Developing" : "Resilient";
	return {
		base: Math.round(base),
		penalties,
		final,
		band,
		bandColor: band === "Exposed" ? "var(--danger)" : band === "Developing" ? "var(--warning)" : "var(--success)",
		totalWeight: denominator,
		answeredWeight: denominator
	};
}
function computeFlags(profile, answers, scan) {
	const av = (id) => answerValue(id, answers[id]);
	const answered = (id) => answers[id] != null;
	const emailmfa = av("emailmfa") != null && (av("emailmfa") ?? 1) < 1;
	const edr = av("edr") != null && (av("edr") ?? 1) < 1;
	const backup = av("backup") != null && (av("backup") ?? 1) < 1;
	const train = !isSolo(profile) && answered("train") && (av("train") ?? 1) < 1;
	const incident = av("incident") != null && (av("incident") ?? 1) < 1;
	const verify = av("verify") != null && (av("verify") ?? 1) < 1;
	const emailtype = answered("emailtype") && answers.emailtype !== "Own domain";
	const assets = answered("assets") && (av("assets") ?? 1) < 1;
	const patching = answered("patching") && (av("patching") ?? 1) < 1;
	const pw = answered("pw") && (av("pw") ?? 1) < 1;
	const aiPolicy = answered("airules") && answers.aiuse !== "No" && (av("airules") ?? 1) < 1;
	const incidentHistory = answers.incidenthistory === "Yes";
	const remote = answers.remotework === "Yes" || answers.remotework === "Sometimes";
	const sensitive = isSensitive(profile, answers);
	const breaches = scan?.breach.count ?? 0;
	const monitor = answered("monitor") && (av("monitor") ?? 1) < 1 && (staff10plus(profile) || sensitive || breaches > 0);
	const soc = monitor;
	const msp = profile.it === "Me / the owner" || profile.it === "No one, really" || isLocalNet(profile) && profile.it !== "An outside IT company" || patching;
	const m365Consolidation = [
		emailtype,
		emailmfa,
		edr
	].filter(Boolean).length >= 2;
	return {
		emailmfa,
		edr,
		backup,
		train,
		incident,
		verify,
		emailtype,
		assets,
		patching,
		pw,
		monitor,
		aiPolicy,
		incidentHistory,
		remote,
		soc,
		msp,
		pentest: (scan?.ports.length ?? 0) > 0 || (scan?.exposedPaths.length ?? 0) > 0 || sensitive,
		compliance: !!(profile.industry && INDUSTRY_META[profile.industry]),
		insurance: emailmfa || edr || backup || train || incident,
		m365Consolidation
	};
}
function buildRecommendations(profile, flags, scan) {
	const cards = [];
	if (scan && scan.breach.checked && scan.breach.count > 0) cards.push({
		id: "breached-accounts",
		order: 1.5,
		title: "Change passwords for breached accounts",
		priority: "Critical",
		category: "Identity & Credentials",
		impact: "Compromised credentials allow attackers to bypass standard perimeter security.",
		why: `Your email address (${scan.emails.join(", ")}) was found in ${scan.breach.count} public data breach(es) (${scan.breach.breaches.slice(0, 3).join(", ")}${scan.breach.count > 3 ? "..." : ""}). If you reuse passwords, those accounts are highly vulnerable.`,
		fix: "Immediately change the password for any accounts using this email, ensuring you use unique passwords generated by a password manager for each site. Ensure MFA is enabled wherever possible."
	});
	const industryFramework = profile.industry ? INDUSTRY_META[profile.industry]?.framework : void 0;
	if (industryFramework) cards.push({
		id: "industry-note",
		order: 0,
		title: `Industry framework: ${industryFramework}`,
		priority: "Medium",
		category: "Compliance",
		impact: "Regulators and clients expect specific controls for your industry.",
		why: `For a ${profile.industry} business, ${industryFramework} is the standard to aim for. Aligning early reduces audit friction and shows customers you take their data seriously.`,
		fix: "Map current controls to the framework and close the gaps first."
	});
	if (flags.m365Consolidation) {
		const covered = [
			flags.emailtype && "business email domain",
			flags.emailmfa && "MFA on all accounts",
			flags.edr && "endpoint security (EDR)"
		].filter(Boolean);
		cards.push({
			id: "m365",
			order: 1,
			title: "Consolidate on Microsoft 365 Business Premium (or Google Workspace)",
			priority: "Critical",
			category: "Identity & Email",
			impact: "One licence closes several gaps at once — email, identity, MFA, and endpoint protection.",
			why: `One move covers several of these: ${covered.join(", ")}. Business Premium bundles the controls most SMBs are missing today.`,
			fix: "Move email to Microsoft 365 Business Premium, enforce MFA, and deploy Defender for Business to every device.",
			diyGuide: "guide-mfa"
		});
	} else if (flags.emailmfa) cards.push({
		id: "mfa",
		order: 1,
		title: "Enable Multi-Factor Authentication (MFA) for all business accounts",
		priority: "Critical",
		category: "Identity",
		impact: "MFA blocks the vast majority of account takeover attempts, even when passwords leak.",
		why: "Attackers routinely try stolen passwords against business email and cloud apps. MFA stops most of these in their tracks.",
		fix: "Turn on MFA in your identity provider and require it for every user, every sign-in.",
		diyGuide: "guide-mfa"
	});
	if (flags.backup) cards.push({
		id: "backup",
		order: 2,
		title: "Make your backups real — separate and tested",
		priority: "Critical",
		category: "Resilience",
		impact: "Untested backups routinely fail during ransomware recovery. Tested backups get you back online.",
		why: "Backups only count if they are isolated from your main network and restore successfully when it matters.",
		fix: "Set an off-site or immutable backup, schedule a monthly restore test, and document the runbook.",
		diyGuide: "guide-backup"
	});
	if (flags.train) cards.push({
		id: "train",
		order: 3,
		title: "Teach the team to spot scams",
		priority: "High",
		category: "Human Risk",
		impact: "Phishing is still the #1 entry point. A trained team is your cheapest and fastest control.",
		why: "Regular, short training + simulated phishing turns your team into an active detection layer.",
		fix: "Roll out a monthly 5-minute training + quarterly phishing simulation.",
		diyGuide: "guide-phish"
	});
	if (flags.incident) cards.push({
		id: "incident",
		order: 4,
		title: "Write your one-page incident plan",
		priority: "High",
		category: "Business Resilience",
		impact: "The first hour of an incident decides the cost. A plan cuts confusion and downtime.",
		why: "Everyone should know who to call, what to shut down, and how to communicate with clients.",
		fix: "Draft a one-page plan with roles, phone numbers, and top-5 first actions. Rehearse it once a year."
	});
	if (flags.assets) cards.push({
		id: "assets",
		order: 5,
		title: "Start with a simple asset list — free Cyber Starter Kit",
		priority: "Medium",
		category: "Governance",
		impact: "You cannot protect what you cannot see.",
		why: "An asset list is the foundation of patching, access control, and offboarding.",
		fix: "Use the free Shield Cyber Starter Kit template to inventory devices, apps, and cloud services.",
		diyGuide: "kit"
	});
	if (flags.edr && !flags.m365Consolidation) cards.push({
		id: "edr",
		order: 6,
		title: "Put security software (EDR) on every device",
		priority: "Critical",
		category: "Endpoint",
		impact: "Modern EDR stops ransomware, malware, and living-off-the-land attacks that antivirus alone misses.",
		why: "Every laptop, desktop and server needs continuous protection — not just the ones you remember.",
		fix: "Deploy a modern EDR (Defender for Business, SentinelOne, CrowdStrike) to 100% of devices."
	});
	if (flags.pw) cards.push({
		id: "pw",
		order: 7,
		title: "Sort out passwords with a password manager",
		priority: "High",
		category: "Identity",
		impact: "Reused passwords let one breach unlock every account. A manager fixes this in an afternoon.",
		why: "Password managers generate unique passwords automatically and stop phishing sites from auto-filling.",
		fix: "Roll out a business password manager (1Password, Bitwarden, Dashlane) to the whole team.",
		diyGuide: "guide-pw"
	});
	if (flags.verify) cards.push({
		id: "verify",
		order: 8,
		title: "Add a verify-the-request rule for payments",
		priority: "High",
		category: "Fraud Prevention",
		impact: "Business Email Compromise costs Canadian SMBs millions each year. A phone-check rule stops most of it.",
		why: "Any request to change bank details or wire money should be verified via a known phone number, not email.",
		fix: "Document the rule, add it to your finance runbook, and drill it once a quarter.",
		diyGuide: "guide-phish"
	});
	if (flags.aiPolicy) cards.push({
		id: "aiPolicy",
		order: 9,
		title: "Set a simple AI-use rule",
		priority: "Medium",
		category: "Data Protection",
		impact: "Employees paste customer and financial data into public AI tools without realising the risk.",
		why: "A short written rule (what you can/can't paste, approved tools) keeps confidential data inside the business.",
		fix: "Publish a one-page AI-use rule and enable enterprise AI tools where possible.",
		diyGuide: "guide-ai"
	});
	if (flags.pentest) cards.push({
		id: "pentest",
		order: 10,
		title: "Penetration test on internet-facing services",
		priority: "High",
		category: "Infrastructure",
		impact: "External services facing the internet are targeted continuously. An annual pen test finds what scanners miss.",
		why: "You have exposed services or sensitive data — a periodic external test validates the controls actually work.",
		fix: "Book an annual external penetration test and remediate high/critical findings within 30 days.",
		diyGuide: "guide-pentest"
	});
	if (flags.compliance && industryFramework) cards.push({
		id: "compliance",
		order: 11,
		title: `Compliance prep: ${industryFramework}`,
		priority: "Medium",
		category: "Compliance",
		impact: "Getting ahead of the framework avoids emergency projects when clients or regulators ask.",
		why: `Likely relevant: ${industryFramework}. Building against the framework early is cheaper than retrofitting.`,
		fix: "Do a gap assessment against the framework and prioritise the top-5 controls."
	});
	if (flags.soc) cards.push({
		id: "soc",
		order: 12,
		title: "Ongoing monitoring (SOC / MDR)",
		priority: "High",
		category: "Detection & Response",
		impact: "Most breaches sit undetected for weeks. 24/7 monitoring catches them in hours.",
		why: "Your size, sensitivity, or breach history means monitoring is now a foundational control.",
		fix: "Subscribe to an MDR/SOC service that watches identity, endpoints, and cloud around the clock."
	});
	if (flags.msp) cards.push({
		id: "msp",
		order: 13,
		title: "Managed IT support",
		priority: "Medium",
		category: "Operations",
		impact: "Patching, backups, and account cleanup fall through the cracks without a dedicated owner.",
		why: "You either don't have a full-time IT person or your setup mixes cloud and on-prem in ways that need a specialist.",
		fix: "Engage a managed IT provider for baseline hygiene: patching, backups, MFA, and offboarding."
	});
	if (flags.insurance) cards.push({
		id: "insurance",
		order: 14,
		title: "Cyber insurance readiness",
		priority: "Medium",
		category: "Risk Transfer",
		impact: "Insurers now require MFA, EDR, backups, training, and an incident plan for renewal.",
		why: "Any big-five gap can invalidate a claim or triple your premium at renewal.",
		fix: "Close the big-five gaps first, then review cyber insurance limits with your broker."
	});
	if (flags.incidentHistory) cards.push({
		id: "incidentHistory",
		order: 15,
		title: "Post-incident hardening review",
		priority: "High",
		category: "Business Resilience",
		impact: "A previous cyber incident increases future risk. A detailed security review is recommended.",
		why: "Attackers often revisit victims. Confirming remediation and closing residual access is critical.",
		fix: "Run a focused security review to confirm the incident is fully closed and controls are in place."
	});
	if (flags.remote) cards.push({
		id: "remote",
		order: 16,
		title: "Secure remote work and personal devices",
		priority: "Medium",
		category: "Endpoint",
		impact: "Remote and BYOD devices are outside your office network — they need explicit protection.",
		why: "Without policies and device protection, personal laptops can bring malware straight into your business data.",
		fix: "Publish a remote-work policy, require MFA + EDR on any device used for work."
	});
	return cards.sort((a, b) => a.order - b.order);
}
function computeND(profile, answers, scan, decisionMaker, score) {
	const useful = isLocalNet(profile) && !isSolo(profile) && (staff10plus(profile) || ownServer(profile) || devices11plus(answers) || profile.it === "Me / the owner" || profile.it === "No one, really");
	const authority = decisionMaker === "Yes, I decide" || decisionMaker === "I share that decision";
	const sensitive = isSensitive(profile, answers);
	const breaches = scan?.breach.count ?? 0;
	const worthIt = score < 70 || sensitive || breaches > 0;
	if (!useful) return {
		qualified: false,
		reason: "No internal network worth scanning (all-cloud / very small)",
		gate1Pass: false,
		gate2Pass: authority,
		gate3Pass: worthIt
	};
	if (!authority) return {
		qualified: false,
		reason: "Not the decision-maker — nurture first",
		gate1Pass: true,
		gate2Pass: false,
		gate3Pass: worthIt
	};
	if (!worthIt) return {
		qualified: false,
		reason: "Already in good shape — scan not a priority",
		gate1Pass: true,
		gate2Pass: true,
		gate3Pass: false
	};
	return {
		qualified: true,
		reason: "Qualified: internal footprint + decision-maker + real exposure",
		gate1Pass: true,
		gate2Pass: true,
		gate3Pass: true
	};
}
function computePriority(flags, scan, sensitive, scoreVal, decisionMaker) {
	let p = 0;
	if (decisionMaker === "Yes, I decide") p += 2;
	else if (decisionMaker === "I share that decision") p += 1;
	const fitFlags = [
		flags.emailmfa,
		flags.edr,
		flags.backup,
		flags.train,
		flags.incident,
		flags.verify,
		flags.emailtype,
		flags.assets,
		flags.pw,
		flags.monitor,
		flags.aiPolicy,
		flags.soc,
		flags.msp,
		flags.pentest,
		flags.insurance
	].filter(Boolean).length;
	p += fitFlags;
	if ((scan?.breach.count ?? 0) > 0) p += 2;
	if (sensitive) p += 2;
	if (scoreVal < 40) p += 2;
	return {
		score: p,
		band: p >= 7 ? "Hot" : p >= 4 ? "Warm" : "Cool"
	};
}
function categorySubscores(profile, answers) {
	const av = (id) => answerValue(id, answers[id]);
	const pct = (vals) => {
		const filtered = vals.filter((v) => v != null);
		if (!filtered.length) return null;
		return Math.round(filtered.reduce((a, b) => a + b, 0) / filtered.length * 100);
	};
	return [
		{
			key: "Email Security",
			value: pct([av("emailmfa"), av("emailtype")])
		},
		{
			key: "Infrastructure",
			value: pct([av("edr"), av("patching")])
		},
		{
			key: "Identity Protection",
			value: pct([
				av("emailmfa"),
				av("pw"),
				av("accessoff")
			])
		},
		{
			key: "Human Risk",
			value: pct([av("train"), av("verify")])
		},
		{
			key: "Business Resilience",
			value: pct([
				av("backup"),
				av("incident"),
				av("monitor")
			])
		},
		{
			key: "Data Protection",
			value: pct([av("assets"), av("airules")])
		}
	];
}
function executiveSummary(score, band, flags) {
	const gaps = [];
	if (flags.emailmfa || flags.emailtype) gaps.push("email security and identity");
	if (flags.backup) gaps.push("backup resilience");
	if (flags.train || flags.verify) gaps.push("human risk");
	if (flags.edr || flags.patching) gaps.push("endpoint hygiene");
	if (flags.monitor) gaps.push("monitoring");
	const top = gaps.slice(0, 2).join(" and ") || "a few smaller controls";
	const uplift = Math.min(30, (flags.emailmfa ? 6 : 0) + (flags.edr ? 5 : 0) + (flags.backup ? 5 : 0) + (flags.train ? 3 : 0) + (flags.incident ? 3 : 0) + (flags.verify ? 3 : 0) + (flags.monitor ? 3 : 0));
	return `${band === "Resilient" ? "Your organization demonstrates strong foundational cybersecurity practices." : band === "Developing" ? "Your organization demonstrates good foundational cybersecurity practices, but several controls require attention." : "Your organization has meaningful gaps across foundational cybersecurity controls that need immediate attention."} ${top.charAt(0).toUpperCase() + top.slice(1)} present the highest priority. Addressing the flagged items could improve your Shield Score by approximately ${uplift} points and materially reduce business risk.`;
}
//#endregion
export { extractDomain as _, QUICK_QUESTIONS as a, SIZE_OPTIONS as c, computeFlags as d, computeND as f, executiveSummary as g, emptyScan as h, IT_OPTIONS as i, buildRecommendations as l, computeScore as m, INDUSTRY_META as n, SCAN_STEPS as o, computePriority as p, INDUSTRY_OPTIONS as r, SETUP_OPTIONS as s, DEEP_QUESTIONS as t, categorySubscores as u, isSensitive as v, mockScan as y };
