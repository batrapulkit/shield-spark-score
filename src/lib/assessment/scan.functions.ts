import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import nodemailer from "nodemailer";
import { scanDomain, fetchEmailBreaches } from "./scan.server";
import { mockScan } from "./scan";
import {
  saveSubmissionToDb,
  getSubmissions,
  deleteSubmission,
  getGlobalSettings,
  saveGlobalSettings,
  saveWebinarRegistrationToDb,
  getWebinarRegistrationsFromDb,
  deleteWebinarRegistrationFromDb,
} from "./supabase.server";

export const runScan = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({ domain: z.string().min(3), emails: z.array(z.string()).default([]) })
      .parse(data),
  )
  .handler(async ({ data }) => {
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

export const runBreachCheck = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({ email: z.string().email() })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const breaches = await fetchEmailBreaches(data.email);
    return {
      count: breaches.length,
      breaches,
      checked: true,
    };
  });

import { createZohoLead } from "./zoho.server";
import { computeScore, computeFlags, executiveSummary } from "./engine";

export const submitToCrm = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        lead: z.any(),
        profile: z.any(),
        answers: z.any(),
        scan: z.any().nullable(),
        extraEmails: z.array(z.string()).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    let dbSuccess = false;
    let crmSuccess = false;
    let emailSuccess = false;
    let dbResult = null;
    let crmResult = null;
    let emailResult = null;
    
    // Check if CRM integration is toggled globally
    let isCrmSyncEnabled = true;
    let customQuick: any[] | undefined = undefined;
    let customDeep: any[] | undefined = undefined;
    try {
      const settings = await getGlobalSettings();
      if (settings) {
        if (settings.zohoEnabled === false) {
          isCrmSyncEnabled = false;
        }
        customQuick = settings.quickQuestions;
        customDeep = settings.deepQuestions;
      }
    } catch (err) {
      console.warn("Could not check settings for Zoho/Custom questions, defaulting:", err);
    }

    try {
      dbResult = await saveSubmissionToDb(
        data.lead,
        data.profile,
        data.answers,
        data.scan,
        customQuick,
        customDeep
      );
      dbSuccess = true;
    } catch (dbError) {
      console.error("Failed to save submission to Supabase:", dbError);
    }

    if (isCrmSyncEnabled) {
      try {
        crmResult = await createZohoLead(
          data.lead,
          data.profile,
          data.answers,
          data.scan,
          customQuick,
          customDeep,
          data.extraEmails
        );
        crmSuccess = true;
      } catch (crmError) {
        console.error("Failed to sync lead to Zoho CRM:", crmError);
      }
    } else {
      console.log("Zoho CRM sync skipped because it is disabled in global settings.");
      crmResult = { status: "skipped", message: "CRM Sync disabled in system settings" };
    }

    // Automatically send executive report email upon submission
    if (data.lead && data.lead.email) {
      try {
        const scoreObj = computeScore(
          data.profile || {},
          data.answers || {},
          data.scan || null,
          customQuick,
          customDeep
        );
        const flagsObj = computeFlags(
          data.profile || {},
          data.answers || {},
          data.scan || null,
          customQuick,
          customDeep
        );
        const summaryText = executiveSummary(scoreObj.final, scoreObj.band, flagsObj);

        emailResult = await sendReportEmailDirectly({
          email: data.lead.email,
          score: scoreObj.final,
          band: scoreObj.band,
          business: data.lead.business || (data.scan?.domain ? data.scan.domain : "Your Business"),
          name: data.lead.name || "Valued Business Leader",
          summary: summaryText,
        });
        emailSuccess = true;
        console.log(`[Auto-Email] Executive report automatically sent to ${data.lead.email}`);
      } catch (emailErr) {
        console.error("[Auto-Email] Failed to automatically send executive report email:", emailErr);
      }
    }

    return {
      db: { success: dbSuccess, data: dbResult },
      crm: { success: crmSuccess, data: crmResult },
      email: { success: emailSuccess, data: emailResult },
    };
  });

// Admin Panel endpoints
export const getAdminSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const settings = await getGlobalSettings();
      if (settings) {
        return {
          calendlyUrl: settings.calendlyUrl || "https://calendly.com/shieldidentity-ca/consultation",
          resourcesUrl: settings.resourcesUrl || "https://shield-identity.com/resources",
          zohoEnabled: settings.zohoEnabled ?? true,
          scanMode: settings.scanMode || "authentic",
          quickQuestions: settings.quickQuestions,
          deepQuestions: settings.deepQuestions,
        };
      }
      return {
        calendlyUrl: "https://calendly.com/shieldidentity-ca/consultation",
        resourcesUrl: "https://shield-identity.com/resources",
        zohoEnabled: true,
        scanMode: "authentic",
        quickQuestions: undefined,
        deepQuestions: undefined,
      };
    } catch (err) {
      console.error("Failed to load settings server-side, returning defaults:", err);
      return {
        calendlyUrl: "https://calendly.com/shieldidentity-ca/consultation",
        resourcesUrl: "https://shield-identity.com/resources",
        zohoEnabled: true,
        scanMode: "authentic",
        quickQuestions: undefined,
        deepQuestions: undefined,
      };
    }
  });

