"use client";

/** Route `/knowledge`: the term groups the engine knows, and a tester that tags any text with them. */
import { useState } from "react";

import { AsyncView } from "#/components/portal/async-view.tsx";
import { buttonPrimary, Card, field } from "#/components/portal/ui.tsx";
import { explore, type TaggedText } from "#/lib/portal/explore.ts";
import { useAsync } from "#/lib/portal/use-async.ts";

export default function KnowledgeRoute() {
  const [text, setText] = useState("Open tender for supply of road works, lowest evaluated bid with bid security");
  const [domain, setDomain] = useState("procurement");
  const [tagged, setTagged] = useState<readonly TaggedText[]>([]);
  const [message, setMessage] = useState("");
  const loaded = useAsync(() => explore.terms(), "terms");
  async function run(): Promise<void> {
    try {
      setTagged(await explore.tag(text.split("\n").filter((line) => line.trim()), domain));
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }
  return (
    <div className="grid gap-4 xl:grid-cols-[26rem_1fr]">
      <Card title="Try it on your own text">
        <textarea className={`${field} h-40`} value={text} onChange={(e) => setText(e.target.value)} />
        <div className="mt-2 flex items-center gap-2">
          <input className={`${field} w-40`} value={domain} onChange={(e) => setDomain(e.target.value)} aria-label="Term domain (blank for all)" />
          <button className={buttonPrimary} onClick={run}>Tag</button>
        </div>
        {message ? <p className="mt-2 text-sm text-danger">{message}</p> : null}
        <ul className="mt-4 space-y-3">
          {tagged.map((item, index) => (
            <li key={index} className="rounded-lg border border-border-default p-2 text-sm">
              <p className="text-content-muted">{item.text}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {item.hits.length === 0 ? <span className="text-xs text-content-muted">no known terms</span> : item.hits.map((hit) => (
                  <span key={`${hit.group}-${hit.term}`} title={`${hit.domain} · ${hit.group}`} className="rounded-full bg-raffia/20 px-2 py-0.5 text-xs text-raffia">{hit.term}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>
      <AsyncView loaded={loaded}>
        {(groups) => (
          <Card title={`${groups.length} term groups`}>
            <div className="max-h-[40rem] space-y-3 overflow-auto">
              {groups.map((group) => (
                <details key={`${group.domain}-${group.group}`} className="rounded-lg border border-border-default px-3 py-2">
                  <summary className="cursor-pointer text-sm">
                    <span className="text-[11px] uppercase tracking-widest text-clay">{group.domain}</span> {group.label || group.group}
                    <span className="ml-2 text-xs text-content-muted">{group.terms.length} terms</span>
                  </summary>
                  <p className="mt-2 text-xs leading-relaxed text-content-muted">{group.terms.join(" · ")}</p>
                </details>
              ))}
            </div>
          </Card>
        )}
      </AsyncView>
    </div>
  );
}
