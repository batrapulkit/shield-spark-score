import { DEEP_QUESTIONS, INDUSTRY_META, QUICK_QUESTIONS, type QuestionDef } from "./data";
import type { Answers, DecisionMaker, Profile, ScanResult } from "./types";

// ---- helpers ----

export function answerValue(
  qid: keyof Answers,
  answer: string | undefined,
  customQuick?: QuestionDef[],
  customDeep?: QuestionDef[]
): number | null {
  if (answer == null) return null;
  const quickPool = customQuick || QUICK_QUESTIONS;
  const deepPool = customDeep || DEEP_QUESTIONS;
  const q = [...quickPool, ...deepPool].find((x) => x.id === qid);
  if (!q) return null;
  const opt = q.options.find((o) => o.label === answer);
  return opt ? opt.value : null;
}

export function isSolo(profile: Profile) {
  return profile.size === "Just me (no staff)";
}

export function isLocalNet(profile: Profile) {
  return (
    profile.setup === "Cloud plus some office computers" ||
    profile.setup === "We run our own server(s) on site" ||
    profile.setup === "Files mostly live on individual computers"
  );
}

export function staff10plus(profile: Profile) {
  return (
    profile.size === "10–49" ||
    profile.size === "50–99" ||
    profile.size === "100–249" ||
    profile.size === "250+"
  );
}

export function ownServer(profile: Profile) {
  return profile.setup === "We run our own server(s) on site";
}

export function devices11plus(a: Answers) {
  return a.devices === "11–25" || a.devices === "26–50" || a.devices === "51+";
}

export function isSensitive(profile: Profile, a: Answers) {
  return !!(
    profile.industry &&
    INDUSTRY_META[profile.industry] &&
    a.industryData === "Yes"
  );
}

// ---- scoring ----

export interface ScoreBreakdown {
  base: number;
  penalties: number;
  final: number;
  band: "Exposed" | "Developing" | "Resilient";
  bandColor: string;
  totalWeight: number;
  answeredWeight: number;
}

export function computeScore(
  profile: Profile,
  answers: Answers,
  scan: ScanResult | null,
  customQuick?: QuestionDef[],
  customDeep?: QuestionDef[]
): ScoreBreakdown {
  const all: QuestionDef[] = [
    ...(customQuick || QUICK_QUESTIONS),
    ...(customDeep || DEEP_QUESTIONS),
  ];
  let numerator = 0;
  let denominator = 0;
  for (const q of all) {
    if (q.weight === 0) continue;
    // skip rules
    if (q.id === "train" && isSolo(profile)) continue;
    if (q.id === "accessoff" && isSolo(profile)) continue;
    if (q.id === "airules" && answers.aiuse === "No") continue;
    const v = answerValue(
      q.id,
      (answers as Record<string, string | undefined>)[q.id],
      customQuick,
      customDeep
    );
    if (v == null) continue;
    numerator += v * q.weight;
    denominator += q.weight;
  }
  const base = denominator > 0 ? (numerator / denominator) * 100 : 0;

  // Scan penalties — only for verified findings
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


  const final = Math.round(Math.max(0, Math.min(100, base - penalties * 0.6)));
  const band: ScoreBreakdown["band"] =
    final <= 40 ? "Exposed" : final <= 70 ? "Developing" : "Resilient";
  const bandColor =
    band === "Exposed"
      ? "var(--danger)"
      : band === "Developing"
        ? "var(--warning)"
        : "var(--success)";
  return {
    base: Math.round(base),
    penalties,
    final,
    band,
    bandColor,
    totalWeight: denominator,
    answeredWeight: denominator,
  };
}

// ---- flags ----

export interface Flags {
  emailmfa: boolean;
  edr: boolean;
  backup: boolean;
  train: boolean;
  incident: boolean;
  verify: boolean;
  emailtype: boolean;
  assets: boolean;
  patching: boolean;
  pw: boolean;
  monitor: boolean;
  aiPolicy: boolean;
  incidentHistory: boolean;
  remote: boolean;
  soc: boolean;
  msp: boolean;
  pentest: boolean;
  compliance: boolean;
  insurance: boolean;
  m365Consolidation: boolean;
}

