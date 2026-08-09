import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Database,
  Link2,
  Cpu,
  Server,
  LogOut,
  Trash2,
  Eye,
  Download,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Search,
  Filter,
} from "lucide-react";
import {
  getAdminSettings,
  saveAdminSettings,
  getSubmissionsList,
  deleteSubmissionRecord,
} from "@/lib/assessment/scan.functions";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin Panel | Shield Score Assessment" },
      { name: "description", content: "Shield Score Cybersecurity Assessment Administration" },
    ],
  }),
});

function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // System states
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    calendlyUrl: "https://shield-identity.com/contact",
    zohoEnabled: true,
    scanMode: "authentic" as "authentic" | "mock",
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  
  // Table search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  // Selected submission detail modal
  const [selectedSub, setSelectedSub] = useState<any | null>(null);

  // Check session storage on mount
  useEffect(() => {
    const savedPassword = sessionStorage.getItem("shield_admin_pass");
    if (savedPassword) {
      attemptLogin(savedPassword);
    }
  }, []);

  const attemptLogin = async (pass: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Validate password by attempting to retrieve submissions
      const list = await getSubmissionsList({ data: { password: pass } });
      setSubmissions(list);
      
      // Load configurations
      const config = await getAdminSettings();
      setSettings({
        calendlyUrl: config.calendlyUrl || "https://shield-identity.com/contact",
        zohoEnabled: config.zohoEnabled ?? true,
        scanMode: (config.scanMode as "authentic" | "mock") || "authentic",
      });

      setIsLoggedIn(true);
      setPassword(pass);
      sessionStorage.setItem("shield_admin_pass", pass);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid password or network error");
      sessionStorage.removeItem("shield_admin_pass");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
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
      await saveAdminSettings({
        data: {
          password,
          settings,
        },
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  const handleDelete = async (email: string) => {
    if (!window.confirm(`Are you sure you want to delete the submission for ${email}?`)) {
      return;
    }
    try {
      await deleteSubmissionRecord({
        data: {
          password,
          email,
        },
      });
      // Refresh list
      setSubmissions(submissions.filter((s) => s.email !== email));
      if (selectedSub && selectedSub.email === email) {
        setSelectedSub(null);
      }
    } catch (err: any) {
      alert(`Error deleting check: ${err.message || "Unknown error"}`);
    }
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    
    const headers = ["Business", "Name", "Email", "Phone", "Role", "Decision Maker", "Score", "Date"];
    const rows = submissions.map((s) => [
      s.business || "",
      s.name || "",
      s.email || "",
      s.phone || "",
      s.role || "",
      s.decision_maker || "",
      s.score ?? "",
      s.created_at ? new Date(s.created_at).toLocaleString() : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shield_score_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.business?.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (riskFilter === "all") return matchesSearch;
    if (riskFilter === "compromised") return matchesSearch && (sub.score < 50);
    if (riskFilter === "developing") return matchesSearch && (sub.score >= 50 && sub.score < 80);
    if (riskFilter === "resilient") return matchesSearch && (sub.score >= 80);
    return matchesSearch;
  });

  // Risk breakdowns
  const highRiskCount = submissions.filter((s) => (s.score || 0) < 50).length;
  const avgScore = submissions.length
    ? Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / submissions.length)
    : 0;

  if (!isLoggedIn) {
    return (
      <div className="flex min-height-screen min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong w-full max-w-md rounded-3xl p-8"
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/10 text-[color:var(--cyan)]">
              <Lock size={28} />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
              Shield Score Control Center
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the system administration passcode to access dashboard controls and scan submissions.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-8 space-y-4">
            <div className="glass rounded-2xl p-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                placeholder="System Administrator Passcode"
                className="w-full bg-transparent px-3 py-2 text-center text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl bg-destructive/10 px-4 py-3 text-center text-xs font-medium text-destructive border border-destructive/20"
              >
                {errorMsg}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-all disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
                boxShadow: "0 10px 30px -10px color-mix(in oklab, var(--cyan) 50%, transparent)",
              }}
            >
              {loading ? "Authenticating..." : "Unseal Console"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-ink/5 p-2 text-[color:var(--cyan)]">
              <Sparkles size={20} />
            </div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Cybersecurity Portal Admin
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            Administrative Console
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-ink/5 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-ink/10 hover:text-foreground border border-ink/10"
          >
            <LogOut size={16} /> Seal Console
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Submissions", val: submissions.length, icon: Database, color: "var(--cyan)" },
          { label: "Average Shield Score", val: `${avgScore}/100`, icon: Cpu, color: "var(--success)" },
          { label: "High Risk Business", val: highRiskCount, icon: ShieldAlert, color: "var(--danger)" },
          { 
            label: "Zoho CRM Connection", 
            val: settings.zohoEnabled ? "Active" : "Disabled", 
            icon: Server, 
            color: settings.zohoEnabled ? "var(--success)" : "var(--warning)" 
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              {stat.val}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Database size={18} className="text-muted-foreground" />
                Assessment Submissions
              </h2>
              <button
                onClick={handleExportCSV}
                disabled={submissions.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-ink/5 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-ink/10 disabled:opacity-40 border border-ink/10"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 glass px-3 py-2 rounded-xl flex items-center gap-2">
                <Search size={16} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Query name, business, domain, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-sm w-full focus:outline-none"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="text-xs text-muted-foreground hover:text-foreground">
                    Clear
                  </button>
                )}
              </div>
              <div className="glass px-3 py-2 rounded-xl flex items-center gap-2 shrink-0">
                <Filter size={14} className="text-muted-foreground" />
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none pr-4 text-foreground appearance-none"
                  aria-label="Risk band"
                >
                  <option value="all">All Scores</option>
                  <option value="compromised">Exposed (&lt;50)</option>
                  <option value="developing">Developing (50-79)</option>
                  <option value="resilient">Resilient (80+)</option>
                </select>
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              {filteredSubmissions.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No submissions found matching filters.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-ink/10 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <th className="py-3 px-2">Business & Lead</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2 text-center">Score</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {filteredSubmissions.map((sub) => {
                      const score = sub.score || 0;
                      let badgeStyle = { bg: "bg-danger/10", text: "text-danger" };
                      if (score >= 80) badgeStyle = { bg: "bg-success/10", text: "text-success" };
                      else if (score >= 50) badgeStyle = { bg: "bg-warning/10", text: "text-warning" };

                      return (
                        <tr key={sub.id || sub.email} className="hover:bg-ink/5 transition-colors group">
                          <td className="py-4 px-2 max-w-xs truncate">
                            <div className="font-semibold text-foreground truncate">{sub.business || "No Name"}</div>
                            <div className="text-xs text-muted-foreground truncate">{sub.name} · {sub.email}</div>
                          </td>
                          <td className="py-4 px-2 text-muted-foreground text-xs">
                            {sub.role || "N/A"}
                            {sub.decision_maker?.startsWith("Yes") && (
                              <span className="ml-1 inline-flex items-center rounded-full bg-cyan/10 px-1.5 py-0.5 text-[9px] font-medium text-[color:var(--cyan)]">
                                DM
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStyle.bg} ${badgeStyle.text}`}>
                              {score}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedSub(sub)}
                                className="p-1 px-2.5 rounded-lg bg-ink/5 border border-ink/10 text-xs font-medium text-foreground hover:bg-ink/10 hover:text-[color:var(--cyan)] flex items-center gap-1 transition-colors"
                              >
                                <Eye size={12} /> Inspect
                              </button>
                              <button
                                onClick={() => handleDelete(sub.email)}
                                className="p-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/10 hover:bg-destructive/20 transition-colors"
                                aria-label="Delete Submission"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 mb-6">
              <Link2 size={18} className="text-muted-foreground" />
              Global Settings
            </h2>

            <div className="space-y-5">
              {/* Calendly LINK */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1 mb-2">
                  Calendly Booking Link
                </label>
                <div className="glass rounded-2xl p-2 flex items-center">
                  <Link2 size={16} className="text-muted-foreground mx-2 shrink-0" />
                  <input
                    type="text"
                    value={settings.calendlyUrl}
                    onChange={(e) => setSettings({ ...settings, calendlyUrl: e.target.value })}
                    placeholder="https://calendly.com/your-team"
                    className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground pl-1">
                  Updates all "Schedule" and "Book Consultation" CTA URLs dynamically.
                </p>
              </div>

              {/* ZOHO TOGGLE */}
              <div className="border-t border-ink/10 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Server size={14} className="text-muted-foreground" />
                      Zoho CRM Syncing
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Forward leads and scan results directly to Zoho CRM.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.zohoEnabled}
                      onChange={(e) => setSettings({ ...settings, zohoEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-ink/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[color:var(--cyan)]"></div>
                  </label>
                </div>
              </div>

              {/* SCAN MODE */}
              <div className="border-t border-ink/10 pt-4">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1 mb-2">
                  Scanning Engine Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "authentic", label: "Authentic", desc: "Runs live network lookups", icon: Cpu },
                    { key: "mock", label: "Simulated", desc: "Fast mock scan results", icon: AlertTriangle },
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      onClick={() => setSettings({ ...settings, scanMode: mode.key as any })}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                        settings.scanMode === mode.key
                          ? "bg-[color:var(--cyan)]/10 border-[color:var(--cyan)] text-foreground"
                          : "bg-ink/5 border-ink/10 text-muted-foreground hover:bg-ink/10"
                      }`}
                    >
                      <mode.icon size={16} className={settings.scanMode === mode.key ? "text-[color:var(--cyan)]" : ""} />
                      <span className="text-xs font-semibold mt-1">{mode.label}</span>
                      <span className="text-[9px] mt-0.5 hidden sm:inline">{mode.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="border-t border-ink/10 pt-5">
                <button
                  onClick={handleSaveSettings}
                  disabled={saveStatus === "saving"}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all"
                  style={{
                    background: "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
                  }}
                >
                  {saveStatus === "saving" && "Saving settings..."}
                  {saveStatus === "idle" && "Save Settings"}
                  {saveStatus === "success" && "Settings Saved successfully!"}
                  {saveStatus === "error" && "Error updating settings!"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Submission Inspector Modal */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-strong w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-ink/10 pb-4">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {selectedSub.business}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Submission check ID: <span className="font-mono text-xs">{selectedSub.email}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-ink/5 hover:text-foreground text-sm font-semibold"
                >
                  Close
                </button>
              </div>

              {/* Modal Body */}
              <div className="mt-6 space-y-6">
                {/* 1. Lead Section */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="glass p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Business Lead</span>
                    <div className="font-bold text-foreground mt-1">{selectedSub.name || "N/A"}</div>
                    <div className="text-xs text-muted-foreground truncate">{selectedSub.email}</div>
                  </div>
                  <div className="glass p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Phone & Role</span>
                    <div className="font-bold text-foreground mt-1 truncate">{selectedSub.phone || "N/A"}</div>
                    <div className="text-xs text-muted-foreground truncate">{selectedSub.role || "N/A"}</div>
                  </div>
                  <div className="glass p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Score & Decision Maker</span>
                    <div className="font-bold text-foreground mt-1">{selectedSub.score}/100</div>
                    <div className="text-xs text-muted-foreground truncate">{selectedSub.decision_maker || "N/A"}</div>
                  </div>
                </div>

                {/* 2. Profile Details & Questionnaire */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="glass p-5 rounded-2xl space-y-3">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-foreground mb-1">Company Profile</h4>
                    <div className="text-xs space-y-2 text-muted-foreground">
                      <div className="flex justify-between border-b border-ink/5 pb-1">
                        <span>Staff Size:</span>
                        <span className="text-foreground font-semibold">{selectedSub.profile?.size || "Not answered"}</span>
                      </div>
                      <div className="flex justify-between border-b border-ink/5 pb-1">
                        <span>IT Support:</span>
                        <span className="text-foreground font-semibold">{selectedSub.profile?.it || "Not answered"}</span>
                      </div>
                      <div className="flex justify-between border-b border-ink/5 pb-1">
                        <span>Infrastructure:</span>
                        <span className="text-foreground font-semibold">{selectedSub.profile?.setup || "Not answered"}</span>
                      </div>
                      <div className="flex justify-between border-b border-ink/5 pb-1">
                        <span>Industry:</span>
                        <span className="text-foreground font-semibold">{selectedSub.profile?.industry || "Not answered"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-5 rounded-2xl space-y-2">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-foreground mb-1">Questionnaire Answers</h4>
                    <div className="text-xs max-h-48 overflow-y-auto space-y-2 pr-1">
                      {selectedSub.answers && Object.entries(selectedSub.answers).map(([key, value]: any) => (
                        <div key={key} className="flex items-center justify-between border-b border-ink/5 pb-1">
                          <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                              value === "Yes" || value === "Own domain" || value === "Manager" || value === "Yes regularly"
                                ? "bg-success/15 text-success"
                                : value === "No"
                                ? "bg-danger/15 text-danger"
                                : "bg-warning/15 text-warning"
                            }`}
                          >
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Scan Findings Details */}
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-foreground mb-2">Technical Scan Summary</h4>
                  {selectedSub.scan_result ? (
                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">Scanned Website:</span>
                          <span className="text-foreground font-mono">{selectedSub.scan_result.domain}</span>
                        </div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">Reachable / HTTPS:</span>
                          <span className="text-foreground font-semibold">
                            {selectedSub.scan_result.reachable ? "PASS" : "FAIL"} / {selectedSub.scan_result.https ? "PASS" : "FAIL"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">SSL Certificate Validity:</span>
                          <span className={`${selectedSub.scan_result.ssl === "valid" ? "text-success" : "text-danger"} font-semibold uppercase`}>
                            {selectedSub.scan_result.ssl || "weak"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">DNSSEC Enabled:</span>
                          <span className="text-foreground font-semibold">{selectedSub.scan_result.dnssec ? "PASS" : "FAIL"}</span>
                        </div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">CAA Record Found:</span>
                          <span className="text-foreground font-semibold">{selectedSub.scan_result.caa ? "PASS" : "FAIL"}</span>
                        </div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">Mail Provider detected:</span>
                          <span className="text-foreground font-semibold truncate max-w-[150px]">{selectedSub.scan_result.mailProvider || "None / DNS only"}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">Email Security Header (SPF):</span>
                          <span className={selectedSub.scan_result.spf ? "text-success font-semibold" : "text-danger font-semibold"}>
                            {selectedSub.scan_result.spf ? "PASS" : "FAIL"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">Email Signature (DKIM):</span>
                          <span className={selectedSub.scan_result.dkim ? "text-success font-semibold" : "text-danger font-semibold"}>
                            {selectedSub.scan_result.dkim ? "PASS" : "FAIL"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">Email Policy (DMARC / Policy):</span>
                          <span className={selectedSub.scan_result.dmarc ? "text-success font-semibold" : "text-danger font-semibold"}>
                            {selectedSub.scan_result.dmarc ? `PASS (${selectedSub.scan_result.dmarcPolicy || "none"})` : "FAIL"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">Public Exposure (Breaches):</span>
                          <span className={`${(selectedSub.scan_result.breach?.count || 0) > 0 ? "text-danger" : "text-success"} font-semibold`}>
                            {selectedSub.scan_result.breach?.count || 0} breaches found
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">Exposed Sensitive Folders:</span>
                          <span className="text-foreground font-semibold">
                            {selectedSub.scan_result.exposedPaths?.length || 0} exposed
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-ink/5 py-1">
                          <span className="text-muted-foreground">Vulnerable open ports:</span>
                          <span className="text-foreground font-semibold">
                            {selectedSub.scan_result.ports?.length || 0} open
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-4">No technical scan data was persisted for this lead.</div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
