"use client";

/** Views one file by its kind: Markdown, CSV, JSON, YAML, text, PDF and images; dev-root text files can be edited and saved. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { bytes, button, buttonPrimary, field, Grid, JsonTree, Pager } from "#/components/portal/ui.tsx";
import { explore, rawUrl, type FileView } from "#/lib/portal/explore.ts";
import { Icon } from "#/components/brand/icon.tsx";

const EDITABLE = new Set(["markdown", "yaml", "json", "text", "csv"]);
const PAGE = 50;

function CsvView({ file }: { file: FileView }) {
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(file);
  useEffect(() => {
    if (offset === 0) return setPage(file);
    explore.file(file.root, file.path, offset, PAGE).then(setPage, () => undefined);
  }, [offset, file]);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-content-muted">{file.header.length} columns</p>
        <Link href={`/csv?root=${file.root}&path=${encodeURIComponent(file.path)}`} className={buttonPrimary}>
          <Icon name="swap" size={16} className="mr-1.5 inline" />Prepare this CSV
        </Link>
      </div>
      <Grid header={page.header} rows={page.rows.slice(0, PAGE)} caption={file.name} />
      <Pager offset={offset} limit={PAGE} total={file.total_rows ?? 0} onChange={setOffset} />
    </div>
  );
}

function Editor({ file, onDone }: { file: FileView; onDone: () => void }) {
  const [text, setText] = useState(file.text ?? "");
  const [message, setMessage] = useState("");
  async function save(): Promise<void> {
    try {
      await explore.save(file.path, text, true);
      onDone();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }
  return (
    <div className="space-y-2">
      <textarea className={`${field} h-[28rem] font-mono text-xs`} spellCheck={false} value={text} onChange={(e) => setText(e.target.value)} />
      {message ? <p className="text-sm text-danger">{message}</p> : null}
      <div className="flex gap-2">
        <button className={buttonPrimary} onClick={save}>Save changes</button>
        <button className={button} onClick={onDone}>Cancel</button>
      </div>
    </div>
  );
}

async function extract(file: FileView, kind: string, router: ReturnType<typeof useRouter>): Promise<void> {
  const response = await fetch(rawUrl(file.root, file.path));
  const data = new Uint8Array(await response.arrayBuffer());
  let binary = "";
  for (let index = 0; index < data.length; index += 0x8000) {
    binary += String.fromCharCode(...data.subarray(index, index + 0x8000));
  }
  const job = await explore.submit(kind, { content_base64: btoa(binary) });
  router.push(`/runs/${job.id}`);
}

export function FileViewer({ file, reload }: { file: FileView; reload: () => void }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [source, setSource] = useState(false);
  const body = (() => {
    if (editing) return <Editor file={file} onDone={() => { setEditing(false); reload(); }} />;
    switch (file.kind) {
      case "markdown":
        return (
          <article className="md">
            <Markdown remarkPlugins={[remarkGfm]}>{(file.text ?? "").replace(/^---\n[\s\S]*?\n---\n/, "")}</Markdown>
          </article>
        );
      case "csv":
        return <CsvView file={file} />;
      case "json":
      case "yaml":
        return source || file.parsed === null ? (
          <pre className="overflow-auto whitespace-pre-wrap font-mono text-xs">{file.text}</pre>
        ) : (
          <JsonTree value={file.parsed} />
        );
      case "pdf":
        return <iframe title={file.name} src={rawUrl(file.root, file.path)} className="h-[40rem] w-full rounded-lg border border-border-default" />;
      case "image":
        // eslint-disable-next-line @next/next/no-img-element
        return <img alt={file.name} src={rawUrl(file.root, file.path)} className="max-h-[36rem] rounded-lg border border-border-default" />;
      case "binary":
        return <p className="text-sm text-content-muted">This file is binary; download it to open it elsewhere.</p>;
      default:
        return <pre className="max-h-[36rem] overflow-auto whitespace-pre-wrap font-mono text-xs">{file.text}</pre>;
    }
  })();
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-lg">{file.name}</h3>
        <span className="text-xs text-content-muted">{file.kind} · {bytes(file.size)}{file.truncated ? " · shown partly" : ""}</span>
        <span className="flex-1" />
        {(file.kind === "json" || file.kind === "yaml") && file.parsed !== null ? (
          <button className={button} onClick={() => setSource(!source)}>{source ? "Tree view" : "Source"}</button>
        ) : null}
        {file.root === "dev" && EDITABLE.has(file.kind) && !editing && !file.truncated ? (
          <button className={button} onClick={() => setEditing(true)}><Icon name="filter" size={16} className="mr-1.5 inline" />Edit</button>
        ) : null}
        {file.actions.includes("extraction.pdf") ? (
          <>
            <button className={button} onClick={() => extract(file, "extraction.pdf", router).catch((e: Error) => setMessage(e.message))}>Extract text &amp; tables</button>
            <button className={button} onClick={() => extract(file, "extraction.markdown", router).catch((e: Error) => setMessage(e.message))}>Extract as Markdown</button>
          </>
        ) : null}
        <a className={button} href={rawUrl(file.root, file.path)} target="_blank" rel="noreferrer">Open raw</a>
      </div>
      {message ? <p className="text-sm text-danger">{message}</p> : null}
      {body}
    </div>
  );
}
