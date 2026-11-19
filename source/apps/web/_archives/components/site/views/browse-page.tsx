/** The hierarchy one level at a time: country, county, constituency, ward, then towns and villages. A server component. */
import Link from "next/link";

import { ChildGroups } from "#/_archives/components/site/child-groups";
import { Loaded } from "#/_archives/components/site/loaded";
import {
  Gaps,
  PageFrame,
  PlaceTabs,
  PlaceTrail,
} from "#/_archives/components/site/ui/primitives";
import { loadContext } from "#/_archives/lib/server/data";
import { placeAt } from "#/_archives/lib/site/links";
import { browse } from "#/_archives/lib/site/insights";

const NEXT: Record<string, string> = {
  country: "counties",
  county: "constituencies and towns",
  constituency: "wards",
  ward: "towns and villages",
  town: "villages",
  city: "neighbourhoods",
};

export async function BrowsePage({ featureId }: { featureId?: string }) {
  const country = (await loadContext())?.country.name ?? "";
  return (
    <PageFrame>
      <Loaded read={() => browse(featureId)}>
        {(data) => {
          const kind = data.place?.kindCode.replace(/^.*\./, "") ?? "country";
          return (
            <>
              <PlaceTrail
                chain={data.chain}
                section={{ label: "Places", suffix: "places" }}
              />
              {featureId && data.place ? (
                <PlaceTabs path={data.place.path} />
              ) : null}
              <p className="kicker">{data.place?.kindLabel ?? "Country"}</p>
              <h1 className="hero-title text-4xl sm:text-5xl">
                {data.place?.name ?? country}
              </h1>
              <p className="mt-2 max-w-2xl text-content-muted">
                {data.children.length > 0
                  ? `${data.children.length} ${NEXT[kind] ?? "places"} inside. Choose one to go deeper, or open its statistics, elections and money.`
                  : "This is the smallest place recorded here. Open its profile to see who serves it."}
              </p>
              {data.place && featureId ? (
                <p className="mt-4">
                  <Link
                    className="btn btn-primary"
                    href={placeAt(data.place.path, "")}
                  >
                    Who serves {data.place.name} →
                  </Link>
                </p>
              ) : null}
              <ChildGroups children={data.children} />
              {data.children.length === 0 ? (
                <Gaps
                  topic={`places inside ${data.place?.name ?? country}`}
                  items={[
                    `No smaller places are recorded inside ${data.place?.name ?? "this place"} yet. Towns and villages are added where a source names them.`,
                  ]}
                />
              ) : null}
            </>
          );
        }}
      </Loaded>
    </PageFrame>
  );
}
