import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import type { Answers, Lead, Phase, Profile, ScanResult } from "./types";
import { QUICK_QUESTIONS, DEEP_QUESTIONS, type QuestionDef } from "./data";

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
  resourcesUrl: string;
  quickQuestions: QuestionDef[];
  deepQuestions: QuestionDef[];
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
  setResourcesUrl: (v: string) => void;
  setQuickQuestions: (v: QuestionDef[]) => void;
  setDeepQuestions: (v: QuestionDef[]) => void;
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
  resourcesUrl: "https://shield-identity.com/resources",
  quickQuestions: QUICK_QUESTIONS,
  deepQuestions: DEEP_QUESTIONS,
};

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);

  // Load cached assessment state on mount (client-side only)
  useEffect(() => {
    const cached = localStorage.getItem("shield_assessment_state");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setState((s) => ({
          ...s,
          ...parsed,
        }));
      } catch (e) {
        console.warn("Failed to parse cached assessment state:", e);
      }
    }
  }, []);

  // Sync state to localStorage on changes
  useEffect(() => {
    if (state.website || state.email || state.phase !== "hook") {
      const stateToCache = {
        phase: state.phase,
        website: state.website,
        email: state.email,
        extraEmails: state.extraEmails,
        consent: state.consent,
        scan: state.scan,
        profile: state.profile,
        answers: state.answers,
        lead: state.lead,
        deepMode: state.deepMode,
      };
      localStorage.setItem("shield_assessment_state", JSON.stringify(stateToCache));
    }
  }, [
    state.phase,
    state.website,
    state.email,
    state.extraEmails,
    state.consent,
    state.scan,
    state.profile,
    state.answers,
    state.lead,
    state.deepMode,
  ]);

  // Fetch admin settings for dynamic config on mount
  useEffect(() => {
    import("./scan.functions")
      .then(({ getAdminSettings }) => {
        getAdminSettings()
          .then((settings) => {
            setState((s) => ({
              ...s,
              calendlyUrl: settings?.calendlyUrl || s.calendlyUrl,
              resourcesUrl: settings?.resourcesUrl || s.resourcesUrl,
              quickQuestions: settings?.quickQuestions || s.quickQuestions,
              deepQuestions: settings?.deepQuestions || s.deepQuestions,
            }));
          })
          .catch((err) => {
            console.warn("Could not load configured settings on mount, sticking with defaults:", err);
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
      setResourcesUrl: (v) => setState((s) => ({ ...s, resourcesUrl: v })),
      setQuickQuestions: (v) => setState((s) => ({ ...s, quickQuestions: v })),
      setDeepQuestions: (v) => setState((s) => ({ ...s, deepQuestions: v })),
      reset: () => {
        localStorage.removeItem("shield_assessment_state");
        setState(initial);
      },
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
