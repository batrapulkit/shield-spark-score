import fs from 'fs';
import path from 'path';

// Minimal .env parser
const envContent = fs.readFileSync('.env', 'utf-8');
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    process.env[key] = value.trim();
  }
});

async function main() {
  // Dynamically import AFTER process.env is configured
  const { saveSubmissionToDb } = await import("../src/lib/assessment/supabase.server");

  const lead = {
    name: "John Test",
    email: "john.test@shield-identity.local",
    business: "shield-identity.local",
    phone: "111-222-3333",
    role: "SecOps",
    decisionMaker: "Yes, I decide" as const,
    consent: true,
  };

  const profile = {
    size: "Just me (no staff)" as const,
    it: "Me / the owner" as const,
    setup: "Everything's in the cloud (Microsoft 365, Google…)" as const,
    industry: "Professional services (legal, accounting, consulting)" as const,
  };

  const answers = {
    emailmfa: "Yes" as const,
    edr: "Yes" as const,
    backup: "Yes" as const,
  };

  const scan = {
    domain: "shield-identity.local",
    emails: ["john.test@shield-identity.local"],
    reachable: true,
    https: true,
    ssl: "valid" as const,
    spf: true,
    dkim: true,
    dmarc: true,
    dmarcPolicy: "reject" as const,
    tlsBad: false,
    headers: true,
    headersFound: ["HSTS", "CSP"],
    headersMissing: [],
    mx: ["mail.shield-identity.local"],
    mailProvider: "Google Workspace",
    caa: true,
    dnssec: true,
    nameservers: ["ns1.shield-identity.local"],
    subdomains: [],
    subdomainsChecked: true,
    exposedPaths: [],
    exposedPathsChecked: true,
    cookieIssues: [],
    cookiesChecked: true,
    mixedContent: 0,
    banner: null,
    ports: [],
    portsChecked: true,
    breach: { count: 0, breaches: [], checked: true },
    tech: ["React"],
  };

  console.log("Calling saveSubmissionToDb dynamically...");
  try {
    const result = await saveSubmissionToDb(lead, profile, answers, scan);
    console.log("Success! Result:", result);
  } catch (err) {
    console.error("Failed to save:", err);
  }
}

main();
