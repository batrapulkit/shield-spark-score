export type QAnswer = "Yes" | "Sort of" | "No" | "Not sure";

export type ProfileSize =
  | "Just me (no staff)"
  | "2–9"
  | "10–49"
  | "50–99"
  | "100–249"
  | "250+";

export type ProfileIT =
  | "Me / the owner"
  | "Someone on our team"
  | "An outside IT company"
  | "No one, really";

export type ProfileSetup =
  | "Everything's in the cloud (Microsoft 365, Google…)"
  | "Cloud plus some office computers"
  | "We run our own server(s) on site"
  | "Files mostly live on individual computers"
  | "Not sure";

export type Industry =
  | "Healthcare / dental / clinic"
  | "Retail / e-commerce"
  | "Restaurant / hospitality"
  | "Professional services (legal, accounting, consulting)"
  | "Finance / insurance"
  | "Transport / logistics / trucking"
  | "Manufacturing / warehousing"
  | "Real estate / brokerage"
  | "Trades / construction"
  | "Nonprofit / community"
  | "Something else";

export interface Profile {
  size?: ProfileSize;
  it?: ProfileIT;
  setup?: ProfileSetup;
  industry?: Industry;
}

export type DecisionMaker =
  | "Yes, I decide"
  | "I share that decision"
  | "No, someone else does";

export interface Answers {
  // QUICK
  emailmfa?: QAnswer;
  edr?: QAnswer;
  backup?: QAnswer;
  train?: QAnswer;
  incident?: QAnswer;
  verify?: QAnswer;
  // DEEP
  industryData?: "Yes" | "No" | "Not sure";
  devices?: "1–5" | "6–10" | "11–25" | "26–50" | "51+" | "Not sure";
  emailtype?: "Own domain" | "A mix" | "Free" | "Not sure";
  assets?: QAnswer;
  patching?: QAnswer;
  pw?: "Manager" | "Sort of" | "No" | "Not sure";
  accessoff?: QAnswer;
  monitor?: QAnswer;
  aiuse?: "Yes regularly" | "Some" | "No" | "Not sure";
  airules?: QAnswer;
  incidenthistory?: "No" | "Not sure" | "Yes";
  remotework?: "No" | "Sometimes" | "Yes" | "Not sure";
  vmware?: QAnswer;
}

export interface ScanResult {
  domain: string;
  emails: string[];
  reachable: boolean;
  https: boolean;
  ssl: "valid" | "weak";
  spf: boolean;
  dkim: boolean;
  dmarc: boolean;
  dmarcPolicy: "missing" | "none" | "quarantine" | "reject";
  tlsBad: boolean;
  headers: boolean;
  headersFound: string[];
  headersMissing: string[];
  mx: string[];
  mailProvider: string | null;
  caa: boolean;
  dnssec: boolean;
  nameservers: string[];
  subdomains: string[];
  subdomainsChecked: boolean;
  exposedPaths: { path: string; detail: string }[];
  exposedPathsChecked: boolean;
  cookieIssues: string[];
  cookiesChecked: boolean;
  mixedContent: number;
  banner: string | null;
  ports: { port: number; name: string }[];
  portsChecked: boolean;
  breach: { count: number; breaches: string[]; checked: boolean };
  tech: string[];
}


export interface Lead {
  name: string;
  email: string;
  business: string;
  phone: string;
  role: string;
  decisionMaker: DecisionMaker;
  consent: boolean;
  sourceDomain?: string;
}

export type Phase = "hook" | "scan" | "profile" | "quick" | "gate" | "results";
