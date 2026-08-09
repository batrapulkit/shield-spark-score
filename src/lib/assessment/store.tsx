import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import type { Answers, Lead, Phase, Profile, ScanResult } from "./types";

interface State {
  phase: Phase;
  website: string;
  email: string;
  extraEmails: string[];
  consent: boolean;
  scan: ScanResult | null;
  profile: Profile;
  answers: Answers;
  lead: Lead | null;
  deepMode: boolean;
  calendlyUrl: string;
}

interface Ctx extends State {
  setPhase: (p: Phase) => void;
  setWebsite: (v: string) => void;
  setEmail: (v: string) => void;
  setExtraEmails: (v: string[]) => void;
  setConsent: (v: boolean) => void;
  setScan: (s: ScanResult) => void;
  setProfile: (p: Partial<Profile>) => void;
  setAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
  setLead: (l: Lead) => void;
  setDeepMode: (v: boolean) => void;
  setCalendlyUrl: (v: string) => void;
  reset: () => void;
}

const AssessmentContext = createContext<Ctx | null>(null);

const initial: State = {
  phase: "hook",
  website: "",
  email: "",
  extraEmails: [],
  consent: false,
  scan: null,
  profile: {},
  answers: {},
  lead: null,
  deepMode: false,
  calendlyUrl: "https://calendly.com/shieldidentity-ca/consultation",
};

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);

  // Fetch admin settings for Calendly booking link on mount
  useEffect(() => {
    import("./scan.functions")
      .then(({ getAdminSettings }) => {
        getAdminSettings()
          .then((settings) => {
            if (settings?.calendlyUrl) {
              setState((s) => ({ ...s, calendlyUrl: settings.calendlyUrl }));
            }
          })
          .catch((err) => {
            console.warn("Could not load configured Calendly URL on mount, sticking with default:", err);
          });
      })
      .catch((err) => {
        console.warn("Could not resolve scan functions dynamically on mount:", err);
      });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      setPhase: (p) => setState((s) => ({ ...s, phase: p })),
      setWebsite: (v) => setState((s) => ({ ...s, website: v })),
      setEmail: (v) => setState((s) => ({ ...s, email: v })),
      setExtraEmails: (v) => setState((s) => ({ ...s, extraEmails: v })),
      setConsent: (v) => setState((s) => ({ ...s, consent: v })),
      setScan: (scan) => setState((s) => ({ ...s, scan })),
      setProfile: (p) => setState((s) => ({ ...s, profile: { ...s.profile, ...p } })),
      setAnswer: (key, value) =>
        setState((s) => ({ ...s, answers: { ...s.answers, [key]: value } })),
      setLead: (l) => setState((s) => ({ ...s, lead: l })),
      setDeepMode: (v) => setState((s) => ({ ...s, deepMode: v })),
      setCalendlyUrl: (v) => setState((s) => ({ ...s, calendlyUrl: v })),
      reset: () => setState(initial),
    }),
    [state],
  );

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within AssessmentProvider");
  return ctx;
}
