import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useAssessment } from "@/lib/assessment/store";
import { HookPhase } from "@/components/phases/HookPhase";
import { ScanPhase } from "@/components/phases/ScanPhase";
import { ProfilePhase } from "@/components/phases/ProfilePhase";
import { QuestionsPhase } from "@/components/phases/QuestionsPhase";
import { GatePhase } from "@/components/phases/GatePhase";
import { ResultsPhase } from "@/components/phases/ResultsPhase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shield Score - Secure Brampton Edition | Shield Identity" },
      {
        name: "description",
        content:
          "Discover your business cyber risk in under 3 minutes. Get an instant Shield Score based on your website, email security, and cybersecurity practices.",
      },
      {
        property: "og:title",
        content: "Shield Score - Secure Brampton Edition | Shield Identity",
      },
      {
        property: "og:description",
        content:
          "Discover your business cyber risk in under 3 minutes. Get an instant Shield Score based on your website, email security, and cybersecurity practices.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/logo.png" },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  return <Flow />;
}

function Flow() {
  const s = useAssessment();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={s.phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {s.phase === "hook" && <HookPhase />}
        {s.phase === "scan" && <ScanPhase />}
        {s.phase === "profile" && <ProfilePhase />}
        {s.phase === "quick" && (
          <QuestionsPhase mode="quick" onDone={() => s.setPhase("gate")} />
        )}
        {s.phase === "gate" && <GatePhase />}
        {s.phase === "results" && <ResultsPhase />}
      </motion.div>
    </AnimatePresence>
  );
}