export function computeFlags(
  profile: Profile,
  answers: Answers,
  scan: ScanResult | null,
  customQuick?: QuestionDef[],
  customDeep?: QuestionDef[]
): Flags {
  const av = (id: keyof Answers) =>
    answerValue(id, (answers as Record<string, string | undefined>)[id], customQuick, customDeep);
  const answered = (id: keyof Answers) =>
    (answers as Record<string, string | undefined>)[id] != null;

  const emailmfa = av("emailmfa") != null && (av("emailmfa") ?? 1) < 1;
  const edr = av("edr") != null && (av("edr") ?? 1) < 1;
  const backup = av("backup") != null && (av("backup") ?? 1) < 1;
  const train = !isSolo(profile) && answered("train") && (av("train") ?? 1) < 1;
  const incident = av("incident") != null && (av("incident") ?? 1) < 1;
  const verify = av("verify") != null && (av("verify") ?? 1) < 1;
  const emailtype =
    answered("emailtype") && answers.emailtype !== "Own domain";
  const assets = answered("assets") && (av("assets") ?? 1) < 1;
  const patching = answered("patching") && (av("patching") ?? 1) < 1;
  const pw = answered("pw") && (av("pw") ?? 1) < 1;
  const aiPolicy =
    answered("airules") && answers.aiuse !== "No" && (av("airules") ?? 1) < 1;
  const incidentHistory = answers.incidenthistory === "Yes";
  const remote =
    answers.remotework === "Yes" || answers.remotework === "Sometimes";

  const sensitive = isSensitive(profile, answers);
  const breaches = scan?.breach.count ?? 0;

  const monitor =
    answered("monitor") &&
    (av("monitor") ?? 1) < 1 &&
    (staff10plus(profile) || sensitive || breaches > 0);

  const soc = monitor;
  const msp =
    profile.it === "Me / the owner" ||
    profile.it === "No one, really" ||
    (isLocalNet(profile) && profile.it !== "An outside IT company") ||
    patching;

  const m365Consolidation =
    [emailtype, emailmfa, edr].filter(Boolean).length >= 2;

  const pentest =
    (scan?.ports.length ?? 0) > 0 || (scan?.exposedPaths.length ?? 0) > 0 || sensitive;


  const compliance = !!(profile.industry && INDUSTRY_META[profile.industry]);

  const bigFiveGap = emailmfa || edr || backup || train || incident;
  const insurance = bigFiveGap;

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
    pentest,
    compliance,
    insurance,
    m365Consolidation,
  };
}

// ---- Response cards (tab 6) ----

export type Priority = "Critical" | "High" | "Medium" | "Low";

export interface RecommendationCard {
  id: string;
  order: number;
  title: string;
  priority: Priority;
  impact: string;
  why: string;
  fix: string;
  diyGuide?: string;
  category: string;
}

