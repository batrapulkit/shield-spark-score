import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import type { Answers, Lead, Profile, ScanResult } from "./types";
import { computeScore } from "./engine";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isValidUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function initSupabaseClient(url: string | undefined, key: string | undefined, options?: any) {
  if (!isValidUrl(url) || !key) return null;
  try {
    return createClient(url!, key, options);
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

export const supabase = initSupabaseClient(supabaseUrl, supabaseAnonKey);

// Admin client that uses the service role key to bypass RLS policies if configured
const adminKeyToUse = supabaseServiceRoleKey || supabaseAnonKey;
export const supabaseAdminClient = initSupabaseClient(supabaseUrl, adminKeyToUse, {
  auth: { persistSession: false }
});

// LOCAL FILE FALLBACK DB CACHE (Avoids RLS blocks and database configuration blockers in dev/demos)
const LOCAL_DB_PATH = process.env.VERCEL
  ? path.join("/tmp", "local_db.json")
  : path.join(process.cwd(), "tmp", "local_db.json");

function ensureLocalDb() {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({ submissions: [], settings: null }, null, 2));
  }
}

function readLocalDb() {
  ensureLocalDb();
  try {
    return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf-8"));
  } catch (err) {
    console.error("Failed to read local fallback DB:", err);
    return { submissions: [], settings: null };
  }
}

function writeLocalDb(data: any) {
  ensureLocalDb();
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write to local fallback DB:", err);
  }
}

export async function saveSubmissionToDb(
  lead: Lead,
  profile: Profile,
  answers: Answers,
  scan: ScanResult | null,
  customQuick?: any[],
  customDeep?: any[]
) {
  const scoreResult = computeScore(profile, answers, scan, customQuick, customDeep);
  const newRecord = {
    name: lead.name,
    email: lead.email,
    business: lead.business || null,
    phone: lead.phone || null,
    role: lead.role || null,
    decision_maker: lead.decisionMaker,
    consent: lead.consent,
    score: scoreResult.final,
    scan_result: scan,
    answers: { ...answers, _metadata_source_domain: lead.sourceDomain || "unknown" },
    profile: profile,
    created_at: new Date().toISOString()
  };

  const clientToUse = supabaseAdminClient || supabase;
  
  if (clientToUse) {
    try {
      console.log(`Saving submission in Supabase for ${lead.email}...`);
      const { data, error } = await clientToUse
        .from("submissions")
        .insert(newRecord)
        .select();

      if (error) {
        throw error;
      }
      
      console.log("Successfully saved submission to Supabase.");
      return data;
    } catch (err) {
      console.warn("Supabase insertion failed. Falling back to local file database. Error:", err);
    }
  } else {
    console.warn("Supabase client not initialized. Falling back to local file database.");
  }

  // Save to local JSON DB fallback
  const db = readLocalDb();
  // Avoid duplicate emails in local db
  db.submissions = db.submissions.filter((s: any) => s.email !== lead.email);
  db.submissions.unshift(newRecord);
  writeLocalDb(db);
  console.log("Successfully saved submission to local fallback database file.");
  return [newRecord];
}

export async function getSubmissions() {
  let remoteSubmissions: any[] = [];
  
  if (supabaseAdminClient) {
    try {
      const { data, error } = await supabaseAdminClient
        .from("submissions")
        .select("*")
        .neq("email", "_settings@shield-identity.local")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      if (data) remoteSubmissions = data;
    } catch (err: any) {
      console.warn("Could not fetch submissions from Supabase remote DB, returning cached data. Reason:", err.message || err);
    }
  }

  const db = readLocalDb();
  // Filter out any duplicates and merge, giving remote priority
  const merged = [...remoteSubmissions];
  const remoteEmails = new Set(remoteSubmissions.map((s) => s.email));
  
  for (const localSub of db.submissions) {
    if (!remoteEmails.has(localSub.email)) {
      merged.push(localSub);
    }
  }

  // Sort by created date descending
  return merged.sort((a, b) => 
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
}

export async function deleteSubmission(email: string) {
  // Delete from local cache
  const db = readLocalDb();
  db.submissions = db.submissions.filter((s: any) => s.email !== email);
  writeLocalDb(db);
  console.log(`Deleted submission for ${email} from local database.`);

  // Delete from remote Supabase if client is accessible
  if (supabaseAdminClient) {
    try {
      const { error } = await supabaseAdminClient
        .from("submissions")
        .delete()
        .eq("email", email);

      if (error) throw error;
      console.log(`Deleted remote submission for ${email} in Supabase.`);
    } catch (err) {
      console.warn("Could not delete from remote Supabase table:", err);
    }
  }

  return { success: true };
}

export async function getGlobalSettings() {
  if (supabaseAdminClient) {
    try {
      const { data, error } = await supabaseAdminClient
        .from("submissions")
        .select("answers")
        .eq("email", "_settings@shield-identity.local")
        .maybeSingle();

      if (error) throw error;
      if (data?.answers) {
        return data.answers;
      }
    } catch (err: any) {
      console.log("Could not load global settings from Supabase, loading from local cache. Reason:", err.message || err);
    }
  }

  const db = readLocalDb();
  return db.settings;
}

export async function saveGlobalSettings(settings: any) {
  // Save locally
  const db = readLocalDb();
  db.settings = settings;
  writeLocalDb(db);
  console.log("Global settings saved to local database file.");

  if (supabaseAdminClient) {
    try {
      // Check if global settings row exists
      const { data: existing, error: checkError } = await supabaseAdminClient
        .from("submissions")
        .select("email")
        .eq("email", "_settings@shield-identity.local")
        .maybeSingle();

      if (checkError) throw checkError;

      const payload = {
        email: "_settings@shield-identity.local",
        name: "Global Settings",
        business: "Shield Score System",
        phone: "0000000000",
        role: "System Admin",
        decision_maker: "Yes, I decide",
        consent: true,
        score: 100,
        answers: settings,
        profile: {},
        scan_result: {}
      };

      let query;
      if (existing) {
        query = supabaseAdminClient
          .from("submissions")
          .update(payload)
          .eq("email", "_settings@shield-identity.local");
      } else {
        query = supabaseAdminClient
          .from("submissions")
          .insert(payload);
      }

      const { data, error } = await query.select();
      if (error) throw error;

      console.log("Successfully saved settings to remote Supabase DB.");
      return data;
    } catch (err: any) {
      console.warn("Could not save settings to remote Supabase DB. Saved locally instead. Reason:", err.message || err);
    }
  }

  return [settings];
}
