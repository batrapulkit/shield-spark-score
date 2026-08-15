export interface DiyStep {
  title: string;
  why: string;
  how: string;
  code?: string;
  codeLanguage?: string;
  codeTitle?: string;
}

export interface DiyGuide {
  id: string;
  title: string;
  category: string;
  timeLimit: string;
  difficulty: "Easy" | "Medium" | "Hard";
  iconName: string;
  summary: string;
  steps: DiyStep[];
}

export const DIY_GUIDES: Record<string, DiyGuide> = {
  "guide-mfa": {
    id: "guide-mfa",
    title: "Multi-Factor Authentication (MFA) Setup Guide",
    category: "Identity & Access Control",
    timeLimit: "30–45 mins",
    difficulty: "Medium",
    iconName: "ShieldCheck",
    summary: "Enforce Multi-Factor Authentication (MFA) across your team to block 99% of common account takeover attacks.",
    steps: [
      {
        title: "Choose Your Primary MFA Method",
        why: "Not all MFA methods are created equal. SMS-based codes can be intercepted via SIM-swaps. Authenticator apps are preferred, and hardware keys provide the highest security.",
        how: "Standardize on using an authenticator app (like Microsoft Authenticator, Google Authenticator, or Duo) or hardware factors (like YubiKeys). Disable weaker alternatives like email-based MFA fallbacks.",
      },
      {
        title: "Enforce MFA in Microsoft 365 (Entra ID)",
        why: "M365 accounts hold direct access to your emails, OneDrive documents, and sensitive settings. Securing these is critical.",
        how: "Log into the Entra Admin Center as a Global Admin. Navigate to Identity > Protection > Security Defaults. Toggle Security defaults to Enabled. This forces MFA registry for all users within 14 days.",
        code: `# Log in via Azure AD PowerShell to audit users without MFA
Connect-MgGraph -Scopes "User.Read.All","Directory.Read.All"
Get-MgUser -All | Select-Object DisplayName, UserPrincipalName, Id`,
        codeLanguage: "powershell",
        codeTitle: "Powershell MFA Audit Command",
      },
      {
        title: "Enforce MFA in Google Workspace",
        why: "Google Workspace holds critical communication data. Unenforced MFA is a direct entry point for scammers.",
        how: "Log into the Google Admin Console. Go to Menu > Security > Authentication > 2-Step Verification. Check 'Allow users to turn on 2-step verification' and set enforcement to 'On'. Select a start date and set the verification method to 'Any' or restrict to 'Authenticator app / security key' for tougher posture.",
      },
      {
        title: "Distribute User Enrollment Setup Logs",
        why: "Forcing users to register without a guide leads to lockout support tickets. Communication eases enrollment.",
        how: "Send a company-wide email prompting users to register their authenticator apps before enforcement becomes live. Provide backup recovery keys which must be printed or kept in a secure vault.",
        code: `Subject: Action Required: Enforcing 2-Step Verification for all Shield Accounts

Hi Team,

To protect company data and client details, we are enforcing Multi-Factor Authentication (MFA) on all Shield team accounts.

Please download the Google Authenticator or Microsoft Authenticator app on your mobile device today, go to your account security settings, and enable 2-Step Verification.

Enforcement will be active starting next Monday. You will be prompted to register on your next sign-in.

Regards,
IT Admin`,
        codeLanguage: "markdown",
        codeTitle: "Email Template for Employee Notification",
      },
    ],
  },
  "guide-backup": {
    id: "guide-backup",
    title: "3-2-1 Enterprise Backup Strategy Guide",
    category: "Business Resilience",
    timeLimit: "1–2 hours",
    difficulty: "Medium",
    iconName: "Archive",
    summary: "Set up the golden standard in data storage: 3 copies of your data, on 2 different media types, with 1 copy stored off-site and immutable.",
    steps: [
      {
        title: "Identify Critical Business Datastores",
        why: "You cannot back up what you do not know exists. Knowing your file locations ensures zero recovery gaps.",
        how: "Map all locations of business data. This includes local server drives, cloud files (Sharepoint / Google Drive), payroll platforms, and customer databases.",
      },
      {
        title: "Configure Primary Local Backups (2nd Copy)",
        why: "Having local copies ensures quick recovery if a user accidentally deletes a file or hard drives fail locally.",
        how: "Configure a Network-Attached Storage (NAS) device or external media arrays. Schedule automated daily full and incremental backups using scheduling software (e.g., Veeam, Acronis, or Macrium).",
        code: `# Script to locally sync primary files to a mounted backup drive
robocopy "C:\\CompanyData" "D:\\Backups\\LocalCopy" /MIR /FFT /R:3 /W:10 /LOG:"C:\\Logs\\BackupLog.txt"`,
        codeLanguage: "bash",
        codeTitle: "Windows Robocopy Backup Script",
      },
      {
        title: "Deploy Off-site & Secure Immutable Cloud Copies (3rd Copy)",
        why: "Ransomware attackers deliberately search out and delete backups linked directly to your local network. Immutable storage prevents deletion.",
        how: "Set up an off-site cloud storage bucket (AWS S3, Backblaze B2, or Azure Blob). Configure a Write-Once-Read-Many (WORM) Object Lock policy with a retention period of 30 days. Write backups to this bucket.",
      },
      {
        title: "Establish a Tested Recovery Runbook",
        why: "A backup is only as good as its restore rate. Periodic tests make sure recovery succeeds under pressure.",
        how: "Schedule a quarterly restoration drill where you retrieve a sample database or random folders from cloud backups and restore them to a sandbox environment. Document recovery time objectives (RTO).",
        code: `## QUARTERLY RESTORATION DRILL LOG
Date of Test: ___________________
Tester Name:  ___________________

1. Select random folder path: [/Data/Project_X]
2. Download copy from Immutable Cloud Storage.
3. Compare file hash or integrity against live site.
4. Record restoration time: _____ minutes.
5. Successful? [Yes / No]`,
        codeLanguage: "markdown",
        codeTitle: "Restore Verification Checklist",
      },
    ],
  },
  "guide-phish": {
    id: "guide-phish",
    title: "Employee Phishing Awareness Training Kit",
    category: "Human Risk",
    timeLimit: "30 mins",
    difficulty: "Easy",
    iconName: "Users",
    summary: "Establish a security awareness training cadence and verify-the-payment rules to stop social engineering attacks.",
    steps: [
      {
        title: "Launch Short Security Training Mandates",
        why: "Social engineering remains the number one way hackers bypass multi-million dollar defense codebases.",
        how: "Mandate one short, 5-10 minute security awareness module monthly (via platforms like Wizer, Huntress, or KnowBe4). Track completion rates across departments.",
      },
      {
        title: "Adopt the 'Verify-the-Request' Rule",
        why: "Scammers spoof executive identity, requesting urgent wire transfers or gift cards over email. Standard authentication blocks it.",
        how: "Implement a formal company policy: Any change in vendor bank details, or wire requests over $1,000, must be verbally verified by calling the requester on a pre-established, trusted phone number.",
        code: `### PAYMENT VERIFICATION RULE
Before sending cash or altering vendor credentials:
1. NEVER rely solely on email or SMS instructions.
2. Call the recipient using a phone number retrieved from CRM/contract papers (not the email signature).
3. Verbally confirm bank details, invoice numbers, and amounts.
4. Log verification approval in the finance spreadsheet.`,
        codeLanguage: "markdown",
        codeTitle: "Internal Wire Verification Policy",
      },
      {
        title: "Schedule Simulated Phishing Campaigns",
        why: "Simulations let staff practice identifying warning signs (mismatched domains, suspect links, false urgency) in a safe layout.",
        how: "Run quarterly simulated phishing emails mimicking Microsoft logins, HR updates, or invoice notices. Employees who fail must complete micro-training reminders.",
      },
    ],
  },
  "kit": {
    id: "kit",
    title: "Shield Cyber Starter Kit Template",
    category: "Asset Governance",
    timeLimit: "45 mins",
    difficulty: "Easy",
    iconName: "FolderKanban",
    summary: "Build a single source of truth documenting all devices, cloud software, and administrative privileges.",
    steps: [
      {
        title: "Inventory Corporate Devices & Hardware",
        why: "Unmanaged laptops or testing servers bypass patch deployment rules and represent hidden vulnerabilities.",
        how: "Record all company-owned desktops, laptops, tablets, and mobile phones. Maintain fields indicating device owner, serial number, OS version, and EDR presence.",
      },
      {
        title: "Map System Services & Cloud Software (SaaS)",
        why: "Shadow IT (employees entering secrets into unvetted tools) leaks data outside your security control parameters.",
        how: "Audit active accounts and subscriptions. Document cloud platforms in use (M365, Canva, GitHub, DocuSign) and confirm ownership matches the organization rather than personal emails.",
      },
      {
        title: "Implement Least Privilege Access Restraints",
        why: "Shared root credentials mean if one person is compromised, the attacker has access to everything.",
        how: "Review admin accounts for identity provider suites, domain registrars, and cloud setups. Limit admin rights to absolute essentials. Set up separate, dedicated admin accounts.",
        code: `### CORPORATE ASSET INVENTORY TEMPLATE
| Asset ID | Device Owner | Serial / Hostname | Operating System | EDR Enabled | Last Audited |
|----------|--------------|-------------------|------------------|-------------|--------------|
| SHLD-001 | Jane Doe     | LAPTOP-F98S12L    | Windows 11 Pro   | Yes         | 2026-08-10   |
| SHLD-002 | Accounts     | SERVER-SEC-Q14    | Ubuntu 22.04 LTS | Yes         | 2026-08-12   |`,
        codeLanguage: "markdown",
        codeTitle: "Asset Spreadsheet Model",
      },
    ],
  },
  "guide-pw": {
    id: "guide-pw",
    title: "Password Manager Deployment Plan",
    category: "Identity Protection",
    timeLimit: "1 hour",
    difficulty: "Easy",
    iconName: "KeyRound",
    summary: "Eliminate password reuse and weak employee authenticators, replacing them with a secure team locker.",
    steps: [
      {
        title: "Deploy a Business Password Manager",
        why: "Recycled credentials are the easiest way for attackers to target business applications using public database leaks.",
        how: "Procure a firm-wide instance of a password manager (e.g. 1Password, Bitwarden, or Dashlane). Provision team credentials via single sign-on (SSO) integration if available.",
      },
      {
        title: "Organize Granular Access Vaults",
        why: "Giving all staff access to all accounts increases exposure scope. Workspaces must partition credentials.",
        how: "Create isolated vaults for specific teams (e.g., Finance, Technical Ops, Admin). Grant permissions strictly based on department requirements.",
      },
      {
        title: "Mandate Strong Master Passwords and MFA protection",
        why: "The master password is the vault key. A weak vault key makes password managers pointless.",
        how: "Enforce master password policy criteria: Minimum 16 characters or a 4-word passphrase. Enforce mandatory MFA on the password manager account.",
        code: `Suggested Passphrase Generator Model:
Pick 4 unrelated, uncommon words:
"pencil-cactus-galaxy-fender"
Strong, memorable, custom, and highly secure.`,
        codeLanguage: "text",
        codeTitle: "Strong Master Password Example",
      },
    ],
  },
  "guide-ai": {
    id: "guide-ai",
    title: "Corporate AI Use & Data Protection Policy",
    category: "Data Protection",
    timeLimit: "30 mins",
    difficulty: "Easy",
    iconName: "Cpu",
    summary: "Define simple guidelines governing how employees use AI tools, preventing corporate data from leaking into public model training databases.",
    steps: [
      {
        title: "Establish List of Approved AI Tools",
        why: "Free public tools capture prompting text history to retrain public models. Controlled enterprise products offer data confidentiality agreements.",
        how: "Define which AI tools are approved (e.g. Copilot Enterprise, ChatGPT Team with history disabled). Ban unmanaged third-party tools.",
      },
      {
        title: "Draft Clear Classification Boundaries",
        why: "Unknowingly copying client data, source code, or financial records into public AI terminals breaks confidentiality mandates.",
        how: "Categorize prohibited parameters (No PII, Customer Files, Source Codes, API credentials, or Secret Roadmaps) and publish the document to the team.",
        code: `### AI DATA SHIELD RULES
1. NEVER upload personal identifiable information (PII) including name, email or phone lists.
2. NEVER copy company source code or private API keys directly into public chat screens.
3. NEVER submit client contracts, legal documents, or financial files.
4. DO verify outputs for hallucinations before committing code/copy to product files.`,
        codeLanguage: "markdown",
        codeTitle: "Classified Data Rules Template",
      },
      {
        title: "Disable Public Model Training Preferences",
        why: "Ensuring history and training toggles are disabled keeps entered questions secure.",
        how: "In settings for Google Gemini, OpenAI ChatGPT, or Claude, ensure administrators turn off history sharing and API model tuning preferences.",
      },
    ],
  },
  "guide-pentest": {
    id: "guide-pentest",
    title: "External Penetration Testing Scope Checklist",
    category: "Infrastructure Security",
    timeLimit: "30 mins",
    difficulty: "Hard",
    iconName: "Terminal",
    summary: "Establish audit procedures and scope documents for an independent third-party external penetration test, ensuring your Internet-facing barriers hold against active attacks.",
    steps: [
      {
        title: "Map Out Active Boundaries & IP Targets",
        why: "Clear boundaries avoid testing critical cloud vendors, third-party subdomains, or unapproved targets which could trigger legal/service complaints.",
        how: "Gather all IP ranges, public domain endpoints, APIs, and staging sites that belong directly to your organization. Confirm ownership via DNS logs.",
        code: `# Command to check IP references for your active domains
nslookup app.shieldidentity.ca`,
        codeLanguage: "bash",
        codeTitle: "DNS Lookup Command",
      },
      {
        title: "Establish penetration testing constraints",
        why: "Tests can trigger server overload or downtime if run during core operation shifts.",
        how: "Establish clear testing windows (e.g., off-peak weekend hours). Set limits on rate scaling and ban active Denial-of-Service (DoS) vectors.",
      },
      {
        title: "Screen and Vet Certification Credentials",
        why: "You are granting root testing access to system barriers. Vetting credentials prevents insider compromise.",
        how: "Confirm testing firms employ credentialed analysts (look for OSCP, CREST, GIAC, or CEH qualifications). Require mutual signing of Non-Disclosure Agreements (NDAs) before providing maps.",
      },
      {
        title: "Reconcile Results and Timelines",
        why: "A testing report is useless without a mapped fix pipeline. Fixing gaps secures endpoints.",
        how: "Review high and critical risks within 5 days of report handoff. Create remediation milestones: Critical findings fixed in 14 days, High risk findings in 30 days.",
      },
    ],
  },
  "guide-breached": {
    id: "guide-breached",
    title: "Leaked Account Password Reset Guide",
    category: "Identity & Credentials",
    timeLimit: "30 mins",
    difficulty: "Easy",
    iconName: "ShieldAlert",
    summary: "Respond immediately to exposed credential alerts, revoke active sessions, and secure leaked user identities.",
    steps: [
      {
        title: "Isolate the Breached Account & Reset Password",
        why: "Once credentials leak in public databases, bots automatically scan for open gateways to take over the account.",
        how: "Log into the affected account directly or via the administrator portal. Trigger an immediate password reset, enforcing a unique, 16+ character passphrase.",
      },
      {
        title: "Revoke Active Login Sessions",
        why: "Just changing the password does not kick out an attacker who has already logged in and holds active session cookies.",
        how: "Navigate to the account's security configuration page and click 'Sign out of all other locations' or 'Revoke active sessions'. In Entra ID, use the 'Revoke sessions' command on the user profile screen.",
      },
      {
        title: "Audit and Reset Reused Passwords",
        why: "Many employees use the same password across multiple services. A breach on one small site could compromise email or CRM.",
        how: "Search the team's password vault for similar or identical passwords. Force a reset on any linked applications.",
        code: `# CLI script to check active user policies (AWS CLI example)
aws iam list-user-policies --user-name BreachedUser`,
        codeLanguage: "bash",
        codeTitle: "Admin Access Check Script",
      },
    ],
  },
  "guide-incident": {
    id: "guide-incident",
    title: "Emergency Incident Response Plan Guide",
    category: "Business Resilience",
    timeLimit: "1 hour",
    difficulty: "Medium",
    iconName: "AlertTriangle",
    summary: "Establish a one-page incident response playbook to coordinate your team and isolate assets during a cyberattack.",
    steps: [
      {
        title: "Build your Crisis Contact List",
        why: "During a ransomware attack or database breach, panic leads to coordination breakdown. Having contacts documented saves hours.",
        how: "Create a paper/offline list of critical contacts: internal leadership, external IT support provider, legal counsel, insurance broker, and public relations.",
        code: `### CRISIS CONTACT DETAILS (Keep Offline)
- Internal Incident Lead: [Name] / [Phone]
- Managed IT Lead: [Name] / [Phone]
- Cyber Insurance Hotline: [Number]
- Legal Breach Partner: [Company] / [Phone]`,
        codeLanguage: "markdown",
        codeTitle: "Crisis Contacts Dashboard",
      },
      {
        title: "Establish Isolation Containment Rules",
        why: "Ransomware spreads laterally through active network paths. Rapid isolation blocks containment spread.",
        how: "Train staff on baseline emergency containment: if a computer displays ransom messages or runs abnormal scripts, disconnect network cables and turn off WiFi immediately (do not shut down power, as this destroys volatile forensic memory).",
      },
      {
        title: "Define Communication & Notification Thresholds",
        why: "Reporting breaches carelessly can violate privacy laws or damage public client trust.",
        how: "Establish rules for reporting: no employee should communicate details about a security breach externally without legal and executive authorization sign-off.",
      },
    ],
  },
  "guide-edr": {
    id: "guide-edr",
    title: "EDR Endpoint Shield Deployment Guide",
    category: "Endpoint Security",
    timeLimit: "45 mins",
    difficulty: "Medium",
    iconName: "Shield",
    summary: "Deploy Endpoint Detection and Response (EDR) agents to your fleet to detect and contain active host threats in real time.",
    steps: [
      {
        title: "Select Your EDR Solution",
        why: "Legacy antivirus relies on static signatures, missing custom zero-days and living-off-the-land attacks. EDR tracks behaviors.",
        how: "Acquire licensing details for a modern agent (Microsoft Defender for Business, SentinelOne, or CrowdStrike).",
      },
      {
        title: "Configure Agent Deployment Rules",
        why: "Deploying hosts manually wastes time. Automated installs ensure 100% coverage.",
        how: "Configure a centralized deployment payload using GPO (Group Policy), Intune, or terminal installation commands on macOS and Linux systems.",
        code: `# Linux EDR Agent Installation Script (example payload)
curl -o edr-agent.deb https://security.shield.ca/installers/agent.deb
sudo dpkg -i edr-agent.deb
sudo /opt/edr/bin/register --token A1B2-C3D4-E5F6`,
        codeLanguage: "bash",
        codeTitle: "Deployment CLI Command",
      },
      {
        title: "Enable Automatic Remediation & Isolation Controls",
        why: "Attacks occur outside working hours. Automated actions block threats while administrators sleep.",
        how: "In the console settings, enable 'Active Remediation' or 'Blocking Mode'. This permits the EDR agent to isolate infected hosts from the network automatically upon detecting ransomware behavior.",
      },
    ],
  },
  "guide-compliance": {
    id: "guide-compliance",
    title: "Compliance Framework Audit Prep Guide",
    category: "Compliance",
    timeLimit: "1 hour",
    difficulty: "Medium",
    iconName: "FileCheck",
    summary: "Organize controls documentation and prep evidence collection repositories to satisfy client and regulator reviews.",
    steps: [
      {
        title: "Select and Adopt a Baseline Standard",
        why: "Having different teams build controls randomly creates duplication. Standard frameworks unify policies.",
        how: "Align with SOC 2 (for cloud software companies), ISO 27001 (global security management), or CIS Controls (practical baseline defense).",
      },
      {
        title: "Set Up Your Control Evidence Folders",
        why: "Auditors require proof that policies are enforced. Collecting these on the fly is stressful.",
        how: "Create structured document repositories covering: onboarding/offboarding lists, logs of user access reviews, backup verification charts, and quarterly vulnerability scans.",
        code: `### EVIDENCE REPOSITORY SCHEME
├── [Category] Security Policies
│   ├── AI_Use_Policy.pdf
│   └── Team_MFA_Enforcement.pdf
├── [Category] Technical Logs
│   ├── Backup_Restore_Verification_Q3.pdf
│   └── Yearly_Penetration_Test_Report.pdf`,
        codeLanguage: "text",
        codeTitle: "SaaS Audit Folder Layout",
      },
      {
        title: "Run a Preliminary Gap Audit",
        why: "Finding control holes during an active audit leads to failure. Self-audits preempt flags.",
        how: "Walk through control items with team leads. Mark items as 'Met', 'Partial', or 'Not Met' and create remediation timelines for gaps prior to auditor onboarding.",
      },
    ],
  },
  "guide-soc": {
    id: "guide-soc",
    title: "MDR/SOC Telemetry Integration Guide",
    category: "Detection & Response",
    timeLimit: "45 mins",
    difficulty: "Hard",
    iconName: "Eye",
    summary: "Integrate core system logs into a Security Operations Center (SOC) to monitor threat telemetry around the clock.",
    steps: [
      {
        title: "Define Telemetry Sources",
        why: "A SOC cannot analyze threat telemetry it does not receive. Identifying indicators ensures complete visibility.",
        how: "List core applications: Identity provider logs (Microsoft Entra / Google Workspace), cloud databases, perimeter firewalls, and EDR host consoles.",
      },
      {
        title: "Deploy API Connection Connectors",
        why: "Manual log imports delay analysis. Stream API outputs to feed telemetry engines.",
        how: "In the settings of your identity provider, set up diagnostic logging and redirect the data feed to public SOC endpoints using SEC/API connection strings.",
        code: `# Sample JSON structure of identity syslog webhook feed
{
  "timestamp": "2026-08-15T22:36:00Z",
  "actor": "admin@shieldidentity.ca",
  "activity": "MFA_Registry_Change",
  "status": "Success",
  "source_ip": "198.51.100.12"
}`,
        codeLanguage: "json",
        codeTitle: "Syslog Telemetry Metadata",
      },
      {
        title: "Test Alerts Escalation Pipelines",
        why: "Unknown alerts get ignored. Establishing designated response channels ensures issues get resolved.",
        how: "Run a safe alert simulation (e.g. log in from a foreign VPN endpoint). Verify the SOC tickets are received, notifications are triggered, and escalation procedures function correctly.",
      },
    ],
  },
  "guide-msp": {
    id: "guide-msp",
    title: "Managed IT Support Baseline Rules Guide",
    category: "Operations",
    timeLimit: "45 mins",
    difficulty: "Easy",
    iconName: "Briefcase",
    summary: "Oversee managed IT support providers (MSPs) to guarantee they align with your baseline security posture rules.",
    steps: [
      {
        title: "Establish SLA & Service Boundaries",
        why: "Unclear support scopes lead to unpatched servers or backup verification oversight.",
        how: "Draft a Service Level Agreement (SLA) with the MSP explicitly specifying patch deployment frequency, response limits, and backup monitoring ownership.",
      },
      {
        title: "Restrict Administrative Credentials",
        why: "MSPs with unchecked access present key organizational risks if their own systems get breached.",
        how: "Do not grant MSP workers shared admin access. Require separate, named credentials for each external technician. Log all administrative logins.",
        code: `### MSP AUDIT QUESTIONS
1. Do MSP engineers use individual personal logins to manage our directories? [Yes / No]
2. Is MFA required for the MSP portal tools? [Yes / No]
3. What is the patch completion SLA timeline? [Days: _____]`,
        codeLanguage: "markdown",
        codeTitle: "Service Vendor Checklist",
      },
      {
        title: "Enforce Multi-Factor Access",
        why: "MSPs leverage remote access tools (RMM). Unprotected tools allow attackers to push malware globally.",
        how: "Enforce multi-factor authentication (MFA) on all tools that connect to your business computers. Confirm compliance audits quarterly.",
      },
    ],
  },
  "guide-insurance": {
    id: "guide-insurance",
    title: "Cyber Insurance Readiness Checklist",
    category: "Risk Transfer",
    timeLimit: "30 mins",
    difficulty: "Easy",
    iconName: "BadgeCheck",
    summary: "Prepare your organization's security posture parameters to satisfy cyber insurance underwriting requirements.",
    steps: [
      {
        title: "Validate the Five CORE Requirements",
        why: "Insurers routinely deny coverage or double premiums if basic cyber hygiene controls are missing.",
        how: "Confirm the following: 100% MFA deployment, isolated backups, antivirus/EDR, phishing training history, and a written incident response plan.",
      },
      {
        title: "Prepare Posture Documentation Logs",
        why: "Attesting false details on an application form allows insurers to void policies during a claim payout.",
        how: "Gather configuration logs showing MFA enforcement, backup success indicators, and patch management policies to serve as verification materials.",
        code: `### SECURITY ATTESTATION RECORD
- MFA Active? [Yes / No]
- Off-site backups active? [Yes / No]
- Staff security training run? [Yes / No]
- EDR installed on all hosts? [Yes / No]`,
        codeLanguage: "markdown",
        codeTitle: "Ready check parameters sheet",
      },
      {
        title: "Coordinate Insurable Limits Selection",
        why: "Underinsured organizations collapse under ransomware restoration costs.",
        how: "Analyze potential downtime costs, forensic auditing fees, and restoration expenses. Align with brokers to select appropriate limits.",
      },
    ],
  },
  "guide-incident-history": {
    id: "guide-incident-history",
    title: "Post-Breach Hardening Checklist",
    category: "Business Resilience",
    timeLimit: "1 hour",
    difficulty: "Hard",
    iconName: "RefreshCw",
    summary: "Review entry footprints, close vulnerability gaps, and re-establish baseline network trust after a security incident.",
    steps: [
      {
        title: "Isolate Systems and Analyze Ingress Points",
        why: "Attackers leave backdoor connections. Vetting ingress paths prevents reinfection.",
        how: "Audit firewall connections, public ingress ports, and system event logs to trace how the threat actor entered. Close all unused access routes.",
      },
      {
        title: "Run Full Credentials Cycle",
        why: "Threat actors harvest local database passwords to maintain connection persistency.",
        how: "Enforce security credential changes: reset global administrative passwords, change API authorization tokens, cycle databases keys, and alter domain registrar controls.",
        code: `# Powershell to find and review newly created admin logins
Get-LocalGroupMember -Group "Administrators" | Select-Object Name, PrincipalSource`,
        codeLanguage: "powershell",
        codeTitle: "Admin Membership Audit Command",
      },
      {
        title: "Verify File Integrity Restore Metrics",
        why: "Ransomware files left inactive can execute again under trigger schedules.",
        how: "Scan restored directories using updated EDR tools. Confirm all endpoints are verified and running signature-clean systems before reconnecting hosts to the network.",
      },
    ],
  },
  "guide-remote": {
    id: "guide-remote",
    title: "Secure Remote Work & BYOD Checklist",
    category: "Endpoint Security",
    timeLimit: "45 mins",
    difficulty: "Medium",
    iconName: "Laptop",
    summary: "Enforce security standards on remote employee endpoints and personal devices connecting to company databases.",
    steps: [
      {
        title: "Implement Device Registry & MDM Control",
        why: "Personal machines connecting without monitoring expose SaaS applications to malware files.",
        how: "Enforce Mobile Device Management enrollment (e.g. Microsoft Intune, Jamf) for all remote computers. Block access for unmanaged systems.",
      },
      {
        title: "Mandate Local Device Security Standards",
        why: "Weak local setups allow data leaks if remote devices are lost or shared with household members.",
        how: "Require: 1) Full disk encryption (BitLocker or FileVault) activated on all systems, 2) Automatic lockout after 5 minutes of inactivity, 3) Anti-malware software active.",
      },
      {
        title: "Configure Closed Tunnel Access (VPN)",
        why: "Connecting over public unprotected WiFi lets third parties intercept corporate communications.",
        how: "Configure secure VPN or Zero Trust Network Access (ZTNA) gateways. Require MFA verification for tunnel entry.",
        code: `# System CLI to confirm file encryption status (macOS example)
fdesetup status`,
        codeLanguage: "bash",
        codeTitle: "FileVault Encryption Verification",
      },
    ],
  },
};