export function buildRecommendations(
  profile: Profile,
  flags: Flags,
  scan?: ScanResult | null,
): RecommendationCard[] {
  const cards: RecommendationCard[] = [];

  if (scan && scan.breach.checked && scan.breach.count > 0) {
    cards.push({
      id: "breached-accounts",
      order: 1.5,
      title: "Change passwords for breached accounts",
      priority: "Critical",
      category: "Identity & Credentials",
      impact: "Compromised credentials allow attackers to bypass standard perimeter security.",
      why: `Your email address (${scan.emails.join(", ")}) was found in ${scan.breach.count} public data breach(es) (${scan.breach.breaches.slice(0, 3).join(", ")}${scan.breach.count > 3 ? "..." : ""}). If you reuse passwords, those accounts are highly vulnerable.`,
      fix: "Immediately change the password for any accounts using this email, ensuring you use unique passwords generated by a password manager for each site. Ensure MFA is enabled wherever possible.",
    });
  }

  const industryFramework = profile.industry
    ? INDUSTRY_META[profile.industry]?.framework
    : undefined;

  if (industryFramework) {
    cards.push({
      id: "industry-note",
      order: 0,
      title: `Industry framework: ${industryFramework}`,
      priority: "Medium",
      category: "Compliance",
      impact:
        "Regulators and clients expect specific controls for your industry.",
      why: `For a ${profile.industry} business, ${industryFramework} is the standard to aim for. Aligning early reduces audit friction and shows customers you take their data seriously.`,
      fix: "Map current controls to the framework and close the gaps first.",
    });
  }

  if (flags.m365Consolidation) {
    const covered = [
      flags.emailtype && "business email domain",
      flags.emailmfa && "MFA on all accounts",
      flags.edr && "endpoint security (EDR)",
    ].filter(Boolean);
    cards.push({
      id: "m365",
      order: 1,
      title: "Consolidate on Microsoft 365 Business Premium (or Google Workspace)",
      priority: "Critical",
      category: "Identity & Email",
      impact:
        "One licence closes several gaps at once — email, identity, MFA, and endpoint protection.",
      why: `One move covers several of these: ${covered.join(", ")}. Business Premium bundles the controls most SMBs are missing today.`,
      fix: "Move email to Microsoft 365 Business Premium, enforce MFA, and deploy Defender for Business to every device.",
      diyGuide: "guide-mfa",
    });
  } else if (flags.emailmfa) {
    cards.push({
      id: "mfa",
      order: 1,
      title: "Enable Multi-Factor Authentication (MFA) for all business accounts",
      priority: "Critical",
      category: "Identity",
      impact:
        "MFA blocks the vast majority of account takeover attempts, even when passwords leak.",
      why: "Attackers routinely try stolen passwords against business email and cloud apps. MFA stops most of these in their tracks.",
      fix: "Turn on MFA in your identity provider and require it for every user, every sign-in.",
      diyGuide: "guide-mfa",
    });
  }

  if (flags.backup) {
    cards.push({
      id: "backup",
      order: 2,
      title: "Make your backups real — separate and tested",
      priority: "Critical",
      category: "Resilience",
      impact:
        "Untested backups routinely fail during ransomware recovery. Tested backups get you back online.",
      why: "Backups only count if they are isolated from your main network and restore successfully when it matters.",
      fix: "Set an off-site or immutable backup, schedule a monthly restore test, and document the runbook.",
      diyGuide: "guide-backup",
    });
  }

  if (flags.train) {
    cards.push({
      id: "train",
      order: 3,
      title: "Teach the team to spot scams",
      priority: "High",
      category: "Human Risk",
      impact:
        "Phishing is still the #1 entry point. A trained team is your cheapest and fastest control.",
      why: "Regular, short training + simulated phishing turns your team into an active detection layer.",
      fix: "Roll out a monthly 5-minute training + quarterly phishing simulation.",
      diyGuide: "guide-phish",
    });
  }

  if (flags.incident) {
    cards.push({
      id: "incident",
      order: 4,
      title: "Write your one-page incident plan",
      priority: "High",
      category: "Business Resilience",
      impact:
        "The first hour of an incident decides the cost. A plan cuts confusion and downtime.",
      why: "Everyone should know who to call, what to shut down, and how to communicate with clients.",
      fix: "Draft a one-page plan with roles, phone numbers, and top-5 first actions. Rehearse it once a year.",
    });
  }

  if (flags.assets) {
    cards.push({
      id: "assets",
      order: 5,
      title: "Start with a simple asset list — free Cyber Starter Kit",
      priority: "Medium",
      category: "Governance",
      impact: "You cannot protect what you cannot see.",
      why: "An asset list is the foundation of patching, access control, and offboarding.",
      fix: "Use the free Shield Cyber Starter Kit template to inventory devices, apps, and cloud services.",
      diyGuide: "kit",
    });
  }

  if (flags.edr && !flags.m365Consolidation) {
    cards.push({
      id: "edr",
      order: 6,
      title: "Put security software (EDR) on every device",
      priority: "Critical",
      category: "Endpoint",
      impact:
        "Modern EDR stops ransomware, malware, and living-off-the-land attacks that antivirus alone misses.",
      why: "Every laptop, desktop and server needs continuous protection — not just the ones you remember.",
      fix: "Deploy a modern EDR (Defender for Business, SentinelOne, CrowdStrike) to 100% of devices.",
    });
  }

  if (flags.pw) {
    cards.push({
      id: "pw",
      order: 7,
      title: "Sort out passwords with a password manager",
      priority: "High",
      category: "Identity",
      impact:
        "Reused passwords let one breach unlock every account. A manager fixes this in an afternoon.",
      why: "Password managers generate unique passwords automatically and stop phishing sites from auto-filling.",
      fix: "Roll out a business password manager (1Password, Bitwarden, Dashlane) to the whole team.",
      diyGuide: "guide-pw",
    });
  }

  if (flags.verify) {
    cards.push({
      id: "verify",
      order: 8,
      title: "Add a verify-the-request rule for payments",
      priority: "High",
      category: "Fraud Prevention",
      impact:
        "Business Email Compromise costs Canadian SMBs millions each year. A phone-check rule stops most of it.",
      why: "Any request to change bank details or wire money should be verified via a known phone number, not email.",
      fix: "Document the rule, add it to your finance runbook, and drill it once a quarter.",
      diyGuide: "guide-phish",
    });
  }

  if (flags.aiPolicy) {
    cards.push({
      id: "aiPolicy",
      order: 9,
      title: "Set a simple AI-use rule",
      priority: "Medium",
      category: "Data Protection",
      impact:
        "Employees paste customer and financial data into public AI tools without realising the risk.",
      why: "A short written rule (what you can/can't paste, approved tools) keeps confidential data inside the business.",
      fix: "Publish a one-page AI-use rule and enable enterprise AI tools where possible.",
      diyGuide: "guide-ai",
    });
  }

  if (flags.pentest) {
    cards.push({
      id: "pentest",
      order: 10,
      title: "Penetration test on internet-facing services",
      priority: "High",
      category: "Infrastructure",
      impact:
        "External services facing the internet are targeted continuously. An annual pen test finds what scanners miss.",
      why: "You have exposed services or sensitive data — a periodic external test validates the controls actually work.",
      fix: "Book an annual external penetration test and remediate high/critical findings within 30 days.",
      diyGuide: "guide-pentest",
    });
  }

  if (flags.compliance && industryFramework) {
    cards.push({
      id: "compliance",
      order: 11,
      title: `Compliance prep: ${industryFramework}`,
      priority: "Medium",
      category: "Compliance",
      impact:
        "Getting ahead of the framework avoids emergency projects when clients or regulators ask.",
      why: `Likely relevant: ${industryFramework}. Building against the framework early is cheaper than retrofitting.`,
      fix: "Do a gap assessment against the framework and prioritise the top-5 controls.",
    });
  }

  if (flags.soc) {
    cards.push({
      id: "soc",
      order: 12,
      title: "Ongoing monitoring (SOC / MDR)",
      priority: "High",
      category: "Detection & Response",
      impact:
        "Most breaches sit undetected for weeks. 24/7 monitoring catches them in hours.",
      why: "Your size, sensitivity, or breach history means monitoring is now a foundational control.",
      fix: "Subscribe to an MDR/SOC service that watches identity, endpoints, and cloud around the clock.",
    });
  }

  if (flags.msp) {
    cards.push({
      id: "msp",
      order: 13,
      title: "Managed IT support",
      priority: "Medium",
      category: "Operations",
      impact:
        "Patching, backups, and account cleanup fall through the cracks without a dedicated owner.",
      why: "You either don't have a full-time IT person or your setup mixes cloud and on-prem in ways that need a specialist.",
      fix: "Engage a managed IT provider for baseline hygiene: patching, backups, MFA, and offboarding.",
    });
  }

  if (flags.insurance) {
    cards.push({
      id: "insurance",
      order: 14,
      title: "Cyber insurance readiness",
      priority: "Medium",
      category: "Risk Transfer",
      impact:
        "Insurers now require MFA, EDR, backups, training, and an incident plan for renewal.",
      why: "Any big-five gap can invalidate a claim or triple your premium at renewal.",
      fix: "Close the big-five gaps first, then review cyber insurance limits with your broker.",
    });
  }

  if (flags.incidentHistory) {
    cards.push({
      id: "incidentHistory",
      order: 15,
      title: "Post-incident hardening review",
      priority: "High",
      category: "Business Resilience",
      impact:
        "A previous cyber incident increases future risk. A detailed security review is recommended.",
      why: "Attackers often revisit victims. Confirming remediation and closing residual access is critical.",
      fix: "Run a focused security review to confirm the incident is fully closed and controls are in place.",
    });
  }

  if (flags.remote) {
    cards.push({
      id: "remote",
      order: 16,
      title: "Secure remote work and personal devices",
      priority: "Medium",
      category: "Endpoint",
      impact:
        "Remote and BYOD devices are outside your office network — they need explicit protection.",
      why: "Without policies and device protection, personal laptops can bring malware straight into your business data.",
      fix: "Publish a remote-work policy, require MFA + EDR on any device used for work.",
    });
  }

  return cards.sort((a, b) => a.order - b.order);
}

