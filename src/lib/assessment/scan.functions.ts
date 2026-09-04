import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { scanDomain, fetchEmailBreaches } from "./scan.server";
import { mockScan } from "./scan";
import {
  saveSubmissionToDb,
  getSubmissions,
  deleteSubmission,
  getGlobalSettings,
  saveGlobalSettings,
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
    let dbResult = null;
    let crmResult = null;
    
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

    return {
      db: { success: dbSuccess, data: dbResult },
      crm: { success: crmSuccess, data: crmResult },
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

export const sendReportEmail = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        email: z.string().email(),
        score: z.number(),
        band: z.string(),
        business: z.string(),
        name: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured. Simulating email send.");
      return { success: true, simulated: true };
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2>Your Shield Score Report - ${data.business}</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for completing the Shield Score assessment. Your current cyber risk score is <strong>${data.score}/100</strong> (${data.band}).</p>
        <p>Your full executive report details your critical security gaps and provides actionable steps to secure your business.</p>
        <p>Best regards,<br/>The Shield Identity Team</p>
      </div>
    `;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Shield Identity <reports@shield-identity.com>",
          to: data.email,
          subject: `Your Shield Score (${data.score}/100) - ${data.business}`,
          html,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      return { success: true };
    } catch (err) {
      console.error("Failed to send report email:", err);
      throw new Error("Failed to send email");
    }
  });

