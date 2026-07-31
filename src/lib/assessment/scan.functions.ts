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
