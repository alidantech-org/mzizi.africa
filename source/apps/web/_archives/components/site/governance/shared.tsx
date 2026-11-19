"use client";

/** Evidence-aware presentation shared by the governance and explanatory reading screens. */
import Link from "next/link";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "#/_archives/lib/site/i18n";
import type {
  ContentItem,
  LegalItem,
} from "#/_archives/lib/site/governance/contracts";

export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="my-4 flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-default)] px-6 py-8 text-center">
      <span aria-hidden className="mb-2 text-3xl text-content-muted">
        ◇
      </span>
      <p className="font-semibold">{title}</p>
      {children ? (
        <p className="mt-2 max-w-lg text-sm text-content-muted">{children}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
export function DevelopmentNote() {
  const { tr } = useLanguage();
  return (
    <p
      role="note"
      className="my-5 rounded-xl border border-[var(--border-default)] bg-surface-sunken px-4 py-3 text-sm text-content-muted"
    >
      {tr(
        "Development dataset. Officeholders and explanatory text may be invented examples. Recorded measures are not an overall rating of a leader.",
      )}
    </p>
  );
}
export function Markdown({ text }: { text: string }) {
  return (
    <div className="mz-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              className="underline decoration-clay underline-offset-4"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) =>
            typeof src === "string" &&
            (src.startsWith("https://") ||
              src.startsWith("http://") ||
              src.startsWith("/")) ? (
              <img
                src={src}
                alt={alt ?? ""}
                loading="lazy"
                className="my-5 max-h-[32rem] w-full rounded-2xl object-contain"
              />
            ) : (
              <span className="text-sm text-content-muted">
                {alt || "Image not available"}
              </span>
            ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
export function ContentArticle({ item }: { item: ContentItem }) {
  return (
    <article lang={item.language}>
      <div className="mb-4 flex flex-wrap gap-2 text-xs text-content-muted">
        <span className="chip">{item.category.label}</span>
        {item.classification ? (
          <span className="chip">{item.classification.label}</span>
        ) : null}
        {item.tags.map((tag) => (
          <Link
            className="chip"
            key={tag}
            href={`/content?tag=${encodeURIComponent(tag)}`}
          >
            {tag}
          </Link>
        ))}
      </div>
      {item.isDevelopmentText ? <DevelopmentNote /> : null}
      {item.image ? (
        <img
          className="mb-6 max-h-80 w-full rounded-2xl object-cover"
          src={item.image}
          alt={item.title}
        />
      ) : null}
      <Markdown text={item.body} />
    </article>
  );
}
export function ContentLinks({ items }: { items: ContentItem[] }) {
  return (
    <ul className="divide-y divide-[var(--border-default)]">
      {items.map((item) => (
        <li key={`${item.slug}-${item.language}`}>
          <Link
            className="group block py-5"
            href={`/content/${encodeURIComponent(item.slug)}`}
          >
            <span className="text-xs text-content-muted">
              {item.category.label}
              {item.isDevelopmentText ? " · Development text" : ""}
            </span>
            <h3 className="mt-1 font-display text-xl group-hover:text-clay">
              {item.title} <span aria-hidden>↗</span>
            </h3>
            {item.summary ? (
              <p className="mt-1 max-w-3xl text-sm text-content-muted">
                {item.summary}
              </p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
export function LegalItems({ items }: { items: LegalItem[] }) {
  return items.length === 0 ? (
    <Empty title="Legal basis not recorded">
      A missing link is a gap in the records, not evidence that no legal
      foundation exists.
    </Empty>
  ) : (
    <ul className="divide-y divide-[var(--border-default)]">
      {items.map((item, index) => (
        <li
          key={`${item.provisionCode ?? item.instrument}-${index}`}
          className="py-5"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-content-muted">
            {item.effect}
            {item.via ? ` · ${item.via}` : ""}
          </p>
          <h3 className="mt-1 font-semibold">
            {item.instrument}
            {item.designation ? ` · ${item.designation}` : ""}
            {item.heading ? ` — ${item.heading}` : ""}
          </h3>
          {item.excerpt ? (
            <blockquote className="mt-3 border-l-2 border-clay pl-4 text-sm leading-relaxed text-content-muted">
              {item.excerpt}
            </blockquote>
          ) : null}
          {item.explanation ? (
            <p className="mt-2 text-sm">{item.explanation}</p>
          ) : null}
          <p className="mt-2 text-xs text-content-muted">
            Review status: {item.reviewStatus || "not supplied"}
            {item.provisionCode
              ? ` · Provision: ${item.provisionCode}`
              : " · Provision text not loaded"}
          </p>
          {item.provisionCode ? (
            <Link
              className="mt-2 inline-block text-sm text-clay underline underline-offset-4"
              href={`/government/law/provision/${encodeURIComponent(item.provisionCode)}`}
            >
              Read provision →
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
