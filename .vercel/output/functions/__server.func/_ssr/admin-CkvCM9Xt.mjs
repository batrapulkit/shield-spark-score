import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as getAdminSettings, o as saveAdminSettings, r as getSubmissionsList, t as deleteSubmissionRecord } from "./scan.functions-Cqp79Ftk.mjs";
import { a as AnimatePresence, i as motion } from "../_libs/framer-motion.mjs";
import { C as Cpu, S as Database, _ as Link2, a as Trash2, b as Eye, c as ShieldAlert, d as Search, h as Lock, l as Server, m as LogOut, o as Sparkles, r as TriangleAlert, x as Download, y as Funnel } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CkvCM9Xt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const [password, setPassword] = (0, import_react.useState)("");
	const [isLoggedIn, setIsLoggedIn] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [submissions, setSubmissions] = (0, import_react.useState)([]);
	const [settings, setSettings] = (0, import_react.useState)({
		calendlyUrl: "https://shield-identity.com/contact",
		zohoEnabled: true,
		scanMode: "authentic"
	});
	const [saveStatus, setSaveStatus] = (0, import_react.useState)("idle");
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [riskFilter, setRiskFilter] = (0, import_react.useState)("all");
	const [selectedSub, setSelectedSub] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const savedPassword = sessionStorage.getItem("shield_admin_pass");
		if (savedPassword) attemptLogin(savedPassword);
	}, []);
	const attemptLogin = async (pass) => {
		setLoading(true);
		setErrorMsg("");
		try {
			const list = await getSubmissionsList({ data: { password: pass } });
			setSubmissions(list);
			const config = await getAdminSettings();
			setSettings({
				calendlyUrl: config.calendlyUrl || "https://shield-identity.com/contact",
				zohoEnabled: config.zohoEnabled ?? true,
				scanMode: config.scanMode || "authentic"
			});
			setIsLoggedIn(true);
			setPassword(pass);
			sessionStorage.setItem("shield_admin_pass", pass);
		} catch (err) {
			setErrorMsg(err.message || "Invalid password or network error");
			sessionStorage.removeItem("shield_admin_pass");
		} finally {
			setLoading(false);
		}
	};
	const handleLoginSubmit = (e) => {
		e.preventDefault();
		if (!password) return;
		attemptLogin(password);
	};
	const handleLogout = () => {
		setIsLoggedIn(false);
		setPassword("");
		sessionStorage.removeItem("shield_admin_pass");
		setSubmissions([]);
	};
	const handleSaveSettings = async () => {
		setSaveStatus("saving");
		try {
			await saveAdminSettings({ data: {
				password,
				settings
			} });
			setSaveStatus("success");
			setTimeout(() => setSaveStatus("idle"), 3e3);
		} catch (err) {
			console.error(err);
			setSaveStatus("error");
			setTimeout(() => setSaveStatus("idle"), 4e3);
		}
	};
	const handleDelete = async (email) => {
		if (!window.confirm(`Are you sure you want to delete the submission for ${email}?`)) return;
		try {
			await deleteSubmissionRecord({ data: {
				password,
				email
			} });
			setSubmissions(submissions.filter((s) => s.email !== email));
			if (selectedSub && selectedSub.email === email) setSelectedSub(null);
		} catch (err) {
			alert(`Error deleting check: ${err.message || "Unknown error"}`);
		}
	};
	const handleExportCSV = () => {
		if (submissions.length === 0) return;
		const headers = [
			"Business",
			"Name",
			"Email",
			"Phone",
			"Role",
			"Decision Maker",
			"Score",
			"Date"
		];
		const rows = submissions.map((s) => [
			s.business || "",
			s.name || "",
			s.email || "",
			s.phone || "",
			s.role || "",
			s.decision_maker || "",
			s.score ?? "",
			s.created_at ? new Date(s.created_at).toLocaleString() : ""
		]);
		const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, "\"\"")}"`).join(","))].join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `shield_score_leads_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const filteredSubmissions = submissions.filter((sub) => {
		const matchesSearch = sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) || sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) || sub.business?.toLowerCase().includes(searchTerm.toLowerCase());
		if (riskFilter === "all") return matchesSearch;
		if (riskFilter === "compromised") return matchesSearch && sub.score < 50;
		if (riskFilter === "developing") return matchesSearch && sub.score >= 50 && sub.score < 80;
		if (riskFilter === "resilient") return matchesSearch && sub.score >= 80;
		return matchesSearch;
	});
	const highRiskCount = submissions.filter((s) => (s.score || 0) < 50).length;
	const avgScore = submissions.length ? Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / submissions.length) : 0;
	if (!isLoggedIn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-height-screen min-h-screen items-center justify-center px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			className: "glass-strong w-full max-w-md rounded-3xl p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/10 text-[color:var(--cyan)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 28 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 text-2xl font-bold tracking-tight text-foreground",
						children: "Shield Score Control Center"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Enter the system administration passcode to access dashboard controls and scan submissions."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleLoginSubmit,
				className: "mt-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "glass rounded-2xl p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							autoFocus: true,
							placeholder: "System Administrator Passcode",
							className: "w-full bg-transparent px-3 py-2 text-center text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
						})
					}),
					errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						className: "rounded-xl bg-destructive/10 px-4 py-3 text-center text-xs font-medium text-destructive border border-destructive/20",
						children: errorMsg
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: loading,
						className: "flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-all disabled:opacity-40",
						style: {
							background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
							boxShadow: "0 10px 30px -10px color-mix(in oklab, var(--cyan) 50%, transparent)"
						},
						children: loading ? "Authenticating..." : "Unseal Console"
					})
				]
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl bg-ink/5 p-2 text-[color:var(--cyan)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 20 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
						children: "Cybersecurity Portal Admin"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-3xl font-semibold tracking-tight text-foreground",
					children: "Administrative Console"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleLogout,
						className: "inline-flex items-center gap-2 rounded-xl bg-ink/5 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-ink/10 hover:text-foreground border border-ink/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 16 }), " Seal Console"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					{
						label: "Total Submissions",
						val: submissions.length,
						icon: Database,
						color: "var(--cyan)"
					},
					{
						label: "Average Shield Score",
						val: `${avgScore}/100`,
						icon: Cpu,
						color: "var(--success)"
					},
					{
						label: "High Risk Business",
						val: highRiskCount,
						icon: ShieldAlert,
						color: "var(--danger)"
					},
					{
						label: "Zoho CRM Connection",
						val: settings.zohoEnabled ? "Active" : "Disabled",
						icon: Server,
						color: settings.zohoEnabled ? "var(--success)" : "var(--warning)"
					}
				].map((stat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 15
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .05 },
					className: "glass rounded-3xl p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-muted-foreground",
							children: stat.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(stat.icon, {
							size: 20,
							style: { color: stat.color }
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-3xl font-semibold tracking-tight text-foreground",
						children: stat.val
					})]
				}, stat.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-8 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2 space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-3xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-xl font-bold tracking-tight text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, {
										size: 18,
										className: "text-muted-foreground"
									}), "Assessment Submissions"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleExportCSV,
									disabled: submissions.length === 0,
									className: "inline-flex items-center gap-2 rounded-xl bg-ink/5 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-ink/10 disabled:opacity-40 border border-ink/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 14 }), " Export CSV"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row gap-3 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 glass px-3 py-2 rounded-xl flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
											size: 16,
											className: "text-muted-foreground"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											placeholder: "Query name, business, domain, or email...",
											value: searchTerm,
											onChange: (e) => setSearchTerm(e.target.value),
											className: "bg-transparent text-sm w-full focus:outline-none"
										}),
										searchTerm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setSearchTerm(""),
											className: "text-xs text-muted-foreground hover:text-foreground",
											children: "Clear"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "glass px-3 py-2 rounded-xl flex items-center gap-2 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, {
										size: 14,
										className: "text-muted-foreground"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: riskFilter,
										onChange: (e) => setRiskFilter(e.target.value),
										className: "bg-transparent text-sm focus:outline-none pr-4 text-foreground appearance-none",
										"aria-label": "Risk band",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "all",
												children: "All Scores"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "compromised",
												children: "Exposed (<50)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "developing",
												children: "Developing (50-79)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "resilient",
												children: "Resilient (80+)"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: filteredSubmissions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-12 text-center text-sm text-muted-foreground",
									children: "No submissions found matching filters."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left border-collapse text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-ink/10 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-3 px-2",
												children: "Business & Lead"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-3 px-2",
												children: "Role"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-3 px-2 text-center",
												children: "Score"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-3 px-2 text-right",
												children: "Actions"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-ink/5",
										children: filteredSubmissions.map((sub) => {
											const score = sub.score || 0;
											let badgeStyle = {
												bg: "bg-danger/10",
												text: "text-danger"
											};
											if (score >= 80) badgeStyle = {
												bg: "bg-success/10",
												text: "text-success"
											};
											else if (score >= 50) badgeStyle = {
												bg: "bg-warning/10",
												text: "text-warning"
											};
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-ink/5 transition-colors group",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-4 px-2 max-w-xs truncate",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-semibold text-foreground truncate",
															children: sub.business || "No Name"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-xs text-muted-foreground truncate",
															children: [
																sub.name,
																" · ",
																sub.email
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-4 px-2 text-muted-foreground text-xs",
														children: [sub.role || "N/A", sub.decision_maker?.startsWith("Yes") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-1 inline-flex items-center rounded-full bg-cyan/10 px-1.5 py-0.5 text-[9px] font-medium text-[color:var(--cyan)]",
															children: "DM"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-4 px-2 text-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStyle.bg} ${badgeStyle.text}`,
															children: score
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-4 px-2 text-right",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-end gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																onClick: () => setSelectedSub(sub),
																className: "p-1 px-2.5 rounded-lg bg-ink/5 border border-ink/10 text-xs font-medium text-foreground hover:bg-ink/10 hover:text-[color:var(--cyan)] flex items-center gap-1 transition-colors",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 12 }), " Inspect"]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => handleDelete(sub.email),
																className: "p-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/10 hover:bg-destructive/20 transition-colors",
																"aria-label": "Delete Submission",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 })
															})]
														})
													})
												]
											}, sub.id || sub.email);
										})
									})]
								})
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-3xl p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-xl font-bold tracking-tight text-foreground flex items-center gap-2 mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, {
								size: 18,
								className: "text-muted-foreground"
							}), "Global Settings"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1 mb-2",
										children: "Calendly Booking Link"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "glass rounded-2xl p-2 flex items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, {
											size: 16,
											className: "text-muted-foreground mx-2 shrink-0"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: settings.calendlyUrl,
											onChange: (e) => setSettings({
												...settings,
												calendlyUrl: e.target.value
											}),
											placeholder: "https://calendly.com/your-team",
											className: "w-full bg-transparent text-sm text-foreground focus:outline-none"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-[11px] text-muted-foreground pl-1",
										children: "Updates all \"Schedule\" and \"Book Consultation\" CTA URLs dynamically."
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border-t border-ink/10 pt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-sm font-semibold text-foreground flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, {
												size: 14,
												className: "text-muted-foreground"
											}), "Zoho CRM Syncing"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-0.5",
											children: "Forward leads and scan results directly to Zoho CRM."
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "relative inline-flex items-center cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: settings.zohoEnabled,
												onChange: (e) => setSettings({
													...settings,
													zohoEnabled: e.target.checked
												}),
												className: "sr-only peer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11 h-6 bg-ink/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[color:var(--cyan)]" })]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-ink/10 pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1 mb-2",
										children: "Scanning Engine Mode"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [{
											key: "authentic",
											label: "Authentic",
											desc: "Runs live network lookups",
											icon: Cpu
										}, {
											key: "mock",
											label: "Simulated",
											desc: "Fast mock scan results",
											icon: TriangleAlert
										}].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setSettings({
												...settings,
												scanMode: mode.key
											}),
											className: `flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${settings.scanMode === mode.key ? "bg-[color:var(--cyan)]/10 border-[color:var(--cyan)] text-foreground" : "bg-ink/5 border-ink/10 text-muted-foreground hover:bg-ink/10"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(mode.icon, {
													size: 16,
													className: settings.scanMode === mode.key ? "text-[color:var(--cyan)]" : ""
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-semibold mt-1",
													children: mode.label
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] mt-0.5 hidden sm:inline",
													children: mode.desc
												})
											]
										}, mode.key))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border-t border-ink/10 pt-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleSaveSettings,
										disabled: saveStatus === "saving",
										className: "w-full inline-flex justify-center items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all",
										style: { background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))" },
										children: [
											saveStatus === "saving" && "Saving settings...",
											saveStatus === "idle" && "Save Settings",
											saveStatus === "success" && "Settings Saved successfully!",
											saveStatus === "error" && "Error updating settings!"
										]
									})
								})
							]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: selectedSub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						scale: .95,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					exit: {
						scale: .95,
						opacity: 0
					},
					className: "glass-strong w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between border-b border-ink/10 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl font-bold tracking-tight text-foreground",
							children: selectedSub.business
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: ["Submission check ID: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: selectedSub.email
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedSub(null),
							className: "rounded-lg p-1.5 text-muted-foreground hover:bg-ink/5 hover:text-foreground text-sm font-semibold",
							children: "Close"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "glass p-4 rounded-2xl",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] uppercase font-semibold text-muted-foreground tracking-wider",
												children: "Business Lead"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-foreground mt-1",
												children: selectedSub.name || "N/A"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground truncate",
												children: selectedSub.email
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "glass p-4 rounded-2xl",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] uppercase font-semibold text-muted-foreground tracking-wider",
												children: "Phone & Role"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-foreground mt-1 truncate",
												children: selectedSub.phone || "N/A"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground truncate",
												children: selectedSub.role || "N/A"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "glass p-4 rounded-2xl",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] uppercase font-semibold text-muted-foreground tracking-wider",
												children: "Score & Decision Maker"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-bold text-foreground mt-1",
												children: [selectedSub.score, "/100"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground truncate",
												children: selectedSub.decision_maker || "N/A"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "glass p-5 rounded-2xl space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs uppercase tracking-wider font-bold text-foreground mb-1",
										children: "Company Profile"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs space-y-2 text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between border-b border-ink/5 pb-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Staff Size:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-semibold",
													children: selectedSub.profile?.size || "Not answered"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between border-b border-ink/5 pb-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "IT Support:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-semibold",
													children: selectedSub.profile?.it || "Not answered"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between border-b border-ink/5 pb-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Infrastructure:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-semibold",
													children: selectedSub.profile?.setup || "Not answered"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between border-b border-ink/5 pb-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Industry:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-semibold",
													children: selectedSub.profile?.industry || "Not answered"
												})]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "glass p-5 rounded-2xl space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs uppercase tracking-wider font-bold text-foreground mb-1",
										children: "Questionnaire Answers"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs max-h-48 overflow-y-auto space-y-2 pr-1",
										children: selectedSub.answers && Object.entries(selectedSub.answers).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between border-b border-ink/5 pb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "capitalize",
												children: key.replace(/([A-Z])/g, " $1")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `font-semibold px-2 py-0.5 rounded text-[10px] ${value === "Yes" || value === "Own domain" || value === "Manager" || value === "Yes regularly" ? "bg-success/15 text-success" : value === "No" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"}`,
												children: value
											})]
										}, key))
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass p-6 rounded-2xl space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs uppercase tracking-wider font-bold text-foreground mb-2",
									children: "Technical Scan Summary"
								}), selectedSub.scan_result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Scanned Website:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-mono",
												children: selectedSub.scan_result.domain
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Reachable / HTTPS:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-foreground font-semibold",
												children: [
													selectedSub.scan_result.reachable ? "PASS" : "FAIL",
													" / ",
													selectedSub.scan_result.https ? "PASS" : "FAIL"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "SSL Certificate Validity:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `${selectedSub.scan_result.ssl === "valid" ? "text-success" : "text-danger"} font-semibold uppercase`,
												children: selectedSub.scan_result.ssl || "weak"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "DNSSEC Enabled:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-semibold",
												children: selectedSub.scan_result.dnssec ? "PASS" : "FAIL"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "CAA Record Found:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-semibold",
												children: selectedSub.scan_result.caa ? "PASS" : "FAIL"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Mail Provider detected:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-semibold truncate max-w-[150px]",
												children: selectedSub.scan_result.mailProvider || "None / DNS only"
											})]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Email Security Header (SPF):"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: selectedSub.scan_result.spf ? "text-success font-semibold" : "text-danger font-semibold",
												children: selectedSub.scan_result.spf ? "PASS" : "FAIL"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Email Signature (DKIM):"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: selectedSub.scan_result.dkim ? "text-success font-semibold" : "text-danger font-semibold",
												children: selectedSub.scan_result.dkim ? "PASS" : "FAIL"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Email Policy (DMARC / Policy):"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: selectedSub.scan_result.dmarc ? "text-success font-semibold" : "text-danger font-semibold",
												children: selectedSub.scan_result.dmarc ? `PASS (${selectedSub.scan_result.dmarcPolicy || "none"})` : "FAIL"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Public Exposure (Breaches):"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `${(selectedSub.scan_result.breach?.count || 0) > 0 ? "text-danger" : "text-success"} font-semibold`,
												children: [selectedSub.scan_result.breach?.count || 0, " breaches found"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Exposed Sensitive Folders:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-foreground font-semibold",
												children: [selectedSub.scan_result.exposedPaths?.length || 0, " exposed"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between border-b border-ink/5 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Vulnerable open ports:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-foreground font-semibold",
												children: [selectedSub.scan_result.ports?.length || 0, " open"]
											})]
										})
									] })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground text-center py-4",
									children: "No technical scan data was persisted for this lead."
								})]
							})
						]
					})]
				})
			}) })
		]
	});
}
//#endregion
export { AdminPage as component };