// ---- ND decision (tab 7) ----

export interface NDDecision {
  qualified: boolean;
  reason: string;
  gate1Pass: boolean;
  gate2Pass: boolean;
  gate3Pass: boolean;
}

export function computeND(
  profile: Profile,
  answers: Answers,
  scan: ScanResult | null,
  decisionMaker: DecisionMaker | undefined,
  score: number,
): NDDecision {
  const useful =
    isLocalNet(profile) &&
    !isSolo(profile) &&
    (staff10plus(profile) ||
      ownServer(profile) ||
      devices11plus(answers) ||
      profile.it === "Me / the owner" ||
      profile.it === "No one, really");

  const authority =
    decisionMaker === "Yes, I decide" || decisionMaker === "I share that decision";

  const sensitive = isSensitive(profile, answers);
  const breaches = scan?.breach.count ?? 0;
  const worthIt = score < 70 || sensitive || breaches > 0;

  if (!useful) {
    return {
      qualified: false,
      reason: "No internal network worth scanning (all-cloud / very small)",
      gate1Pass: false,
      gate2Pass: authority,
      gate3Pass: worthIt,
    };
  }
  if (!authority) {
    return {
      qualified: false,
      reason: "Not the decision-maker — nurture first",
      gate1Pass: true,
      gate2Pass: false,
      gate3Pass: worthIt,
    };
  }
  if (!worthIt) {
    return {
      qualified: false,
      reason: "Already in good shape — scan not a priority",
      gate1Pass: true,
      gate2Pass: true,
      gate3Pass: false,
    };
  }
  return {
    qualified: true,
    reason: "Qualified: internal footprint + decision-maker + real exposure",
    gate1Pass: true,
    gate2Pass: true,
    gate3Pass: true,
  };
}

