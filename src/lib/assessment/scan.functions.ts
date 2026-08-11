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
          calendlyUrl: settings.calendlyUrl || "https://shield-identity.com/contact",
          resourcesUrl: settings.resourcesUrl || "https://shield-identity.com/resources",
          zohoEnabled: settings.zohoEnabled ?? true,
          scanMode: settings.scanMode || "authentic",
          quickQuestions: settings.quickQuestions,
          deepQuestions: settings.deepQuestions,
        };
      }
      return {
        calendlyUrl: "https://shield-identity.com/contact",
        resourcesUrl: "https://shield-identity.com/resources",
        zohoEnabled: true,
        scanMode: "authentic",
        quickQuestions: undefined,
        deepQuestions: undefined,
      };
    } catch (err) {
      console.error("Failed to load settings server-side, returning defaults:", err);
      return {
        calendlyUrl: "https://shield-identity.com/contact",
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

