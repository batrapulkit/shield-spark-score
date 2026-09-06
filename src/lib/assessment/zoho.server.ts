import type { Answers, Lead, Profile, ScanResult } from "./types";
import { computeScore, computeFlags, computePriority, computeND, isSensitive } from "./engine";

interface ZohoTokenResponse {
  access_token: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getZohoAccessToken(): Promise<string> {
  const now = Date.now();
  // Buffer of 60 seconds
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }

  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const oauthUrl = process.env.ZOHO_OAUTH_URL || "https://accounts.zohocloud.ca/oauth/v2/token";

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Zoho credentials in environment variables.");
  }

  console.log("Refreshing Zoho access token...");
  const response = await fetch(oauthUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to refresh Zoho token: status ${response.status}, body: ${errorBody}`);
  }

  const data = (await response.json()) as ZohoTokenResponse;
  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;
  console.log("Successfully refreshed Zoho access token. Expires in:", data.expires_in, "seconds.");
  return cachedToken;
}

export async function createZohoLead(
  lead: Lead,
  profile: Profile,
  answers: Answers,
  scan: ScanResult | null,
  customQuick?: any[],
  customDeep?: any[],
  extraEmails?: string[]
) {
  const token = await getZohoAccessToken();
  const apiBase = process.env.ZOHO_API_BASE || "https://www.zohoapis.ca/crm/v7";

  console.log(`Submitting lead ${lead.email} to Zoho CRM...`);

  // Calculate assessment details to store in the Description
  const score = computeScore(profile, answers, scan, customQuick, customDeep);
  const flags = computeFlags(profile, answers, scan, customQuick, customDeep);
  const sensitive = isSensitive(profile, answers);
  const priority = computePriority(flags, scan, sensitive, score.final, lead.decisionMaker);
  const nd = computeND(profile, answers, scan, lead.decisionMaker, score.final);

  const [firstName, ...lastNameParts] = lead.name.trim().split(" ");
  const lastName = lastNameParts.join(" ") || firstName; // Zoho CRM requires Last Name

  // Generate detailed CRM card description
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
    `SSL Certificate: ${scan?.ssl || "N/A"}`,
    `DNSSEC Enabled: ${scan?.dnssec ? "Yes" : "No"}`,
    `CAA Record configuration: ${scan?.caa ? "Yes" : "No"}`,
    `Mail Provider: ${scan?.mailProvider || "N/A"}`,
    `SPF configured: ${scan?.spf ? "Yes" : "No"}`,
    `DKIM configured: ${scan?.dkim ? "Yes" : "No"}`,
    `DMARC policy: ${scan?.dmarc ? `Yes (${scan?.dmarcPolicy || "none"})` : "No"}`,
    `Exposed credentials count: ${scan?.breach?.checked ? scan.breach.count : "Not checked"}`,
    scan?.breach?.count && scan.breach.count > 0
      ? `Breached databases: ${scan.breach.breaches.join(", ")}`
      : null,
    scan?.exposedPaths && scan.exposedPaths.length > 0
      ? `Exposed Sensitive Paths: ${scan.exposedPaths.join(", ")}`
      : null,
    scan?.ports && scan.ports.length > 0
      ? `Open Ports: ${scan.ports.join(", ")}`
      : null,
    ``,
    `=== QUESTIONNAIRE ANSWERS ===`,
    ...Object.entries(answers).map(([key, val]) => {
      const matchedQ = [...(customQuick || []), ...(customDeep || [])].find((q) => q.id === key);
      const qText = matchedQ ? matchedQ.question : key.replace(/([A-Z])/g, " $1");
      return `- ${qText}: ${val}`;
    }),
    ``,
    `=== CRITICAL COMPLIANCE DETAILS ===`,
    `Consent to Contact: ${lead.consent ? "Yes" : "No"}`,
    `Is Decision Maker: ${lead.decisionMaker}`,
    `Lead Source Domain: ${lead.sourceDomain || "unknown"}`,
    extraEmails && extraEmails.length > 0
      ? `Additional Emails for Alerts: ${extraEmails.join(", ")}`
      : null,
  ].filter((p) => p !== null);

  const payload = {
    data: [
      {
        First_Name: lastNameParts.length > 0 ? firstName : "",
        Last_Name: lastName,
        Company: lead.business || "N/A",
        Email: lead.email,
        Phone: lead.phone,
        Designation: lead.role,
        Lead_Source: "Cybersecurity Shield Score Scan",
        Description: descriptionParts.join("\n"),
        Website: scan?.domain || lead.business,
      },
    ],
  };

  const response = await fetch(`${apiBase}/Leads`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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
