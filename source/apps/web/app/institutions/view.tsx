"use client";

/** A searchable directory whose arms, categories and institution labels are supplied by reference data. */
import Link from "next/link";
import { useState } from "react";
import { AsyncView } from "#/components/site/async-view.tsx";
import {
  Empty,
  DevelopmentNote,
} from "#/components/site/governance/shared.tsx";
import { Avatar } from "#/components/site/ui/media.tsx";
import {
  Breadcrumbs,
  Gaps,
  PageFrame,
  Pill,
} from "#/components/site/ui/primitives.tsx";
import { institutions } from "#/lib/site/governance/reads.ts";
import { useAsync } from "#/lib/site/use-async.ts";

export default function InstitutionsRoute() {
  const [query, setQuery] = useState("");
  const [arm, setArm] = useState("");
  const loaded = useAsync(() => institutions(), "institutions");
  return (
    <PageFrame>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Institutions" }]}
      />
      <p className="kicker">Public institutions</p>
      <h1 className="hero-title text-4xl sm:text-5xl">Who does what?</h1>
      <p className="mt-3 max-w-2xl text-content-muted">
        Explore public bodies, their responsibilities, leadership and the legal
        foundations recorded for them.
      </p>
      <DevelopmentNote />
      <AsyncView loaded={loaded}>
        {(d) => {
          const q = query.trim().toLocaleLowerCase();
          const shown = d.arms
            .filter((a) => !arm || a.code === arm)
            .map((a) => ({
              ...a,
              groups: a.groups
                .map((g) => ({
                  ...g,
                  institutions: g.institutions.filter(
                    (i) =>
                      !q ||
                      `${i.name} ${i.purpose ?? ""}`
                        .toLocaleLowerCase()
                        .includes(q),
                  ),
                }))
                .filter((g) => g.institutions.length > 0),
            }))
            .filter((a) => a.groups.length > 0);
          return (
            <>
              <div className="my-7 grid gap-3 sm:grid-cols-[1fr_18rem]">
                <label className="text-sm">
                  <span className="mb-1 block font-semibold">
                    Find an institution
                  </span>
                  <input
                    className="input w-full"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name or responsibility"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-semibold">Arm or group</span>
                  <select
                    className="input w-full"
                    value={arm}
                    onChange={(e) => setArm(e.target.value)}
                  >
                    <option value="">
                      All groups · {d.total} institutions
                    </option>
                    {d.arms.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.label} · {a.count}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {shown.length === 0 ? (
                <Empty
                  title="No institutions match"
                  action={
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setQuery("");
                        setArm("");
                      }}
                    >
                      Clear filters
                    </button>
                  }
                >
                  Try a broader search or another group.
                </Empty>
              ) : (
                shown.map((a) => (
                  <section className="mt-10" key={a.code}>
                    <h2 className="font-display text-2xl">{a.label}</h2>
                    {a.about ? (
                      <p className="mt-2 max-w-3xl text-sm text-content-muted">
                        {a.about}
                      </p>
                    ) : null}
                    {a.groups.map((g) => (
                      <div className="mt-6" key={g.kind.code}>
                        <h3 className="kicker mb-2">{g.kind.label}</h3>
                        <ul className="divide-y divide-[var(--border-default)]">
                          {g.institutions.map((i) => (
                            <li key={i.code}>
                              <Link
                                className="flex items-start gap-4 py-5"
                                href={`/institutions/${encodeURIComponent(i.code)}`}
                              >
                                <Avatar src={i.image} name={i.name} size={48} />
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-semibold hover:text-clay">
                                    {i.name} ↗
                                  </h4>
                                  {i.purpose ? (
                                    <p className="mt-1 max-w-3xl text-sm text-content-muted">
                                      {i.purpose}
                                    </p>
                                  ) : null}
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <Pill>
                                      {i.basis?.label ??
                                        "Establishment basis not recorded"}
                                    </Pill>
                                    <span className="text-xs text-content-muted">
                                      {i.leaders} leaders · {i.children} related
                                      bodies
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </section>
                ))
              )}
              <Gaps items={d.gaps} />
            </>
          );
        }}
      </AsyncView>
    </PageFrame>
  );
}
