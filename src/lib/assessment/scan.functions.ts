import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { scanDomain, fetchEmailBreaches } from "./scan.server";

export const runScan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({ domain: z.string().min(3), emails: z.array(z.string()).default([]) })
      .parse(data),
  )
  .handler(async ({ data }) => scanDomain(data.domain, data.emails));

export const runBreachCheck = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
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
import { saveSubmissionToDb } from "./supabase.server";

export const submitToCrm = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        lead: z.any(),
        profile: z.any(),
        answers: z.any(),
        scan: z.any().nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    let dbSuccess = false;
    let crmSuccess = false;
    let dbResult = null;
    let crmResult = null;

    try {
      dbResult = await saveSubmissionToDb(data.lead, data.profile, data.answers, data.scan);
      dbSuccess = true;
    } catch (dbError) {
      console.error("Failed to save submission to Supabase:", dbError);
    }

    try {
      crmResult = await createZohoLead(data.lead, data.profile, data.answers, data.scan);
      crmSuccess = true;
    } catch (crmError) {
      console.error("Failed to sync lead to Zoho CRM:", crmError);
    }

    return {
      db: { success: dbSuccess, data: dbResult },
      crm: { success: crmSuccess, data: crmResult },
    };
  });
