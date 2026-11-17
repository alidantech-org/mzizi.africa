"use client";

/** Route `/place-profile`. Scaffolded by Dryv once; this file belongs to the app. Opens a place by feature or position. */
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AsyncView } from "#/components/site/async-view.tsx";
import { ProfileView } from "#/components/site/profile/profile-view.tsx";
import { profileAt, profileOf } from "#/lib/site/api.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { useAsync } from "#/lib/site/use-async.ts";

function PlaceProfile() {
  const params = useSearchParams();
  const { language } = useLanguage();
  const featureId = params.get("featureId");
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));
  const key = `${featureId}|${lat}|${lng}|${language}`;
  const loaded = useAsync(
    () =>
      featureId !== null
        ? profileOf(featureId, language)
        : params.has("lat") && params.has("lng")
          ? profileAt(lat, lng, language)
          : Promise.reject(new Error("Choose a place first.")),
    key,
  );
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <AsyncView loaded={loaded}>
        {(profile) => (
          <ProfileView
            profile={profile}
            position={
              params.has("lat") && params.has("lng") ? { latitude: lat, longitude: lng } : null
            }
          />
        )}
      </AsyncView>
    </div>
  );
}

export default function PlaceProfileRoute() {
  return (
    <Suspense>
      <PlaceProfile />
    </Suspense>
  );
}
