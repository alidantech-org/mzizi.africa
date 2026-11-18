"use client";

/** Route `/files`: browse the seed, dev, run-output and docs folders and view any file in a fitting viewer. */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { AsyncView } from "#/components/portal/async-view.tsx";
import { bytes, Card, Crumbs, filesLink } from "#/components/portal/ui.tsx";
import { FileViewer } from "#/components/portal/viewer.tsx";
import { explore } from "#/lib/portal/explore.ts";
import { useAsync } from "#/lib/portal/use-async.ts";
import { Icon, type IconName } from "#/components/brand/icon.tsx";

const ICON: Record<string, IconName> = { folder: "map", markdown: "book", csv: "chart", json: "document", jsonl: "document", yaml: "build", pdf: "document", image: "image", text: "document", binary: "shield" };

function Browser() {
  const params = useSearchParams();
  const router = useRouter();
  const root = params.get("root") ?? "dev";
  const path = params.get("path") ?? "";
  const [version, setVersion] = useState(0);
  const roots = useAsync(() => explore.roots(), "roots");
  const entry = useAsync(async () => {
    const listing = await explore.list(root, path);
    // A file path lists its folder (the listing's path differs from the one asked for); then the file is opened too.
    return { listing, file: listing.path === path ? null : await explore.file(root, path) };
  }, `${root}|${path}|${version}`);
  const parts = path ? path.split("/") : [];
  return (
    <div className="space-y-4">
      <AsyncView loaded={roots}>
        {(list) => (
          <div className="flex flex-wrap gap-2">
            {list.map((item) => (
              <Link key={item.name} href={filesLink(item.name, "")} className={`rounded-lg border px-3 py-1.5 text-sm ${item.name === root ? "border-clay bg-clay text-cream" : "border-border-default bg-surface-elevated hover:bg-surface-sunken"}`}>
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </AsyncView>
      <Crumbs
        items={[
          { href: filesLink(root, ""), label: root },
          ...parts.map((part, index) => ({ href: filesLink(root, parts.slice(0, index + 1).join("/")), label: part })),
        ]}
      />
      <AsyncView loaded={entry}>
        {({ listing, file }) => (
          <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
            <Card title={`${listing.entries.length} items`}>
              <ul className="max-h-[36rem] space-y-0.5 overflow-auto text-sm">
                {listing.parent !== null ? (
                  <li>
                    <Link href={filesLink(root, listing.parent)} className="block rounded px-2 py-1 hover:bg-surface-sunken">↩ up</Link>
                  </li>
                ) : null}
                {listing.entries.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={filesLink(root, item.path)}
                      className={`flex items-center gap-2 rounded px-2 py-1 hover:bg-surface-sunken ${item.path === path ? "bg-sand/60 font-medium" : ""}`}
                    >
                      <Icon name={ICON[item.kind] ?? "document"} size={18} />
                      <span className="min-w-0 flex-1 truncate">{item.name}</span>
                      {item.directory ? null : <span className="text-[11px] text-content-muted">{bytes(item.size)}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              {file ? (
                <FileViewer file={file} reload={() => { setVersion((v) => v + 1); router.refresh(); }} />
              ) : (
                <p className="text-sm text-content-muted">Pick a file on the left to view it. Markdown renders, CSV opens as a table, JSON and YAML as a tree, PDFs inline.</p>
              )}
            </Card>
          </div>
        )}
      </AsyncView>
    </div>
  );
}

export default function FilesRoute() {
  return (
    <Suspense>
      <Browser />
    </Suspense>
  );
}
