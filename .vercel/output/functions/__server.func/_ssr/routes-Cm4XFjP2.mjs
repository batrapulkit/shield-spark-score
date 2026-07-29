import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as objectType, r as stringType, t as arrayType } from "../_libs/zod.mjs";
import { a as AnimatePresence, i as motion, n as useTransform, r as useMotionValue, t as animate } from "../_libs/framer-motion.mjs";
import { C as Award, S as BadgeCheck, T as ArrowLeft, _ as ChevronDown, a as Sparkles, b as Building2, c as MapPin, d as LoaderCircle, f as Globe, g as CircleMinus, h as CircleQuestionMark, i as TrendingUp, l as Mail, m as Cloud, n as Users, o as ShieldCheck, p as Download, r as TriangleAlert, s as ServerOff, t as X, u as Lock, v as Check, w as ArrowRight, x as Briefcase, y as CalendarCheck } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as useForm } from "../_libs/react-hook-form.mjs";
import { a as CartesianGrid, c as PolarAngleAxis, d as Tooltip, i as XAxis, l as PolarGrid, n as BarChart, o as Bar, r as YAxis, s as Radar, t as RadarChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cm4XFjP2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AssessmentContext = (0, import_react.createContext)(null);
var initial = {
	phase: "hook",
	website: "",
	email: "",
	extraEmails: [],
	consent: false,
	scan: null,
	profile: {},
	answers: {},
	lead: null,
	deepMode: false
};
function AssessmentProvider({ children }) {
	const [state, setState] = (0, import_react.useState)(initial);
	const value = (0, import_react.useMemo)(() => ({
		...state,
		setPhase: (p) => setState((s) => ({
			...s,
			phase: p
		})),
		setWebsite: (v) => setState((s) => ({
			...s,
			website: v
		})),
		setEmail: (v) => setState((s) => ({
			...s,
			email: v
		})),
		setExtraEmails: (v) => setState((s) => ({
			...s,
			extraEmails: v
		})),
		setConsent: (v) => setState((s) => ({
			...s,
			consent: v
		})),
		setScan: (scan) => setState((s) => ({
			...s,
			scan
		})),
		setProfile: (p) => setState((s) => ({
			...s,
			profile: {
				...s.profile,
				...p
			}
		})),
		setAnswer: (key, value) => setState((s) => ({
			...s,
			answers: {
				...s.answers,
				[key]: value
			}
		})),
		setLead: (l) => setState((s) => ({
			...s,
			lead: l
		})),
		setDeepMode: (v) => setState((s) => ({
			...s,
			deepMode: v
		})),
		reset: () => setState(initial)
	}), [state]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssessmentContext.Provider, {
		value,
		children
	});
}
function useAssessment() {
	const ctx = (0, import_react.useContext)(AssessmentContext);
	if (!ctx) throw new Error("useAssessment must be used within AssessmentProvider");
	return ctx;
}
function ShieldLogo({ size = 32 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/logo.png",
			alt: "Shield Logo",
			className: "rounded-xl object-contain",
			style: {
				width: size,
				height: size
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-semibold tracking-tight text-foreground",
				children: "Shield Identity"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
				children: "Shield Score"
			})]
		})]
	});
}
function PhaseShell({ children, progress, maxWidth = "max-w-3xl" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldLogo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center gap-4 text-xs text-muted-foreground sm:flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[color:var(--success)]" }), "Passive scan · No installation"]
					})
				})]
			}),
			progress ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: progress.label ?? "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						progress.current,
						" / ",
						progress.total
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 w-full overflow-hidden rounded-full bg-ink/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: "h-full rounded-full",
						style: { background: "linear-gradient(90deg, var(--cyan-glow), var(--cyan))" },
						initial: { width: 0 },
						animate: { width: `${progress.current / progress.total * 100}%` },
						transition: {
							duration: .5,
							ease: "easeOut"
						}
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: `mx-auto ${maxWidth} px-6 py-8 sm:py-14`,
				children
			})
		]
	});
}
function HookPhase() {
	const s = useAssessment();
	const [website, setWebsite] = (0, import_react.useState)(s.website);
	const [email, setEmail] = (0, import_react.useState)(s.email);
	const [consent, setConsent] = (0, import_react.useState)(s.consent);
	const websiteValid = /^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(website.replace(/^https?:\/\//, "").replace(/^www\./, ""));
	const submit = () => {
		if (!websiteValid || !consent) return;
		s.setWebsite(website);
		s.setEmail(email);
		s.setConsent(consent);
		s.setPhase("scan");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaseShell, {
		maxWidth: "max-w-5xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					className: "inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/5 px-3 py-1 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						size: 14,
						className: "text-[color:var(--cyan)]"
					}), "Shield Score · Automated Cybersecurity Assessment"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.h1, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .05 },
					className: "mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl",
					children: [
						"Discover your business",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gradient-cyan",
							children: "cyber risk"
						}),
						" in under 3 minutes."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .12 },
					className: "mt-5 max-w-xl text-lg text-muted-foreground",
					children: "Get an instant Shield Score based on your website, email security, and cybersecurity practices — built for Canadian SMBs, no installation required."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .18 },
					className: "mt-8 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "glass rounded-2xl p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
									size: 18,
									className: "text-muted-foreground"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									autoFocus: true,
									value: website,
									onChange: (e) => setWebsite(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && submit(),
									placeholder: "yourcompany.com",
									className: "w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none",
									"aria-label": "Website"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "glass rounded-2xl p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
									size: 18,
									className: "text-muted-foreground"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: email,
									onChange: (e) => setEmail(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && submit(),
									placeholder: "owner@company.com   (optional — unlocks breach check)",
									className: "w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none",
									"aria-label": "Email"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-1 flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: consent,
								onChange: (e) => setConsent(e.target.checked),
								className: "mt-1 h-4 w-4 accent-[color:var(--cyan)]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I authorise a passive external scan of my domain (public data only, no logins, no installation)." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
							onClick: submit,
							disabled: !websiteValid || !consent,
							whileHover: { y: -2 },
							whileTap: { scale: .98 },
							className: "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto",
							style: {
								background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
								boxShadow: "0 20px 40px -18px color-mix(in oklab, var(--cyan) 70%, transparent)"
							},
							children: ["Scan My Business", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 18 })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3",
					children: [
						{
							icon: ServerOff,
							label: "Passive Scan Only"
						},
						{
							icon: Lock,
							label: "No Installation Required"
						},
						{
							icon: MapPin,
							label: "Trusted by Canadian Businesses"
						}
					].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(b.icon, {
							size: 14,
							className: "text-[color:var(--cyan)]"
						}), b.label]
					}, b.label))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroPreview, {})]
		})
	});
}
function HeroPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			scale: .95
		},
		animate: {
			opacity: 1,
			scale: 1
		},
		transition: { duration: .6 },
		className: "glass-strong relative rounded-3xl p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-widest text-muted-foreground",
					children: "Live Shield Score"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-2xl font-semibold",
					children: "Acme Corp"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-full px-3 py-1 text-xs",
					style: {
						background: "color-mix(in oklab, var(--warning) 20%, transparent)",
						color: "var(--warning)",
						border: "1px solid color-mix(in oklab, var(--warning) 40%, transparent)"
					},
					children: "Developing"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto mt-6 flex h-52 w-52 items-center justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					width: "208",
					height: "208",
					className: "-rotate-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "104",
						cy: "104",
						r: "88",
						stroke: "oklch(0.32 0.07 285 / 0.15)",
						strokeWidth: "12",
						fill: "none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.circle, {
						cx: "104",
						cy: "104",
						r: "88",
						stroke: "var(--cyan)",
						strokeWidth: "12",
						strokeLinecap: "round",
						fill: "none",
						strokeDasharray: 2 * Math.PI * 88,
						initial: { strokeDashoffset: 2 * Math.PI * 88 },
						animate: { strokeDashoffset: 2 * Math.PI * 88 * .31999999999999995 },
						transition: {
							duration: 1.4,
							ease: "easeOut"
						}
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-5xl font-semibold",
						children: "68"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "/ 100"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2",
				children: [
					{
						label: "MFA Enforced",
						ok: true
					},
					{
						label: "DMARC Missing",
						ok: false
					},
					{
						label: "Backups Tested",
						ok: true
					},
					{
						label: "0 Exposed Ports",
						ok: true
					}
				].map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						x: -10
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { delay: .6 + i * .1 },
					className: "flex items-center justify-between rounded-lg bg-ink/5 px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold",
						style: { color: r.ok ? "var(--success)" : "var(--danger)" },
						children: r.ok ? "PASS" : "FAIL"
					})]
				}, r.label))
			})
		]
	});
}
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
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var runScan = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	domain: stringType().min(3),
	emails: arrayType(stringType()).default([])
}).parse(data)).handler(createSsrRpc("ad940233a7c2d0ace956d672c49a239de172d3560a825a8e562ab161369076d0"));
function ScanPhase() {
	const s = useAssessment();
	const [rows, setRows] = (0, import_react.useState)(SCAN_STEPS.map((st) => ({
		key: st.key,
		label: st.label,
		status: "pending"
	})));
	const [done, setDone] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const emails = [s.email, ...s.extraEmails].filter(Boolean);
		const domain = extractDomain(s.website);
		let cancelled = false;
		const scanPromise = runScan({ data: {
			domain,
			emails
		} }).catch(() => emptyScan(domain, emails));
		(async () => {
			for (let i = 0; i < SCAN_STEPS.length; i++) {
				if (cancelled) return;
				setRows((r) => r.map((row, idx) => idx === i ? {
					...row,
					status: "running"
				} : row));
				await new Promise((res) => setTimeout(res, 260 + Math.random() * 180));
			}
			const result = await scanPromise;
			if (cancelled) return;
			s.setScan(result);
			setRows((r) => r.map((row, idx) => ({
				...row,
				status: "done",
				result: SCAN_STEPS[idx].passLabel(result)
			})));
			setDone(true);
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	const domain = extractDomain(s.website);
	const findings = rows.filter((r) => r.result);
	const skipped = findings.filter((r) => r.result.ok === "skip").length;
	const passes = findings.filter((r) => r.result.ok === "pass").length;
	const warns = findings.filter((r) => r.result.ok === "warn").length;
	const fails = findings.filter((r) => r.result.ok === "fail").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PhaseShell, {
		maxWidth: "max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 8
			},
			animate: {
				opacity: 1,
				y: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-widest text-[color:var(--cyan)]",
					children: "Passive Exposure Scan"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-2 text-3xl font-semibold tracking-tight sm:text-4xl",
					children: [
						"Scanning ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gradient-cyan",
							children: domain
						}),
						"…"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-muted-foreground",
					children: "We're checking your public-facing security posture. This uses only passive, public data — no logins, no installs, no traffic to internal systems."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-strong rounded-3xl p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-ink/5 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-red-500/70" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-yellow-400/70" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-green-500/70" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-3 text-xs text-muted-foreground",
								children: ["shield-scan · ", domain]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "secure channel"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[520px] overflow-hidden p-4 font-mono text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground",
							children: ["$ shield-scan --passive ", domain]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							initial: false,
							children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									y: 4
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: { duration: .25 },
								className: "mt-1.5 flex items-center gap-2",
								children: [
									r.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "›"
									}),
									r.status === "running" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
										size: 14,
										className: "animate-spin text-[color:var(--cyan)]"
									}),
									r.status === "done" && r.result?.ok === "pass" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										size: 14,
										style: { color: "var(--success)" }
									}),
									r.status === "done" && r.result?.ok === "warn" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
										size: 14,
										style: { color: "var(--warning)" }
									}),
									r.status === "done" && r.result?.ok === "fail" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
										size: 14,
										style: { color: "var(--danger)" }
									}),
									r.status === "done" && r.result?.ok === "skip" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMinus, {
										size: 14,
										className: "text-muted-foreground"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: r.status === "done" ? "text-foreground" : "text-muted-foreground",
										children: r.label
									}),
									r.result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-xs text-muted-foreground",
										children: r.result.text
									})
								]
							}, r.key))
						}),
						done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							className: "mt-3 text-[color:var(--cyan)]",
							children: [
								"› scan complete · ",
								passes,
								" pass · ",
								warns,
								" warn · ",
								fails,
								" fail · ",
								skipped,
								" n/a"
							]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-3",
						children: [
							{
								label: "Pass",
								value: passes,
								color: "var(--success)"
							},
							{
								label: "Warn",
								value: warns,
								color: "var(--warning)"
							},
							{
								label: "Fail",
								value: fails,
								color: "var(--danger)"
							}
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-4 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-semibold",
								style: {
									color: k.color,
									fontVariantNumeric: "tabular-nums"
								},
								children: k.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[10px] uppercase tracking-widest text-muted-foreground",
								children: k.label
							})]
						}, k.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-2xl p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: "Live findings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 space-y-2 text-sm",
							children: findings.slice(0, 8).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-ink/5 pb-2 last:border-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: f.result.text
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold uppercase",
									style: { color: f.result.ok === "pass" ? "var(--success)" : f.result.ok === "warn" ? "var(--warning)" : f.result.ok === "skip" ? "var(--muted-foreground)" : "var(--danger)" },
									children: f.result.ok
								})]
							}, f.key))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
						disabled: !done,
						onClick: () => s.setPhase("profile"),
						whileHover: done ? { y: -2 } : void 0,
						whileTap: done ? { scale: .98 } : void 0,
						className: "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-all disabled:cursor-wait disabled:opacity-40",
						style: {
							background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
							boxShadow: "0 20px 40px -18px color-mix(in oklab, var(--cyan) 70%, transparent)"
						},
						children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Continue to assessment ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 18 })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Scanning… ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 16,
							className: "animate-spin"
						})] })
					})
				]
			})]
		})]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function OptionCard({ label, selected, onClick, hint, index = 0, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
		type: "button",
		onClick,
		initial: {
			opacity: 0,
			y: 12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { delay: index * .05 },
		whileHover: { y: -2 },
		whileTap: { scale: .98 },
		className: cn("group relative flex w-full items-center justify-between gap-4 rounded-2xl border p-5 text-left transition-all", compact ? "px-4 py-3" : "", selected ? "border-transparent shield-glow" : "border-ink/10 hover:border-ink/25"),
		style: { background: selected ? "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 18%, var(--navy-2)), var(--navy-2))" : "color-mix(in oklab, white 4%, transparent)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("font-medium text-foreground", compact ? "text-sm" : "text-base"),
				children: label
			}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all", selected ? "border-cyan bg-cyan text-primary-foreground" : "border-ink/25 text-transparent group-hover:border-ink/50"),
			style: { background: selected ? "var(--cyan)" : "transparent" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
				size: 14,
				strokeWidth: 3
			})
		})]
	});
}
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
var STEPS = [
	{
		key: "size",
		icon: Users,
		title: "How many people work at your business?",
		hint: "This shapes what controls actually make sense for you.",
		options: SIZE_OPTIONS
	},
	{
		key: "it",
		icon: Briefcase,
		title: "Who looks after your computers and IT?",
		hint: "Helps us know who needs to own each recommendation.",
		options: IT_OPTIONS
	},
	{
		key: "setup",
		icon: Cloud,
		title: "How is your business set up, tech-wise?",
		hint: "Cloud vs on-prem changes which attacks matter most.",
		options: SETUP_OPTIONS
	},
	{
		key: "industry",
		icon: Building2,
		title: "What industry are you in?",
		hint: "We tailor the framework and industry question to you.",
		options: INDUSTRY_OPTIONS
	}
];
function ProfilePhase() {
	const s = useAssessment();
	const [i, setI] = (0, import_react.useState)(0);
	const step = STEPS[i];
	const value = s.profile[step.key];
	const next = () => {
		if (!value) return;
		if (i < STEPS.length - 1) setI(i + 1);
		else s.setPhase("quick");
	};
	const back = () => {
		if (i === 0) s.setPhase("scan");
		else setI(i - 1);
	};
	const Icon = step.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaseShell, {
		progress: {
			current: i + 1,
			total: STEPS.length,
			label: "About your business"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			mode: "wait",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 16
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: -16
				},
				transition: { duration: .35 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
							style: {
								background: "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 30%, var(--navy-2)), var(--navy-2))",
								border: "1px solid color-mix(in oklab, var(--cyan) 30%, transparent)"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "text-[color:var(--cyan-glow)]",
								size: 26
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: [
									"Step ",
									i + 1,
									" of ",
									STEPS.length
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-2xl font-semibold tracking-tight sm:text-3xl",
								children: step.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-muted-foreground",
								children: step.hint
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-3 sm:grid-cols-2",
						children: step.options.map((opt, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionCard, {
							label: opt,
							selected: value === opt,
							onClick: () => {
								if (step.key === "size") s.setProfile({ size: opt });
								if (step.key === "it") s.setProfile({ it: opt });
								if (step.key === "setup") s.setProfile({ setup: opt });
								if (step.key === "industry") s.setProfile({ industry: opt });
							},
							index: idx
						}, opt))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: back,
							className: "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " Back"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
							disabled: !value,
							onClick: next,
							whileHover: value ? { y: -2 } : void 0,
							whileTap: value ? { scale: .98 } : void 0,
							className: "inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-40",
							style: { background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))" },
							children: [i === STEPS.length - 1 ? "Start assessment" : "Continue", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
						})]
					})
				]
			}, step.key)
		})
	});
}
function QuestionsPhase({ mode, onDone, onBack }) {
	const s = useAssessment();
	const [i, setI] = (0, import_react.useState)(0);
	const [showHelp, setShowHelp] = (0, import_react.useState)(false);
	const queue = (0, import_react.useMemo)(() => {
		if (mode === "quick") {
			let q = [...QUICK_QUESTIONS];
			if (s.profile.size === "Just me (no staff)") q = q.filter((x) => x.id !== "train");
			return q;
		}
		let deep = [...DEEP_QUESTIONS];
		if (s.profile.industry && INDUSTRY_META[s.profile.industry]) {
			const meta = INDUSTRY_META[s.profile.industry];
			deep = [{
				id: "industryData",
				phase: "DEEP",
				question: meta.industryQuestion,
				explainer: meta.industryExplainer,
				options: [
					{
						label: "Yes",
						value: null
					},
					{
						label: "No",
						value: null
					},
					{
						label: "Not sure",
						value: null
					}
				],
				weight: 0
			}, ...deep];
		}
		if (s.email) {
			deep = deep.filter((x) => x.id !== "emailtype");
			const emailDomain = s.email.split("@")[1]?.toLowerCase();
			const siteDomain = extractDomain(s.website).toLowerCase();
			const auto = [
				"gmail.com",
				"outlook.com",
				"yahoo.com",
				"hotmail.com",
				"icloud.com"
			].includes(emailDomain) ? "Free" : emailDomain === siteDomain ? "Own domain" : "A mix";
			if (!s.answers.emailtype) s.setAnswer("emailtype", auto);
		}
		if (s.profile.size === "Just me (no staff)") deep = deep.filter((x) => x.id !== "accessoff");
		if (s.answers.aiuse === "No") deep = deep.filter((x) => x.id !== "airules");
		return deep;
	}, [
		mode,
		s.profile,
		s.email,
		s.website
	]);
	const q = queue[i];
	const answer = s.answers[q?.id ?? ""];
	const select = (label) => {
		if (!q) return;
		s.setAnswer(q.id, label);
		setTimeout(() => nextStep(), 160);
	};
	const nextStep = () => {
		if (i < queue.length - 1) setI(i + 1);
		else onDone();
		setShowHelp(false);
	};
	const back = () => {
		setShowHelp(false);
		if (i === 0) if (onBack) onBack();
		else s.setPhase("profile");
		else setI(i - 1);
	};
	if (!q) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaseShell, {
		progress: {
			current: i + 1,
			total: queue.length,
			label: mode === "quick" ? "Cybersecurity assessment" : "Deep-dive assessment"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			mode: "wait",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					x: 24
				},
				animate: {
					opacity: 1,
					x: 0
				},
				exit: {
					opacity: 0,
					x: -24
				},
				transition: { duration: .3 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-[color:var(--cyan)]",
						children: q.phase === "QUICK" ? "Big Six · Quick" : "Deep dive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-2xl font-semibold leading-snug tracking-tight sm:text-[28px]",
						children: q.question
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setShowHelp((v) => !v),
						className: "mt-3 inline-flex items-center gap-2 text-sm text-[color:var(--cyan-glow)] hover:underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { size: 14 }), showHelp ? "Hide" : "What is this, in plain English?"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showHelp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							height: 0
						},
						animate: {
							opacity: 1,
							height: "auto"
						},
						exit: {
							opacity: 0,
							height: 0
						},
						className: "overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-2xl border border-ink/10 bg-ink/5 p-4 text-sm text-muted-foreground",
							children: q.explainer
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-3 sm:grid-cols-2",
						children: q.options.map((opt, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionCard, {
							label: opt.label,
							selected: answer === opt.label,
							onClick: () => select(opt.label),
							index: idx
						}, opt.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: back,
							className: "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " Back"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
							disabled: !answer,
							onClick: nextStep,
							whileHover: answer ? { y: -2 } : void 0,
							whileTap: answer ? { scale: .98 } : void 0,
							className: "inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-40",
							style: { background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))" },
							children: [i === queue.length - 1 ? mode === "quick" ? "See my score" : "Update results" : "Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
						})]
					})
				]
			}, q.id + i)
		})
	});
}
function Field({ label, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "group relative block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass rounded-2xl border border-ink/10 px-4 pb-2 pt-5 transition-colors focus-within:border-[color:var(--cyan)]/60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] uppercase tracking-widest text-muted-foreground",
				children: label
			}), children]
		}), error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 pl-2 text-xs text-[color:var(--danger)]",
			children: error
		})]
	});
}
function GatePhase() {
	const s = useAssessment();
	const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({ defaultValues: {
		name: s.lead?.name ?? "",
		email: s.lead?.email ?? s.email ?? "",
		business: s.lead?.business ?? extractDomain(s.website),
		phone: s.lead?.phone ?? "",
		role: s.lead?.role ?? "",
		decisionMaker: s.lead?.decisionMaker ?? "Yes, I decide",
		consent: s.lead?.consent ?? true
	} });
	const dm = watch("decisionMaker");
	const submit = (v) => {
		const lead = { ...v };
		s.setLead(lead);
		s.setPhase("results");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PhaseShell, {
		maxWidth: "max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 12
			},
			animate: {
				opacity: 1,
				y: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-widest text-[color:var(--cyan)]",
					children: "Almost there"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-semibold tracking-tight sm:text-4xl",
					children: "Where should we send your Shield Score report?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-muted-foreground",
					children: "We'll unlock your full dashboard, tailored recommendations, and — if you qualify — an offer for a complimentary internal network assessment."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit(submit),
			className: "mt-8 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							error: errors.name?.message,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								autoFocus: true,
								...register("name", {
									required: "Required",
									minLength: {
										value: 2,
										message: "Enter your name"
									}
								}),
								className: "mt-1 w-full bg-transparent text-base text-foreground focus:outline-none"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Business",
							error: errors.business?.message,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								...register("business", { required: "Required" }),
								className: "mt-1 w-full bg-transparent text-base text-foreground focus:outline-none"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Work email",
							error: errors.email?.message,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								...register("email", {
									required: "Required",
									pattern: {
										value: /.+@.+\..+/,
										message: "Enter a valid email"
									}
								}),
								className: "mt-1 w-full bg-transparent text-base text-foreground focus:outline-none"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							error: errors.phone?.message,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "tel",
								...register("phone", {
									required: "Required",
									minLength: {
										value: 7,
										message: "Enter a valid phone"
									}
								}),
								className: "mt-1 w-full bg-transparent text-base text-foreground focus:outline-none"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Your role",
								error: errors.role?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									...register("role", { required: "Required" }),
									placeholder: "Owner, IT Manager, Office Manager…",
									className: "mt-1 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] uppercase tracking-widest text-muted-foreground",
						children: "Are you the decision-maker for IT & security?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-2 sm:grid-cols-3",
						children: [
							"Yes, I decide",
							"I share that decision",
							"No, someone else does"
						].map((opt) => {
							const selected = dm === opt;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setValue("decisionMaker", opt),
								className: "rounded-xl border px-3 py-3 text-sm transition-all",
								style: {
									borderColor: selected ? "color-mix(in oklab, var(--cyan) 60%, transparent)" : "color-mix(in oklab, white 15%, transparent)",
									background: selected ? "color-mix(in oklab, var(--cyan) 12%, transparent)" : "transparent",
									color: selected ? "var(--cyan-glow)" : "var(--foreground)"
								},
								children: opt
							}, opt);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						...register("consent"),
						className: "mt-1 h-4 w-4 accent-[color:var(--cyan)]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I consent to Shield Identity contacting me about my results (CASL compliant, unsubscribe any time)." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => s.setPhase("quick"),
						className: "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " Back"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						type: "submit",
						whileHover: { y: -2 },
						whileTap: { scale: .98 },
						className: "inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-primary-foreground",
						style: {
							background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
							boxShadow: "0 20px 40px -18px color-mix(in oklab, var(--cyan) 70%, transparent)"
						},
						children: ["Unlock my Shield Score ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 pt-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 12 }), " Encrypted transmission · Data used only to generate your report."]
				})
			]
		})]
	});
}
function ScoreGauge({ value, size = 260, band, label }) {
	const mv = useMotionValue(0);
	const display = useTransform(mv, (v) => Math.round(v));
	(0, import_react.useEffect)(() => {
		const controls = animate(mv, value, {
			duration: 1.6,
			ease: "easeOut"
		});
		return () => controls.stop();
	}, [value, mv]);
	const radius = (size - 24) / 2;
	const circ = 2 * Math.PI * radius;
	const strokeColor = value <= 40 ? "var(--danger)" : value <= 70 ? "var(--warning)" : "var(--success)";
	const dash = useTransform(mv, (v) => circ - circ * v / 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className: "-rotate-90",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "gaugeGrad",
					x1: "0",
					y1: "0",
					x2: "1",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "var(--cyan-glow)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: strokeColor
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("filter", {
					id: "gaugeGlow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", {
						stdDeviation: "4",
						result: "blur"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("feMerge", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "blur" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "SourceGraphic" })] })]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: size / 2,
					cy: size / 2,
					r: radius,
					stroke: "oklch(0.32 0.07 285 / 0.15)",
					strokeWidth: 14,
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.circle, {
					cx: size / 2,
					cy: size / 2,
					r: radius,
					stroke: "url(#gaugeGrad)",
					strokeWidth: 14,
					strokeLinecap: "round",
					fill: "none",
					strokeDasharray: circ,
					style: {
						strokeDashoffset: dash,
						filter: "url(#gaugeGlow)"
					}
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
					className: "text-6xl font-semibold tracking-tight text-foreground",
					style: { fontVariantNumeric: "tabular-nums" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, { children: display })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground",
					children: label ?? "Shield Score"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-3 rounded-full px-3 py-1 text-xs font-medium",
					style: {
						background: `color-mix(in oklab, ${strokeColor} 20%, transparent)`,
						color: strokeColor,
						border: `1px solid color-mix(in oklab, ${strokeColor} 40%, transparent)`
					},
					children: band
				})
			]
		})]
	});
}
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
function buildRecommendations(profile, flags) {
	const cards = [];
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
var PRIORITY_COLOR = {
	Critical: "var(--danger)",
	High: "var(--warning)",
	Medium: "var(--cyan)",
	Low: "var(--success)"
};
function ResultsPhase() {
	const s = useAssessment();
	const [deepOpen, setDeepOpen] = (0, import_react.useState)(false);
	if (deepOpen) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionsPhase, {
		mode: "deep",
		onBack: () => setDeepOpen(false),
		onDone: () => setDeepOpen(false)
	});
	const score = (0, import_react.useMemo)(() => computeScore(s.profile, s.answers, s.scan), [
		s.profile,
		s.answers,
		s.scan
	]);
	const flags = (0, import_react.useMemo)(() => computeFlags(s.profile, s.answers, s.scan), [
		s.profile,
		s.answers,
		s.scan
	]);
	const recs = (0, import_react.useMemo)(() => buildRecommendations(s.profile, flags), [s.profile, flags]);
	const nd = (0, import_react.useMemo)(() => computeND(s.profile, s.answers, s.scan, s.lead?.decisionMaker, score.final), [
		s.profile,
		s.answers,
		s.scan,
		s.lead,
		score.final
	]);
	const sensitive = isSensitive(s.profile, s.answers);
	const priority = (0, import_react.useMemo)(() => computePriority(flags, s.scan, sensitive, score.final, s.lead?.decisionMaker), [
		flags,
		s.scan,
		sensitive,
		score.final,
		s.lead
	]);
	const cats = (0, import_react.useMemo)(() => categorySubscores(s.profile, s.answers), [s.profile, s.answers]);
	const summary = (0, import_react.useMemo)(() => executiveSummary(score.final, score.band, flags), [
		score.final,
		score.band,
		flags
	]);
	const radarData = cats.map((c) => ({
		subject: c.key,
		score: c.value ?? 0,
		fullMark: 100
	}));
	const barData = recs.filter((r) => r.priority !== "Low").slice(0, 6).map((r) => ({
		name: r.category,
		value: r.priority === "Critical" ? 90 : r.priority === "High" ? 65 : 40
	}));
	const industryFramework = s.profile.industry ? INDUSTRY_META[s.profile.industry]?.framework : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PhaseShell, {
		maxWidth: "max-w-7xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "flex flex-col justify-between gap-6 lg:flex-row lg:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs uppercase tracking-widest text-[color:var(--cyan)]",
						children: ["Executive Report · ", s.lead?.business]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-4xl font-semibold tracking-tight sm:text-5xl",
						children: "Your Shield Score"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-2xl text-muted-foreground",
						children: [
							"Prepared for ",
							s.lead?.name,
							" · ",
							(/* @__PURE__ */ new Date()).toLocaleDateString()
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-ink/5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-ink/10",
						onClick: () => window.print(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 16 }), " Download PDF Report"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "https://shield-identity.com/contact",
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground",
						style: { background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { size: 16 }), " Schedule Free Consultation"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .1 },
				className: "mt-8 overflow-hidden rounded-3xl border p-6 sm:p-8",
				style: {
					borderColor: nd.qualified ? "color-mix(in oklab, var(--success) 40%, transparent)" : "color-mix(in oklab, var(--cyan) 30%, transparent)",
					background: nd.qualified ? "linear-gradient(135deg, color-mix(in oklab, var(--success) 22%, var(--navy-2)), var(--navy-2))" : "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 15%, var(--navy-2)), var(--navy-2))"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-2xl",
							style: { background: nd.qualified ? "color-mix(in oklab, var(--success) 30%, transparent)" : "color-mix(in oklab, var(--cyan) 25%, transparent)" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
								size: 22,
								className: nd.qualified ? "text-[color:var(--success)]" : "text-[color:var(--cyan)]"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: nd.qualified ? "Congratulations" : "Recommended next step"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xl font-semibold sm:text-2xl",
								children: nd.qualified ? "You qualify for a complimentary Internal Network Discovery Assessment." : "Let's strengthen your fundamentals first."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 max-w-2xl text-sm text-muted-foreground",
								children: nd.qualified ? "Limited spots available — one-business-day scheduling, no obligation." : `Based on your answers we recommend improving your cybersecurity fundamentals before scheduling an assessment. (${nd.reason})`
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://shield-identity.com/contact",
						target: "_blank",
						rel: "noreferrer",
						className: "shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground",
						style: { background: nd.qualified ? "linear-gradient(135deg, oklch(0.9 0.15 155), var(--success))" : "linear-gradient(135deg, var(--cyan-glow), var(--cyan))" },
						children: nd.qualified ? "Claim my free scan" : "Book my free review"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .15 },
					className: "glass-strong flex flex-col items-center gap-4 rounded-3xl p-8 sm:flex-row sm:justify-around",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreGauge, {
						value: score.final,
						band: score.band
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-sm space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Security Level"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-2xl font-semibold",
								children: [
									score.band === "Resilient" && "Low risk",
									score.band === "Developing" && "Medium risk",
									score.band === "Exposed" && "High risk"
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-6 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Base score",
										value: score.base,
										suffix: "/100"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Scan penalties",
										value: -score.penalties
									}),
									s.scan?.breach.checked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Breaches",
										value: s.scan.breach.count
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-3 text-xs",
								style: {
									borderColor: "color-mix(in oklab, var(--cyan) 25%, transparent)",
									background: "color-mix(in oklab, var(--cyan) 8%, transparent)"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-semibold text-[color:var(--cyan-glow)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }),
										" Priority tier: ",
										priority.band
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-muted-foreground",
									children: [
										"Priority score ",
										priority.score,
										" · driven by profile, gaps, and exposure."
									]
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .2 },
					className: "card-light rounded-3xl p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "Category scores"
						}), industryFramework && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-[color:var(--navy)]/5 px-2 py-1 text-[10px] uppercase tracking-widest text-[color:var(--card-foreground)]/60",
							children: industryFramework
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: cats.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[color:var(--card-foreground)]",
								children: c.key
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								style: { color: c.value == null ? "oklch(0.65 0 0)" : c.value >= 71 ? "var(--success)" : c.value >= 41 ? "var(--warning)" : "var(--danger)" },
								children: c.value == null ? "—" : `${c.value}%`
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 h-2 w-full overflow-hidden rounded-full bg-[color:var(--navy)]/8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: { width: 0 },
								animate: { width: `${c.value ?? 0}%` },
								transition: {
									delay: .3 + i * .05,
									duration: .9
								},
								className: "h-full rounded-full",
								style: { background: c.value == null ? "oklch(0.85 0 0)" : c.value >= 71 ? "linear-gradient(90deg, oklch(0.82 0.16 155), var(--success))" : c.value >= 41 ? "linear-gradient(90deg, oklch(0.88 0.14 85), var(--warning))" : "linear-gradient(90deg, oklch(0.75 0.22 25), var(--danger))" }
							})
						})] }, c.key))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .25 },
					className: "glass-strong rounded-3xl p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "Security maturity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Across 6 domains"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadarChart, {
							data: radarData,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarGrid, { stroke: "oklch(1 0 0 / 0.12)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarAngleAxis, {
									dataKey: "subject",
									tick: {
										fill: "oklch(0.85 0.01 240)",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
									dataKey: "score",
									stroke: "var(--cyan)",
									fill: "var(--cyan)",
									fillOpacity: .35
								})
							]
						}) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .3 },
					className: "glass-strong rounded-3xl p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "Top risk categories"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Weighted exposure"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: barData,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.32 0.07 285 / 0.15)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									tick: {
										fill: "oklch(0.75 0.01 240)",
										fontSize: 10
									},
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									hide: true,
									domain: [0, 100]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "oklch(1 0 0 / 0.05)" },
									contentStyle: {
										background: "var(--navy-2)",
										border: "1px solid oklch(1 0 0 / 0.1)",
										borderRadius: 12,
										color: "white"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "value",
									radius: [
										8,
										8,
										0,
										0
									],
									fill: "var(--cyan)"
								})
							]
						}) })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .35 },
				className: "mt-6 rounded-3xl p-6",
				style: {
					background: "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 12%, var(--navy-2)), var(--navy-2))",
					border: "1px solid color-mix(in oklab, var(--cyan) 25%, transparent)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-9 w-9 items-center justify-center rounded-xl",
						style: { background: "color-mix(in oklab, var(--cyan) 25%, transparent)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
							size: 18,
							className: "text-[color:var(--cyan-glow)]"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-[color:var(--cyan-glow)]",
						children: "Executive summary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-base leading-relaxed text-foreground/90",
						children: summary
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-semibold",
						children: "Risk findings & recommendations"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							recs.length,
							" recommendation",
							recs.length === 1 ? "" : "s",
							" · consolidated from your assessment and passive scan."
						]
					})] })
				}), recs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-3xl border border-[color:var(--success)]/40 bg-[color:var(--success)]/10 p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
							size: 22,
							className: "text-[color:var(--success)]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: "You're in good shape."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "Keep your controls current and re-check periodically."
						})] })]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3",
					children: recs.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecCard, {
						rec: r,
						index: i
					}, r.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .5 },
				className: "mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-ink/10 bg-ink/5 p-6 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-lg font-semibold",
					children: "Want an even sharper score?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "Answer the optional deep-dive questions to refine your Shield Score and unlock more recommendations."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setDeepOpen(true),
					className: "rounded-xl border border-[color:var(--cyan)]/40 bg-[color:var(--cyan)]/10 px-5 py-3 text-sm font-semibold text-[color:var(--cyan-glow)] transition-colors hover:bg-[color:var(--cyan)]/20",
					children: "Start deep-dive"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-12 border-t border-ink/10 pt-6 text-center text-xs text-muted-foreground",
				children: "Shield Identity · Shield Score v5 · Passive assessment. Results based on your answers and public data only."
			})
		]
	});
}
function Stat({ label, value, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-widest text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-1 text-lg font-semibold",
		style: { fontVariantNumeric: "tabular-nums" },
		children: [value, suffix ?? ""]
	})] });
}
function RecCard({ rec, index }) {
	const [open, setOpen] = (0, import_react.useState)(index < 2);
	const color = PRIORITY_COLOR[rec.priority];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { delay: .05 * index },
		className: "card-light overflow-hidden rounded-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((v) => !v),
			className: "flex w-full items-center gap-4 p-5 text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white",
					style: { background: `color-mix(in oklab, ${color} 85%, black)` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold uppercase",
						children: rec.priority[0]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
							style: {
								background: `color-mix(in oklab, ${color} 15%, white)`,
								color,
								border: `1px solid color-mix(in oklab, ${color} 40%, transparent)`
							},
							children: rec.priority
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-[color:var(--card-foreground)]/60",
							children: rec.category
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-base font-semibold text-[color:var(--card-foreground)]",
						children: rec.title
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					size: 18,
					className: "shrink-0 text-[color:var(--card-foreground)]/60 transition-transform",
					style: { transform: open ? "rotate(180deg)" : "rotate(0)" }
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			initial: false,
			children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					height: 0,
					opacity: 0
				},
				animate: {
					height: "auto",
					opacity: 1
				},
				exit: {
					height: 0,
					opacity: 0
				},
				className: "overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 border-t border-[color:var(--navy)]/10 p-5 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							title: "Business impact",
							body: rec.impact
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							title: "Why it matters",
							body: rec.why
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							title: "Recommended fix",
							body: rec.fix,
							full: true
						}),
						rec.diyGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "https://shield-identity.com/resources",
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-2 rounded-xl border border-[color:var(--navy)]/15 bg-[color:var(--navy)]/5 px-3 py-2 text-xs font-semibold text-[color:var(--card-foreground)]",
								children: ["DIY Guide → ", rec.diyGuide]
							})
						})
					]
				})
			})
		})]
	});
}
function Block({ title, body, full }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: full ? "sm:col-span-2" : "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-semibold uppercase tracking-widest text-[color:var(--card-foreground)]/50",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-sm text-[color:var(--card-foreground)]/85",
			children: body
		})]
	});
}
function IndexPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssessmentProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flow, {}) });
}
function Flow() {
	const s = useAssessment();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
		mode: "wait",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: .25 },
			children: [
				s.phase === "hook" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookPhase, {}),
				s.phase === "scan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanPhase, {}),
				s.phase === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePhase, {}),
				s.phase === "quick" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionsPhase, {
					mode: "quick",
					onDone: () => s.setPhase("gate")
				}),
				s.phase === "gate" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GatePhase, {}),
				s.phase === "results" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsPhase, {})
			]
		}, s.phase)
	});
}
//#endregion
export { IndexPage as component };