export const saveAdminSettings = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        password: z.string(),
        settings: z.object({
          calendlyUrl: z.string().url(),
          resourcesUrl: z.string().url().optional(),
          zohoEnabled: z.boolean(),
          scanMode: z.enum(["authentic", "mock"]),
          quickQuestions: z.array(z.any()).optional(),
          deepQuestions: z.array(z.any()).optional(),
        })
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const expectedPassword = "Admin@Shield";
    if (data.password !== expectedPassword) {
      throw new Error("Unauthorized: Invalid password");
    }
    return saveGlobalSettings(data.settings);
  });

export const getSubmissionsList = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        password: z.string()
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const expectedPassword = "Admin@Shield";
    if (data.password !== expectedPassword) {
      throw new Error("Unauthorized: Invalid password");
    }
    return getSubmissions();
  });

export const deleteSubmissionRecord = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        password: z.string(),
        email: z.string()
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const expectedPassword = "Admin@Shield";
    if (data.password !== expectedPassword) {
      throw new Error("Unauthorized: Invalid password");
    }
    return deleteSubmission(data.email);
  });

interface ReportEmailParams {
  email: string;
  score: number;
  band: string;
  business: string;
  name: string;
  summary?: string;
}

async function sendReportEmailDirectly(data: ReportEmailParams) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND_API;
  if (!RESEND_API_KEY) {
    const msg = "[Resend Email] RESEND_API_KEY / RESEND_API environment variable is NOT set in Vercel project environment variables. Emails cannot be dispatched.";
    console.error(msg);
    return { success: false, reason: "MISSING_ENV_KEY", message: msg };
  }

  const bandColor =
    data.band === "Resilient"
      ? "#10B981"
      : data.band === "Developing"
        ? "#F59E0B"
        : "#EF4444";

  const bandLabel =
    data.band === "Resilient"
      ? "Low Cyber Risk · Strong Security Baseline"
      : data.band === "Developing"
        ? "Medium Cyber Risk · Priority Controls Recommended"
        : "High Cyber Risk · Action Required";

  const defaultSummary = data.summary || 
    `Your assessment indicates a cyber risk score of ${data.score}/100 (${data.band}). Key recommendations have been identified to harden your posture.`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Your Shield Score Executive Report</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0d1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e6edf3;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; margin: 0 auto; background-color: #161b22; border-radius: 16px; overflow: hidden; border: 1px solid #30363d; margin-top: 24px; margin-bottom: 24px;">
        <!-- Header Banner -->
        <tr>
          <td style="padding: 32px 32px 24px 32px; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); border-bottom: 1px solid #30363d;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #38bdf8; margin-bottom: 8px;">
              Shield Identity · Executive Report
            </div>
            <h1 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0;">
              ${data.business} Cyber Risk Assessment
            </h1>
            <div style="font-size: 14px; color: #8b949e;">
              Prepared for ${data.name} · ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </td>
        </tr>

        <!-- Score Badge Box -->
        <tr>
          <td style="padding: 32px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #21262d; border-radius: 12px; border: 1px solid #30363d; padding: 24px;">
              <tr>
                <td align="center" style="padding-bottom: 16px;">
                  <div style="display: inline-block; width: 90px; height: 90px; border-radius: 50%; border: 6px solid ${bandColor}; line-height: 90px; text-align: center; font-size: 32px; font-weight: 800; color: #ffffff;">
                    ${data.score}
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <div style="font-size: 18px; font-weight: 700; color: ${bandColor}; margin-bottom: 4px;">
                    ${data.band} (${data.score}/100)
                  </div>
                  <div style="font-size: 13px; color: #8b949e;">
                    ${bandLabel}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Executive Summary -->
        <tr>
          <td style="padding: 0 32px 24px 32px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px;">
              Executive Summary
            </h2>
            <div style="background-color: #21262d; border-left: 4px solid #38bdf8; border-radius: 0 8px 8px 0; padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #c9d1d9;">
              ${defaultSummary}
            </div>
          </td>
        </tr>

        <!-- Key Next Steps & CTA -->
        <tr>
          <td style="padding: 0 32px 32px 32px;">
            <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(56, 189, 248, 0.02) 100%); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 24px; text-align: center;">
              <h3 style="font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">
                Schedule Your Free 15-Min Consultation
              </h3>
              <p style="font-size: 14px; color: #8b949e; margin: 0 0 20px 0; line-height: 1.5;">
                Walk through your full report with a Shield Identity specialist, review your critical security gaps, and prioritize your remediation roadmap.
              </p>
              <a href="https://calendly.com/shieldidentity-ca/consultation" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 14px rgba(56, 189, 248, 0.4);">
                Schedule Consultation &rarr;
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 24px 32px; background-color: #0d1117; border-top: 1px solid #30363d; text-align: center; font-size: 12px; color: #8b949e;">
            <div>Shield Identity · Secure Brampton Assessment Engine</div>
            <div style="margin-top: 4px;">This automated executive report was generated for ${data.email}</div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Helper for sending via Nodemailer / SMTP (e.g. Gmail App Password or custom SMTP)
  const sendViaSmtp = async () => {
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    if (!smtpUser || !smtpPass) return false;

    console.log(`[SMTP Email] Attempting send to ${data.email} via ${smtpHost}...`);
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Shield Identity <${smtpUser}>`,
      to: data.email,
      subject: `Your Shield Score (${data.score}/100) - ${data.business}`,
      html,
    });

    console.log(`[SMTP Email] Report successfully sent to ${data.email} via ${smtpUser}`);
    return true;
  };

  // If SMTP is specifically requested or configured first, try SMTP
  const preferSmtp = Boolean(process.env.SMTP_USER || process.env.GMAIL_USER);
  if (preferSmtp) {
    try {
      const sent = await sendViaSmtp();
      if (sent) return { success: true, method: "smtp" };
    } catch (smtpErr: any) {
      console.warn("[SMTP Email] Primary SMTP send failed, falling back to Resend:", smtpErr.message || smtpErr);
    }
  }

  // Attempt sending via Resend API
  if (RESEND_API_KEY) {
    const sendEmailRequest = async (fromAddress: string) => {
      return await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: data.email,
          subject: `Your Shield Score (${data.score}/100) - ${data.business}`,
          html,
        }),
      });
    };

    const primaryFrom = process.env.RESEND_FROM_EMAIL || "Shield Identity <onboarding@resend.dev>";
    const fallbackFrom = "Shield Identity <onboarding@resend.dev>";

    try {
      let res = await sendEmailRequest(primaryFrom);
      if (!res.ok) {
        const errText = await res.text();
        console.warn(`Primary Resend email send (${primaryFrom}) failed:`, errText);
        
        if (primaryFrom !== fallbackFrom) {
          console.log(`Retrying report email via fallback sender (${fallbackFrom})...`);
          res = await sendEmailRequest(fallbackFrom);
        }
        
        if (!res.ok) {
          // If Resend failed (e.g. 403 unverified domain), attempt SMTP fallback if available
          const smtpSent = await sendViaSmtp();
          if (smtpSent) return { success: true, method: "smtp_fallback" };
          throw new Error(`Resend Error: ${errText}`);
        }
      }
      console.log(`[Resend Email] Report successfully sent to ${data.email}`);
      return { success: true, method: "resend" };
    } catch (err: any) {
      console.error("Failed to send report email via Resend:", err.message || err);
      // Last ditch try to send via SMTP if configured
      try {
        const smtpSent = await sendViaSmtp();
        if (smtpSent) return { success: true, method: "smtp_fallback" };
      } catch {}
      throw err;
    }
  }

  // Fallback try SMTP if RESEND_API_KEY wasn't set
  try {
    const smtpSent = await sendViaSmtp();
    if (smtpSent) return { success: true, method: "smtp" };
  } catch (smtpErr: any) {
    console.error("[SMTP Email] Failed sending via SMTP:", smtpErr);
  }

  return { success: false, reason: "NO_EMAIL_CREDENTIALS" };
}

export const sendReportEmail = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        email: z.string().email(),
        score: z.number(),
        band: z.string(),
        business: z.string(),
        name: z.string(),
        summary: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    return sendReportEmailDirectly(data);
  });

export const submitWebinarRegistration = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        name: z.string(),
        email: z.string().email(),
        business: z.string(),
        phone: z.string().optional(),
        webinarTitle: z.string(),
        sourceDomain: z.string().optional(),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    return await saveWebinarRegistrationToDb(data);
  });

export const getWebinarRegistrationsList = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ password: z.string() }).parse(data)
  )
  .handler(async ({ data }) => {
    if (data.password !== (process.env.ADMIN_PASSWORD || "shield2025")) {
      throw new Error("Unauthorized access");
    }
    return await getWebinarRegistrationsFromDb();
  });

export const deleteWebinarRegistrationRecord = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ password: z.string(), idOrEmail: z.string() }).parse(data)
  )
  .handler(async ({ data }) => {
    if (data.password !== (process.env.ADMIN_PASSWORD || "shield2025")) {
      throw new Error("Unauthorized access");
    }
    return await deleteWebinarRegistrationFromDb(data.idOrEmail);
  });

