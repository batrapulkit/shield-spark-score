import type { Industry, ProfileIT, ProfileSetup, ProfileSize } from "./types";

export const SIZE_OPTIONS: ProfileSize[] = [
  "Just me (no staff)",
  "2–9",
  "10–49",
  "50–99",
  "100–249",
  "250+",
];

export const IT_OPTIONS: ProfileIT[] = [
  "Me / the owner",
  "Someone on our team",
  "An outside IT company",
  "No one, really",
];

export const SETUP_OPTIONS: ProfileSetup[] = [
  "Everything's in the cloud (Microsoft 365, Google…)",
  "Cloud plus some office computers",
  "We run our own server(s) on site",
  "Files mostly live on individual computers",
  "Not sure",
];

export const INDUSTRY_OPTIONS: Industry[] = [
  "Healthcare / dental / clinic",
  "Retail / e-commerce",
  "Restaurant / hospitality",
  "Professional services (legal, accounting, consulting)",
  "Finance / insurance",
  "Transport / logistics / trucking",
  "Manufacturing / warehousing",
  "Real estate / brokerage",
  "Trades / construction",
  "Nonprofit / community",
  "Something else",
];

/** Industries with a framework / sensitive-data extra question. */
export const INDUSTRY_META: Record<
  string,
  { framework: string; industryQuestion: string; industryExplainer: string }
> = {
  "Healthcare / dental / clinic": {
    framework: "HIPAA / PIPEDA (health data)",
    industryQuestion:
      "Do you store patient or client health information electronically (EHR/EMR)?",
    industryExplainer:
      "Health information is regulated. Storing it electronically raises the bar for security controls, access logging, and breach notification.",
  },
  "Retail / e-commerce": {
    framework: "PCI-DSS (card payments)",
    industryQuestion:
      "Are you taking credit or debit card payments through a website, terminal, or app?",
    industryExplainer:
      "Card acceptance triggers PCI-DSS obligations. This shapes what network segmentation and monitoring you need.",
  },
  "Professional services (legal, accounting, consulting)": {
    framework: "PIPEDA / confidentiality obligations",
    industryQuestion:
      "Do you handle confidential client documents, legal files, or financial records?",
    industryExplainer:
      "Client-confidential data creates duties of care that map to specific security controls and incident response steps.",
  },
  "Finance / insurance": {
    framework: "PCI-DSS / GLBA (financial data)",
    industryQuestion: "Do you process or store client financial information?",
    industryExplainer:
      "Financial services regulators expect documented controls, monitoring, and third-party risk oversight.",
  },
  "Real estate / brokerage": {
    framework: "FINTRAC / wire-fraud controls",
    industryQuestion:
      "Do you handle wire transfers, deposits, or client financial information?",
    industryExplainer:
      "Real-estate wire-fraud is one of the top attack patterns. Verification steps and monitoring matter.",
  },
};

export interface QuestionDef {
  id: keyof import("./types").Answers;
  phase: "QUICK" | "DEEP";
  question: string;
  explainer: string;
  options: { label: string; value: number | null }[]; // null = not scored
  weight: number;
}

export const QUICK_QUESTIONS: QuestionDef[] = [
  {
    id: "emailmfa",
    phase: "QUICK",
    question:
      "When signing in to work accounts, does everyone have to confirm the login using their phone or an authentication app?",
    explainer:
      "Multi-Factor Authentication (MFA) adds an extra layer of security. Even if a password is stolen, attackers usually can't access the account without the second verification step.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 2,
  },
  {
    id: "edr",
    phase: "QUICK",
    question:
      "Is every work computer protected with antivirus or security software that stays up to date?",
    explainer:
      "Security software helps detect and block viruses, ransomware, and other threats. It only works well if it's installed and updated on every business device.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 2,
  },
  {
    id: "backup",
    phase: "QUICK",
    question:
      "Are your important business files backed up regularly, stored separately, and tested to make sure they can be restored?",
    explainer:
      "Backups help you recover important files after ransomware, hardware failure, or accidental deletion. A backup is only useful if it can actually be restored when needed.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 2,
  },
  {
    id: "train",
    phase: "QUICK",
    question:
      "Do your employees receive regular training on how to spot phishing emails and online scams?",
    explainer:
      "Most cyberattacks begin with a convincing email or message. Regular training helps employees recognize scams before they become costly incidents.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 2,
  },
  {
    id: "incident",
    phase: "QUICK",
    question:
      "If your business was hacked tomorrow, would your team know exactly what to do first?",
    explainer:
      "Having a simple response plan helps reduce downtime and damage. Knowing who to contact and what actions to take can make a major difference during an attack.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 2,
  },
  {
    id: "verify",
    phase: "QUICK",
    question:
      "If a supplier asked to change their bank details, would your team always verify it by phone before making a payment?",
    explainer:
      "Criminals often impersonate suppliers and request payment changes. Verifying requests using a trusted phone number helps prevent invoice and payment fraud.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 2,
  },
];

