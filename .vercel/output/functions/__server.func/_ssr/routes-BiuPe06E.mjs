import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as runScan, c as submitToCrm, i as runBreachCheck } from "./scan.functions-Cqp79Ftk.mjs";
import { a as AnimatePresence, i as motion, n as useTransform, r as useMotionValue, t as animate } from "../_libs/framer-motion.mjs";
import { A as Building2, D as ChevronDown, E as CircleMinus, F as ArrowLeft, M as BadgeCheck, N as Award, O as Check, P as ArrowRight, T as CircleQuestionMark, f as MapPin, g as LoaderCircle, h as Lock, i as TrendingUp, j as Briefcase, k as CalendarCheck, n as Users, o as Sparkles, p as Mail, r as TriangleAlert, s as ShieldCheck, t as X, u as ServerOff, v as Globe, w as Cloud, x as Download } from "../_libs/lucide-react.mjs";
import { _ as extractDomain, a as QUICK_QUESTIONS, c as SIZE_OPTIONS, d as computeFlags, f as computeND, g as executiveSummary, h as emptyScan, i as IT_OPTIONS, l as buildRecommendations, m as computeScore, n as INDUSTRY_META, o as SCAN_STEPS, p as computePriority, r as INDUSTRY_OPTIONS, s as SETUP_OPTIONS, t as DEEP_QUESTIONS, u as categorySubscores, v as isSensitive } from "./engine-B1qeQA5Y.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as useForm } from "../_libs/react-hook-form.mjs";
import { a as CartesianGrid, c as PolarAngleAxis, d as Tooltip, i as XAxis, l as PolarGrid, n as BarChart, o as Bar, r as YAxis, s as Radar, t as RadarChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BiuPe06E.js
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
	deepMode: false,
	calendlyUrl: "https://shield-identity.com/contact"
};
function AssessmentProvider({ children }) {
	const [state, setState] = (0, import_react.useState)(initial);
	(0, import_react.useEffect)(() => {
		import("./scan.functions-Cqp79Ftk.mjs").then((n) => n.s).then((n) => n.s).then(({ getAdminSettings }) => {
			getAdminSettings().then((settings) => {
				if (settings?.calendlyUrl) setState((s) => ({
					...s,
					calendlyUrl: settings.calendlyUrl
				}));
			}).catch((err) => {
				console.warn("Could not load configured Calendly URL on mount, sticking with default:", err);
			});
		}).catch((err) => {
			console.warn("Could not resolve scan functions dynamically on mount:", err);
		});
	}, []);
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
		setCalendlyUrl: (v) => setState((s) => ({
			...s,
			calendlyUrl: v
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
function CaptchaVerify({ onVerify }) {
	const [isVerified, setIsVerified] = (0, import_react.useState)(false);
	const containerRef = (0, import_react.useRef)(null);
	const [maxDrag, setMaxDrag] = (0, import_react.useState)(150);
	const x = useMotionValue(0);
	(0, import_react.useEffect)(() => {
		if (containerRef.current) {
			const width = containerRef.current.clientWidth;
			setMaxDrag(width - 48);
		}
	}, []);
	const handleDragEnd = () => {
		if (isVerified) return;
		if (x.get() >= maxDrag - 12) {
			setIsVerified(true);
			animate(x, maxDrag, {
				type: "spring",
				stiffness: 350,
				damping: 25
			});
			onVerify(true);
		} else animate(x, 0, {
			type: "spring",
			stiffness: 300,
			damping: 25
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "glass relative flex h-[52px] w-full select-none items-center overflow-hidden rounded-2xl p-1 border border-ink/10",
		style: {
			background: isVerified ? "color-mix(in oklab, var(--success) 6%, transparent)" : "color-mix(in oklab, white 4%, transparent)",
			borderColor: isVerified ? "color-mix(in oklab, var(--success) 30%, transparent)" : "color-mix(in oklab, white 10%, transparent)",
			transition: "background-color 0.3s, border-color 0.3s"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 flex items-center justify-center text-xs tracking-wider uppercase transition-opacity duration-300",
			style: {
				color: isVerified ? "var(--success)" : "var(--muted-foreground)",
				opacity: isVerified ? .9 : .6
			},
			children: isVerified ? "Scan Authorization Verified" : "Slide right to authorize scan"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			drag: isVerified ? false : "x",
			dragConstraints: {
				left: 0,
				right: maxDrag
			},
			dragElastic: 0,
			dragMomentum: false,
			onDragEnd: handleDragEnd,
			className: "relative z-10 flex h-10 w-10 cursor-grab items-center justify-center rounded-xl active:cursor-grabbing",
			style: {
				x,
				background: isVerified ? "linear-gradient(135deg, color-mix(in oklab, var(--success) 80%, white), var(--success))" : "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
				boxShadow: isVerified ? "0 4px 12px color-mix(in oklab, var(--success) 55%, transparent)" : "0 4px 12px color-mix(in oklab, var(--cyan) 35%, transparent)"
			},
			children: isVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
				size: 18,
				className: "text-primary-foreground"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
				size: 16,
				className: "text-primary-foreground"
			})
		})]
	});
}
function HookPhase() {
	const s = useAssessment();
	const [website, setWebsite] = (0, import_react.useState)(s.website);
	const [email, setEmail] = (0, import_react.useState)(s.email);
	const [consent, setConsent] = (0, import_react.useState)(s.consent);
	const [captchaPassed, setCaptchaPassed] = (0, import_react.useState)(false);
	const websiteValid = /^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(website.replace(/^https?:\/\//, "").replace(/^www\./, ""));
	const submit = () => {
		if (!websiteValid || !consent || !captchaPassed) return;
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptchaVerify, { onVerify: setCaptchaPassed })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
							onClick: submit,
							disabled: !websiteValid || !consent || !captchaPassed,
							whileHover: websiteValid && consent && captchaPassed ? { y: -2 } : void 0,
							whileTap: websiteValid && consent && captchaPassed ? { scale: .98 } : void 0,
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
	const submit = async (v) => {
		const lead = { ...v };
		s.setLead(lead);
		let currentScan = s.scan;
		if (v.email && s.scan) {
			const emailLower = v.email.toLowerCase().trim();
			if (!s.scan.emails.some((e) => e.toLowerCase().trim() === emailLower)) try {
				const result = await runBreachCheck({ data: { email: emailLower } });
				const updatedScan = {
					...s.scan,
					emails: [emailLower],
					breach: result
				};
				s.setScan(updatedScan);
				currentScan = updatedScan;
			} catch (err) {
				console.error("Failed to check breaches at GatePhase:", err);
			}
		}
		try {
			await submitToCrm({ data: {
				lead,
				profile: s.profile,
				answers: s.answers,
				scan: currentScan
			} });
		} catch (crmErr) {
			console.error("Failed to submit lead to Zoho CRM:", crmErr);
		}
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
	const recs = (0, import_react.useMemo)(() => buildRecommendations(s.profile, flags, s.scan), [
		s.profile,
		flags,
		s.scan
	]);
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
						href: s.calendlyUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-103 active:scale-97 shadow-[0_8px_30px_rgb(85,225,245,0.2)] hover:shadow-[0_8px_40px_rgb(85,225,245,0.45)] hover:brightness-110 border border-cyan/10",
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
						href: s.calendlyUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "w-full sm:w-auto text-center shrink-0 rounded-2xl px-6 py-3.5 text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-103 active:scale-97 border border-white/10",
						style: {
							background: nd.qualified ? "linear-gradient(135deg, oklch(0.9 0.15 155), var(--success))" : "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
							boxShadow: nd.qualified ? "0 10px 30px -10px rgba(34, 197, 94, 0.45)" : "0 10px 30px -10px rgba(85, 225, 245, 0.45)"
						},
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
							s.scan?.breach.checked && s.scan.breach.count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300",
								style: {
									borderColor: "color-mix(in oklab, var(--danger) 25%, transparent)",
									background: "color-mix(in oklab, var(--danger) 8%, transparent)"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-[color:oklch(0.75_0.22_25)] animate-pulse",
									style: { color: "var(--danger)" },
									children: "Compromised Credentials Detected"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-muted-foreground/90",
									children: [
										"Your email (",
										s.scan.emails.join(", "),
										") was exposed in:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: s.scan.breach.breaches.join(", ")
										})
									]
								})]
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
								rel: "noopener noreferrer",
								className: "inline-flex items-center gap-2 rounded-xl border border-[color:var(--navy)]/15 bg-[color:var(--navy)]/5 px-3 py-2 text-xs font-semibold text-[color:var(--card-foreground)] transition-shadow hover:shadow-sm",
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
