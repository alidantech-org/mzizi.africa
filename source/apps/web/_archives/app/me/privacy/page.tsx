/** `/me/privacy`: what the web app keeps about a visitor. A draft for legal review (USER_INTERACTIONS_AND_TRUST); it states what is built. */
import {
  Breadcrumbs,
  PageFrame,
} from "#/_archives/components/site/ui/primitives";

export default function PrivacyRoute() {
  return (
    <PageFrame>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Preferences", href: "/me" },
          { label: "Privacy" },
        ]}
      />
      <h1 className="hero-title text-4xl sm:text-5xl">Privacy</h1>
      <p className="mt-2 max-w-2xl text-content-muted">
        Mzizi keeps as little about you as it can. This page says exactly what
        the website stores today. It is a draft until it has been reviewed
        against the data protection law of each country served.
      </p>
      <ul className="mt-8 space-y-4 text-sm">
        <li className="glass card">
          <strong>No account, no name, no email, no phone.</strong> Nothing here
          asks who you are.
        </li>
        <li className="glass card">
          <strong>Your choices stay on your device:</strong> language, theme and
          the places and items you save are kept in your browser. Clear your
          browser data and they go.
        </li>
        <li className="glass card">
          <strong>Likes.</strong> When you like something, the website stores a
          random identifier in a cookie (not readable by scripts). The server
          keeps only a one-way scrambled form of it, with your like. It cannot
          tell who you are. Removing your like removes it from the count.
        </li>
        <li className="glass card">
          <strong>Views.</strong> A page view is counted once a day using a
          scrambled form of your address and browser that changes every day, so
          you cannot be followed from one day to the next. The readable address
          is never stored. Views are used to understand what is useful and are
          not shown to visitors.
        </li>
        <li className="glass card">
          <strong>Your country</strong> is worked out from the network when you
          arrive, used to show the right data, and only the country code is kept
          in logs.
        </li>
        <li className="glass card">
          <strong>Posting</strong> (comments, photos, evidence) is not on the
          website. It will exist only in the mobile app, with its own notice and
          consent.
        </li>
      </ul>
    </PageFrame>
  );
}
