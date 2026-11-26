/**
 * Schema: media | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 9, 22.6, 32 and 34.5 (approved 2026-11-25).
 * Contract authors: articles and assets are not identities; they belong to identities. Their titles and captions are
 * per-language rows here, and their grouping is their own `category_term` / `kind_term`.
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { enums } from "#/schemas/_enums.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identity, term } from "./_links.ts";
import { Actors } from "./community.ts";
import { Versions } from "./filesystem.ts";
import { Languages } from "./reference.ts";

export const media = dryv
  .group({ name: "media" })
  .description(
    "Readable and visual material that belongs to named things: articles and their texts, assets, captions and uses.",
  )
  .facets({ storage: { namespace: "media", store: "main" } });

export const mediaProperties = media.properties({
  TextOrigin: dryv.property.enum({ Original: "original", Human: "human", Machine: "machine" }),
  TextStatus: dryv.property.enum({ Draft: "draft", Reviewed: "reviewed", Published: "published" }),
  AssetKind: dryv.property.enum({ Held: "held", External: "external", Embed: "embed" }),
  Availability: dryv.property.enum({ Live: "live", Removed: "removed", Unavailable: "unavailable" }),
  Title: dryv.property.string().length({ min: 1, max: 500 }),
  Summary: dryv.property.string().length({ min: 1, max: 4000 }),
  Markdown: dryv.property.string().length({ min: 1 }),
  Seconds: dryv.property.number().range({ min: 0 }),
  Pixels: dryv.property.number.integer({ range: { min: 1 } }),
});

/*---------------- media.articles ----------------*/
export const Articles = media
  .schema("Articles", {
    identityId: identity("The named thing the article is mainly for; empty for a general article.").maybe(),
    categoryTerm: term("med.article.category", "Editorial group of the article (explainer, methodology, blog)."),
    authorId: identity("The person or organisation who wrote it, when they are a named thing.").maybe(),
    contributorId: belongsTo(() => Actors)
      .maybe()
      .description("The community member who contributed it; contributions are reviewed before publishing."),
    publishedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("An article record with no text; its texts per language are `media.texts`.")
  .role("entity")
  .facets({ storage: dryv.storage("articles").index("identityId").index("categoryTerm").index("contributorId") });

/*---------------- media.texts ----------------*/
export const Texts = media
  .schema("Texts", {
    articleId: belongsTo(() => Articles, { onDelete: "cascade" }),
    languageId: belongsTo(() => Languages),
    title: dryv.field(mediaProperties.Title),
    summary: dryv.field(mediaProperties.Summary).maybe(),
    body: dryv.field(mediaProperties.Markdown).description("The article body in Markdown."),
    origin: dryv
      .field(mediaProperties.TextOrigin)
      .description("original, human translation or machine translation; a machine translation is labelled when shown."),
    translatedFromId: belongsTo(dryv.self).maybe().description("The text this one was translated from."),
    status: dryv.field(mediaProperties.TextStatus),
  })
  .extends(baseSchemas.Entity)
  .rule("TranslationNamesItsSource", (v) => v.origin.eq("original").or(v.translatedFromId.isNotNull()))
  .description("One article in one language: exactly one original per article, at most one live text per language.")
  .role("entity");

Texts.facets({
  storage: dryv
    .storage("texts")
    .indexes(
      {
        description: "Exactly one live original per article.",
        fields: ["articleId"],
        unique: true,
        where: media.expression(
          "LiveOriginalText",
          Texts.check((v) => v.origin.eq("original").and(v.deletedAt.isNull())),
        ),
      },
      {
        description: "At most one live text per article and language.",
        fields: ["articleId", "languageId"],
        unique: true,
        where: media.expression(
          "LiveText",
          Texts.check((v) => v.deletedAt.isNull()),
        ),
      },
    )
    .index("languageId")
    .index("translatedFromId"),
});

/*---------------- media.subjects ----------------*/
export const Subjects = media
  .schema("Subjects", {
    articleId: belongsTo(() => Articles, { onDelete: "cascade" }),
    identityId: identity("A named thing the article is about."),
    role: dryv.field(enums.SubjectRole).description("main or mentioned."),
  })
  .extends(baseSchemas.Association)
  .description("The named things an article is about, beyond its main identity (section 34.5).")
  .role("entity")
  .facets({ storage: dryv.storage("subjects").unique("articleId", "identityId").index("identityId") });

/*---------------- media.assets ----------------*/
export const Assets = media
  .schema("Assets", {
    kind: dryv
      .field(mediaProperties.AssetKind)
      .description("held (bytes in filesystem), external (a link) or embed (shown through the provider's player)."),
    kindTerm: term("med.asset.kind", "What the asset is: photo, logo, flag, portrait, video, audio, scan."),
    versionId: belongsTo(() => Versions)
      .maybe()
      .description("The stored bytes of a held asset."),
    providerTerm: term(
      "med.provider",
      "youtube, x, tiktok, facebook, instagram, vimeo, wikipedia, news site, government site.",
    ).maybe(),
    externalUrl: dryv.field(sharedProperties.Url).maybe().description("Canonical address of external content."),
    externalId: dryv
      .field(sharedProperties.NonEmptyString255)
      .maybe()
      .description("The provider's id (a YouTube video id)."),
    embedUrl: dryv
      .field(sharedProperties.Url)
      .maybe()
      .description("The provider's player address; external video is never re-hosted."),
    thumbnailUrl: dryv.field(sharedProperties.Url).maybe(),
    author: dryv.field(sharedProperties.NonEmptyString255).maybe().description("Author as the provider shows it."),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    availability: dryv
      .field(mediaProperties.Availability)
      .maybe()
      .description("Whether external content is still reachable; re-checked regularly."),
    checkedAt: dryv.field(sharedProperties.Instant).maybe(),
    startSecond: dryv.field(mediaProperties.Seconds).maybe().description("Start of the relevant part of a video or audio."),
    endSecond: dryv.field(mediaProperties.Seconds).maybe(),
    width: dryv.field(mediaProperties.Pixels).maybe(),
    height: dryv.field(mediaProperties.Pixels).maybe(),
    duration: dryv.field(mediaProperties.Seconds).maybe().description("Length in seconds."),
    licenceTerm: term("src.licence", "The licence the asset is used under.").maybe(),
    capturedOn: dryv.field(sharedProperties.CalendarDate).maybe().description("Date the photo or recording was made."),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("HeldAssetHasBytes", (v) => v.kind.ne("held").or(v.versionId.isNotNull()))
  .rule("ExternalAssetHasUrl", (v) => v.kind.eq("held").or(v.externalUrl.isNotNull()))
  .rule("AssetSecondsAreOrdered", dryv.rule.ordered("startSecond", "endSecond"))
  .description("A photo, logo, flag, video, audio or scan: held bytes or an external link or embed.")
  .role("entity")
  .facets({ storage: dryv.storage("assets").index("versionId").index("kindTerm").index("providerTerm", "externalId") });

/*---------------- media.captions ----------------*/
export const Captions = media
  .schema("Captions", {
    assetId: belongsTo(() => Assets, { onDelete: "cascade" }),
    languageId: belongsTo(() => Languages),
    title: dryv.field(mediaProperties.Title).maybe(),
    description: dryv.field(mediaProperties.Summary).maybe(),
    altText: dryv.field(sharedProperties.NonEmptyString1000).maybe().description("Text alternative for screen readers."),
    origin: dryv.field(mediaProperties.TextOrigin),
  })
  .extends(baseSchemas.Entity)
  .description("Title, description and alt text of an asset in one language.")
  .role("entity")
  .facets({ storage: dryv.storage("captions").unique("assetId", "languageId").index("languageId") });

/*---------------- media.uses ----------------*/
export const Uses = media
  .schema("Uses", {
    assetId: belongsTo(() => Assets, { onDelete: "cascade" })
      .maybe()
      .description("The image or file shown; empty while the use is only expected (a flag with no file yet)."),
    identityId: identity("The named thing the asset illustrates."),
    purposeTerm: term("med.use.purpose", "Why it is shown: portrait, logo, flag, skyline, map."),
    position: dryv
      .field(sharedProperties.NonNegativeInteger)
      .maybe()
      .description("Order among the thing's assets of one purpose."),
    ...periodFields,
  })
  .extends(baseSchemas.Entity)
  .rule("UsePeriodIsOrdered", dryv.rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description("Which named thing an asset illustrates and why (Nairobi ← photo, skyline).")
  .role("entity")
  .facets({
    storage: dryv.storage("uses").unique("assetId", "identityId", "purposeTerm").index("identityId", "purposeTerm"),
  });
