import { createClient } from "@supabase/supabase-js";
import type { Answers, Lead, Profile, ScanResult } from "./types";
import { computeScore } from "./engine";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function saveSubmissionToDb(
  lead: Lead,
  profile: Profile,
  answers: Answers,
  scan: ScanResult | null,
) {
  if (!supabase) {
    console.warn("Supabase client is not initialized because variables are missing in configuration.");
    return null;
  }

  const scoreResult = computeScore(profile, answers, scan);

  console.log(`Saving submission in Supabase for ${lead.email}...`);

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      name: lead.name,
      email: lead.email,
      business: lead.business || null,
      phone: lead.phone || null,
      role: lead.role || null,
      decision_maker: lead.decisionMaker,
      consent: lead.consent,
      score: scoreResult.final,
      scan_result: scan,
      answers: answers,
      profile: profile,
    })
    .select();

  if (error) {
    console.error("Error inserting submission to Supabase:", error);
    throw error;
  }

  console.log("Successfully saved submission to Supabase.");
  return data;
}
