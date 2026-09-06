import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PhaseShell } from "@/components/shield/PhaseShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

const faqs = [
  {
    q: "Is it really free?",
    a: "Yes. Everything in the first tier — the assessment, the network assessment if you're eligible, both meetings, the roadmap, the live sessions and the standby retainer — has no cost and no obligation.",
  },
  {
    q: "Do I have to be a Board of Trade member?",
    a: "No, the Secure Brampton initiative is open to any business. However, Board of Trade members receive preferred terms and pricing on any 'Done for you' implementation services if you choose to use them later.",
  },
  {
    q: "Do I have to be in Brampton?",
    a: "No. Manufacturers, clinics, logistics firms, trades, shops, non‑profits anywhere can benefit. Whether you're in Mississauga, Caledon, Vaughan or further out: you get the same assessment and the same roadmap.",
  },
  {
    q: "What does the $0 retainer actually cost?",
    a: "Nothing. There is no monthly fee and no minimum spending requirement. You only pay if you ever need to activate our incident response team during an actual cyber breach.",
  },
  {
    q: "Why do you ask every business to sign the retainer?",
    a: "An incident response plan is a standard requirement for cyber insurance, SOC 2, PCI DSS and CPCSC. Finding a team to help during an ongoing attack is extremely expensive and stressful. The standby retainer puts the answer on file before you need it: a signed agreement with locked-in preferred rates, a direct number, and priority response.",
  },
  {
    q: "When do the do‑it‑yourself modules open?",
    a: "Our low-cost, hands-on 'Fix it yourself' modules — designed for teams that want to do the work in-house — will be opening soon. We'll notify you as soon as they are available.",
  },
  {
    q: "What happens to my data?",
    a: "Your assessment data is kept strictly confidential. We solely use it to generate your personalized Cyber Score, conduct your walkthrough, and build your security roadmap.",
  },
  {
    q: "Who does the consultation?",
    a: "Your walkthrough will be conducted by a qualified Shield Identity security consultant — not a salesperson. Their job is to explain what your score means and learn how your business operates.",
  },
  {
    q: "What if I already have an IT provider?",
    a: "That's perfectly fine! The roadmap and playbook are yours to keep, and we highly encourage you to share them with your existing IT provider to help implement the recommendations.",
  },
  {
    q: "Who do I contact for what?",
    a: "Matters related to membership, events and the Brampton business community are handled by the Brampton Board of Trade. Anything to do with securing, certifying or protecting your business data goes to Shield Identity.",
  },
];

function FaqPage() {
  return (
    <PhaseShell maxWidth="max-w-3xl">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--cyan)] hover:underline"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Questions people ask before they start.
        </p>
      </div>

      <div className="glass-strong rounded-3xl p-6 sm:p-8">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className={i === faqs.length - 1 ? "border-b-0" : ""}
            >
              <AccordionTrigger className="text-left font-semibold hover:text-[color:var(--cyan-glow)]">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PhaseShell>
  );
}
