"use client";

/** Route `/runs/new`: set up an engine run with a form built from the capability's own input contract. */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { AsyncView } from "#/components/portal/async-view.tsx";
import { button, buttonPrimary, Card, Crumbs, field } from "#/components/portal/ui.tsx";
import {
  explore,
  type CapabilityInfo,
  type JsonValue,
  type SchemaProperty,
} from "#/lib/portal/explore.ts";
import { useAsync } from "#/lib/portal/use-async.ts";
import { Icon } from "#/components/brand/icon.tsx";

type Values = Record<string, JsonValue>;

const LONG = /(_yaml|_text|content|html|actions|body)/;
const HIDDEN = new Set(["downloads_dir", "profile_dir", "adapter", "reuse_browser", "headed", "headless", "hold"]);

/** Ready-made setups the team uses often; they read their files from the dev root so a person can still edit every field. */
const PRESETS: readonly {
  label: string;
  kind: string;
  files: Record<string, string>;
  values: Values;
}[] = [
  {
    label: "Kenya tenders portal · active tenders (public API)",
    kind: "api.collect",
    files: {
      source_yaml: "sources/ke-tenders/source.yml",
      module_yaml: "sources/ke-tenders/active-tenders.module.yml",
    },
    values: { endpoint: "active-tenders", max_pages: 50, delay: 1, out_dir_name: "tenders-active-full" },
  },
  {
    label: "Check one URL is allowed and reachable (fetch.url)",
    kind: "fetch.url",
    files: {},
    values: { url: "https://tenders.go.ke/api/counties", out_dir_name: "fetch-counties" },
  },
];

function typeOf(property: SchemaProperty): string {
  return property.type ?? property.anyOf?.find((entry) => entry.type && entry.type !== "null")?.type ?? "string";
}

function Control({
  name,
  property,
  value,
  onChange,
}: {
  name: string;
  property: SchemaProperty;
  value: JsonValue | undefined;
  onChange: (next: JsonValue) => void;
}) {
  const kind = typeOf(property);
  if (property.enum) {
    return (
      <select className={field} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
        {property.enum.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    );
  }
  if (kind === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        {property.title ?? name}
      </label>
    );
  }
  if (kind === "integer" || kind === "number") {
    return (
      <input
        type="number"
        className={field}
        value={value === undefined || value === null ? "" : String(value)}
        step={kind === "integer" ? 1 : "any"}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      />
    );
  }
  if (kind === "array") {
    const lines = Array.isArray(value) ? value.join("\n") : "";
    return (
      <textarea
        className={`${field} h-24 font-mono`}
        placeholder="One per line"
        value={lines}
        onChange={(e) => onChange(e.target.value.split("\n").filter((line) => line.trim() !== ""))}
      />
    );
  }
  if (LONG.test(name)) {
    return (
      <textarea
        className={`${field} h-56 font-mono text-xs`}
        spellCheck={false}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return <input className={field} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
}

function Setup({ capabilities, devRoot }: { capabilities: readonly CapabilityInfo[]; devRoot: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [kind, setKind] = useState(params.get("kind") ?? "api.collect");
  const [values, setValues] = useState<Values>({});
  const [raw, setRaw] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [rawText, setRawText] = useState("{}");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const capability = capabilities.find((c) => c.name === kind);
  const properties = useMemo(() => Object.entries(capability?.input_schema.properties ?? {}), [capability]);
  const required = new Set(capability?.input_schema.required ?? []);

  useEffect(() => {
    const defaults: Values = {};
    for (const [name, property] of properties) {
      if (property.default !== undefined) defaults[name] = property.default;
    }
    const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
    defaults.out_dir = `${devRoot}/runs/${kind.replace(/\./g, "-")}-${stamp}`;
    setValues(defaults);
  }, [kind, properties, devRoot]);

  async function usePreset(index: number): Promise<void> {
    const preset = PRESETS[index];
    setMessage("");
    setKind(preset.kind);
    const loaded: Values = {};
    try {
      for (const [name, path] of Object.entries(preset.files)) {
        loaded[name] = (await explore.file("dev", path)).text ?? "";
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
      return;
    }
    const { out_dir_name, ...rest } = preset.values;
    setTimeout(
      () => setValues((current) => ({ ...current, ...loaded, ...rest, out_dir: `${devRoot}/runs/${String(out_dir_name)}` })),
      50,
    );
  }

  async function start(): Promise<void> {
    setBusy(true);
    setMessage("");
    try {
      const input: Values = raw ? (JSON.parse(rawText) as Values) : Object.fromEntries(Object.entries(values).filter(([, value]) => value !== ""));
      const job = await explore.submit(kind, input);
      router.push(`/runs/${job.id}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
      setBusy(false);
    }
  }

  const shown = properties.filter(([name]) => advanced || !HIDDEN.has(name));
  return (
    <div className="space-y-4">
      <Crumbs items={[{ href: "/runs", label: "Runs" }, { label: "New run" }]} />
      <Card title="Start from a ready setup">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, index) => (
            <button key={preset.label} className={button} onClick={() => usePreset(index)}>
              {preset.label}
            </button>
          ))}
        </div>
      </Card>
      <Card
        title="Run setup"
        action={
          <div className="flex gap-2 text-xs">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={advanced} onChange={(e) => setAdvanced(e.target.checked)} /> advanced fields
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={raw}
                onChange={(e) => {
                  setRawText(JSON.stringify(values, null, 2));
                  setRaw(e.target.checked);
                }}
              />{" "}
              edit as JSON
            </label>
          </div>
        }
      >
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-content-muted">What should the engine do?</span>
            <select className={field} value={kind} onChange={(e) => setKind(e.target.value)}>
              {capabilities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} — {c.description.slice(0, 70)}
                </option>
              ))}
            </select>
          </label>
          {capability ? <p className="text-sm text-content-muted">{capability.description}</p> : null}
          {raw ? (
            <textarea className={`${field} h-72 font-mono text-xs`} value={rawText} onChange={(e) => setRawText(e.target.value)} />
          ) : (
            shown.map(([name, property]) => (
              <label key={name} className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-content-muted">
                  {property.title ?? name}
                  {required.has(name) ? <span className="text-danger"> *</span> : null}
                </span>
                <Control name={name} property={property} value={values[name]} onChange={(next) => setValues((c) => ({ ...c, [name]: next }))} />
              </label>
            ))
          )}
          {message ? <p role="alert" className="text-sm text-danger">{message}</p> : null}
          <button className={buttonPrimary} disabled={busy} onClick={start}>
            {busy ? "Starting…" : <span className="inline-flex items-center gap-1.5"><Icon name="play" size={16} />Start run</span>}
          </button>
        </div>
      </Card>
    </div>
  );
}

function Form() {
  const loaded = useAsync(async () => ({ caps: await explore.capabilities(), roots: await explore.roots() }), "setup");
  return (
    <AsyncView loaded={loaded}>
      {({ caps, roots }) => (
        <Setup capabilities={caps.capabilities} devRoot={roots.find((r) => r.name === "dev")?.path ?? "."} />
      )}
    </AsyncView>
  );
}

export default function NewRunRoute() {
  return (
    <Suspense>
      <Form />
    </Suspense>
  );
}
