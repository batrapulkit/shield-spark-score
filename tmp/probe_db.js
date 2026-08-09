import fs from 'fs';
import path from 'path';

// Minimal .env parser
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
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
    env[key] = value.trim();
  }
});

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

async function run() {
  const logs = [];
  const log = (...msg) => {
    console.log(...msg);
    logs.push(msg.map(m => typeof m === 'object' ? JSON.stringify(m, null, 2) : String(m)).join(' '));
  };

  log("Supabase URL:", env.SUPABASE_URL);
  
  log("Inserting a standard lead record...");
  const lead = {
    name: "John Doe",
    email: "john.doe@test.com",
    business: "test.com",
    phone: "1234567890",
    role: "Manager",
    decision_maker: "Yes, I decide",
    consent: true,
    score: 85,
    scan_result: {},
    answers: {},
    profile: {}
  };
  
  const { data: insData, error: insError } = await supabase
    .from('submissions')
    .insert(lead)
    .select();
    
  if (insError) {
    log("Insert Error:", insError);
  } else {
    log("Insert Success! Row data:", insData);
  }

  fs.writeFileSync('tmp/probe_output_node.txt', logs.join('\n'), 'utf-8');
}

run().catch(err => {
  fs.writeFileSync('tmp/probe_output_node.error.txt', String(err), 'utf-8');
  console.error(err);
});
