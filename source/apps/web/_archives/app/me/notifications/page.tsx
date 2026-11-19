/** `/me/notifications`: notifications are a mobile feature; the website says so instead of pretending. */
import Link from "next/link";

import {
  Breadcrumbs,
  PageFrame,
} from "#/_archives/components/site/ui/primitives";

export default function NotificationsRoute() {
  return (
    <PageFrame>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Preferences", href: "/me" },
          { label: "Notifications" },
        ]}
      />
      <h1 className="hero-title text-4xl sm:text-5xl">Notifications</h1>
      <p className="mt-2 max-w-2xl text-content-muted">
        Notifications about new content for places, leaders, projects, elections
        and tenders you follow are sent by the Mzizi mobile app. The website
        does not send notifications.
      </p>
      <p className="mt-6">
        <Link className="btn btn-primary" href="/me/saved">
          See what you have saved on this device
        </Link>
      </p>
    </PageFrame>
  );
}