export const DEEP_QUESTIONS: QuestionDef[] = [
  {
    id: "devices",
    phase: "DEEP",
    question:
      "Approximately how many computers, laptops, and servers are used for your business?",
    explainer:
      "The number of devices helps estimate the size of your technology environment and the level of protection your business may need.",
    options: [
      { label: "1–5", value: null },
      { label: "6–10", value: null },
      { label: "11–25", value: null },
      { label: "26–50", value: null },
      { label: "51+", value: null },
      { label: "Not sure", value: null },
    ],
    weight: 0,
  },
  {
    id: "emailtype",
    phase: "DEEP",
    question:
      "Does your business use its own email address (such as you@yourcompany.com), or free email services like Gmail or Outlook?",
    explainer:
      "Business email domains provide greater control over security, branding, and email protection than personal email accounts.",
    options: [
      { label: "Own domain", value: 1 },
      { label: "A mix", value: 0.5 },
      { label: "Free", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 1,
  },
  {
    id: "assets",
    phase: "DEEP",
    question:
      "Do you keep a list of the computers, software, and online services your business uses?",
    explainer:
      "You can't protect what you don't know exists. Keeping an inventory makes it easier to manage updates, security, and support.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 1,
  },
  {
    id: "patching",
    phase: "DEEP",
    question:
      "Are software updates installed regularly on all business computers and applications?",
    explainer:
      "Many cyberattacks exploit known software flaws that have already been fixed. Regular updates help close these security gaps.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 1,
  },
  {
    id: "pw",
    phase: "DEEP",
    question: "Does everyone use a different, strong password for each work account?",
    explainer:
      "Reusing passwords means one stolen password can unlock multiple accounts. Unique passwords greatly reduce this risk.",
    options: [
      { label: "Manager", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 1,
  },
  {
    id: "accessoff",
    phase: "DEEP",
    question:
      "When an employee leaves, are all of their work accounts disabled right away?",
    explainer:
      "Former employees should no longer have access to business systems. Removing accounts promptly helps prevent unauthorized access.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 1,
  },
  {
    id: "monitor",
    phase: "DEEP",
    question:
      "Would you know if someone logged into your business accounts from another country or unusual location?",
    explainer:
      "Early detection helps stop attacks before they cause serious damage. Alerts can identify unusual logins or suspicious activity quickly.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 1,
  },
  {
    id: "aiuse",
    phase: "DEEP",
    question:
      "Does your team use AI tools like ChatGPT, Microsoft Copilot, or Gemini for work?",
    explainer:
      "This helps us understand how AI is being used in your business and identify any related security considerations.",
    options: [
      { label: "Yes regularly", value: 0 },
      { label: "Some", value: 0 },
      { label: "No", value: 1 },
      { label: "Not sure", value: 0 },
    ],
    weight: 0,
  },
  {
    id: "airules",
    phase: "DEEP",
    question:
      "Does your team know what business information should never be shared with AI tools like ChatGPT or Copilot?",
    explainer:
      "Employees should know what information is safe to share with AI tools. Clear guidelines help prevent confidential data from being exposed.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 1,
  },
  {
    id: "incidenthistory",
    phase: "DEEP",
    question:
      "Has your business experienced a cyberattack or data breach in the last two years?",
    explainer:
      "Previous incidents can highlight areas that may still need improvement. Understanding past events helps us provide more relevant recommendations.",
    options: [
      { label: "No", value: 1 },
      { label: "Not sure", value: 0.5 },
      { label: "Yes", value: 0 },
    ],
    weight: 2,
  },
  {
    id: "remotework",
    phase: "DEEP",
    question:
      "Do employees work from home or use personal devices for work?",
    explainer:
      "Remote work and personal devices can increase security risks if they aren't properly managed.",
    options: [
      { label: "No", value: 1 },
      { label: "Sometimes", value: 0.5 },
      { label: "Yes", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 1,
  },
  {
    id: "vmware",
    phase: "DEEP",
    question: "Do you use VMware in your business?",
    explainer:
      "VMware and related virtualization systems are critical infrastructure. Unpatched virtualization servers are a primary target for ransomware deployment.",
    options: [
      { label: "Yes", value: 1 },
      { label: "Sort of", value: 0.5 },
      { label: "No", value: 0 },
      { label: "Not sure", value: 0 },
    ],
    weight: 0,
  },
];
