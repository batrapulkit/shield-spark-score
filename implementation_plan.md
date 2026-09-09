# Implementation Plan for SecureBramptonLanding Updates

## Goal Description

The team has decided to ensure that all primary call‑to‑action buttons and links on the Secure Brampton landing page correctly direct users to the appropriate resources:
- "Start 10‑minute assessment" / "Free Cyber Score" → `/assessment`
- "Talk to Shield Identity" → the **Contact Us** page (currently a Calendly link, will be updated to the proper contact page)
- Add a **lead‑capture dialog** that collects email, phone, and company name.
- Update the contact email throughout the codebase to `hello@shieldorientedia.ca`.
- Include an external link to the **Brampton Board of Trade** booth.

## Proposed Changes

### Files to Modify
1. `src/components/marketing/SecureBramptonLanding.tsx`
   - Update all `<a>` elements with `href="/assessment"` to ensure they point to the assessment route.
   - Replace Calendly URLs (`https://calendly.com/shieldidentity-ca/consultation`) with the internal contact page route, e.g., `/contact` (or the appropriate route if different).
   - Add a new **Dialog** component (using existing UI library) that opens when the user clicks the "Get your free Cyber Score" CTA, containing a form with fields: `name`, `email`, `phone`, `company`.
   - Wire the form submission to the existing `submitToCrm` function (or create a new helper if needed) and display a success message.
   - Update any hard‑coded email strings to `hello@shieldorientedia.ca`.
   - Ensure the external link to the Brampton Board of Trade booth (`https://bramptonbot.com`) is present and styled consistently.
   - Ensure the floating CTA (`float-cta`) also uses the updated dialog and routes.
2. `src/lib/assessment/scan.functions.ts` (if needed)
   - Verify that the `submitToCrm` payload includes the new `company` field.
3. Search the repo for any remaining occurrences of the old email address and replace them.

### UI / Design Adjustments
- Use existing button classes (`btn btn-p`, `btn btn-o`) for consistency.
- Add micro‑animation to the dialog open/close for a premium feel.
- Ensure the dialog is responsive and follows the dark‑mode / glassmorphism aesthetic already used.

### SEO / Accessibility
- Add `title` attributes to new links.
- Ensure the dialog has proper ARIA labels and focus trapping.

## Open Questions
- What is the exact route for the Contact Us page? (Assumed `/contact` – please confirm.)
- Should the lead‑capture dialog also send an email to `hello@shieldorientedia.ca` directly, or rely solely on the CRM integration?

## Verification Plan
- **Manual**: Run the dev server (`npm run dev`) and click each CTA to verify navigation.
- **Form**: Submit the lead‑capture form with test data and confirm the network request payload includes `email`, `phone`, `company` and hits the CRM endpoint.
- **Email**: Search the repo for any remaining occurrences of the old email address.
- **Link**: Verify the Brampton Board of Trade link opens in a new tab.
- **Accessibility**: Use a screen‑reader tool to ensure the dialog is announced correctly.

---

*Please review the plan and confirm the Contact Us route or any other preferences before we proceed with implementation.*
