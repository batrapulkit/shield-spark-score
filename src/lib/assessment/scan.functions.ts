import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { scanDomain } from "./scan.server";

export const runScan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({ domain: z.string().min(3), emails: z.array(z.string()).default([]) })
      .parse(data),
  )
  .handler(async ({ data }) => scanDomain(data.domain, data.emails));