// ---- priority ----

export interface PriorityResult {
  score: number;
  band: "Hot" | "Warm" | "Cool";
}

export function computePriority(
  flags: Flags,
  scan: ScanResult | null,
  sensitive: boolean,
  scoreVal: number,
  decisionMaker: DecisionMaker | undefined,
): PriorityResult {
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
    flags.insurance,
  ].filter(Boolean).length;
  p += fitFlags;
  if ((scan?.breach.count ?? 0) > 0) p += 2;
  if (sensitive) p += 2;
  if (scoreVal < 40) p += 2;
  const band = p >= 7 ? "Hot" : p >= 4 ? "Warm" : "Cool";
  return { score: p, band };
}

// ---- Category subscores for dashboard ----

export function categorySubscores(
  profile: Profile,
  answers: Answers,
  customQuick?: QuestionDef[],
  customDeep?: QuestionDef[]
) {
  const av = (id: keyof Answers) =>
    answerValue(id, (answers as Record<string, string | undefined>)[id], customQuick, customDeep);
  const pct = (vals: (number | null)[]) => {
    const filtered = vals.filter((v): v is number => v != null);
    if (!filtered.length) return null;
    return Math.round((filtered.reduce((a, b) => a + b, 0) / filtered.length) * 100);
  };
  return [
    { key: "Email Security", value: pct([av("emailmfa"), av("emailtype")]) },
    { key: "Infrastructure", value: pct([av("edr"), av("patching")]) },
    { key: "Identity Protection", value: pct([av("emailmfa"), av("pw"), av("accessoff")]) },
    { key: "Human Risk", value: pct([av("train"), av("verify")]) },
    {
      key: "Business Resilience",
      value: pct([av("backup"), av("incident"), av("monitor")]),
    },
    { key: "Data Protection", value: pct([av("assets"), av("airules")]) },
  ];
}

export function executiveSummary(
  score: number,
  band: ScoreBreakdown["band"],
  flags: Flags,
): string {
  const gaps: string[] = [];
  if (flags.emailmfa || flags.emailtype) gaps.push("email security and identity");
  if (flags.backup) gaps.push("backup resilience");
  if (flags.train || flags.verify) gaps.push("human risk");
  if (flags.edr || flags.patching) gaps.push("endpoint hygiene");
  if (flags.monitor) gaps.push("monitoring");
  const top = gaps.slice(0, 2).join(" and ") || "a few smaller controls";
  const uplift = Math.min(
    30,
    (flags.emailmfa ? 6 : 0) +
      (flags.edr ? 5 : 0) +
      (flags.backup ? 5 : 0) +
      (flags.train ? 3 : 0) +
      (flags.incident ? 3 : 0) +
      (flags.verify ? 3 : 0) +
      (flags.monitor ? 3 : 0),
  );
  const opener =
    band === "Resilient"
      ? "Your organization demonstrates strong foundational cybersecurity practices."
      : band === "Developing"
        ? "Your organization demonstrates good foundational cybersecurity practices, but several controls require attention."
        : "Your organization has meaningful gaps across foundational cybersecurity controls that need immediate attention.";
  return `${opener} ${top.charAt(0).toUpperCase() + top.slice(1)} present the highest priority. Addressing the flagged items could improve your Shield Score by approximately ${uplift} points and materially reduce business risk.`;
}
