import { createFileRoute } from "@tanstack/react-router";
import { SecureBramptonLanding } from "@/components/marketing/SecureBramptonLanding";

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
  return <SecureBramptonLanding />;
}
