/**
 * Schema: product | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 8 and 22.5 (approved 2026-11-25).
 * Contract authors: interface keys are contracts-first: screens declare their keys, unknown keys are refused, and
 * every displayed enum value has a key `enum.<schema>.<column>.<value>` (section 29.7).
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identityKindField, identityReference } from "./_links.ts";
import { Countries, Languages, Locales } from "./reference.ts";

export const product = dryv
  .group({ name: "product" })
  .description("The Mzizi product itself: apps, sites, country releases, interface text keys and their messages.")
  .facets({ storage: { namespace: "product", store: "main" } });

export const productProperties = product.properties({
  SiteStatus: dryv.property.enum({ Planned: "planned", Live: "live", Retired: "retired" }),
  ReleaseStatus: dryv.property.enum({ Preparing: "preparing", Live: "live", Paused: "paused", Withdrawn: "withdrawn" }),
  TextOrigin: dryv.property.enum({ Original: "original", Human: "human", Machine: "machine" }),
  MessageStatus: dryv.property.enum({ Draft: "draft", Reviewed: "reviewed", Published: "published" }),
  Host: dryv.property
    .string()
    .length({ min: 3, max: 253 })
    .pattern({ match: ["^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$"] }),
  KeyCode: dryv.property
    .string()
    .length({ min: 3, max: 255 })
    .pattern({ match: ["^[a-z][a-z0-9-]*(\\.[a-z0-9][a-z0-9-]*)+$"] }),
  Placeholder: dryv.property
    .string()
    .length({ min: 1, max: 64 })
    .pattern({ match: ["^[a-zA-Z][a-zA-Z0-9]*$"] }),
  MessageText: dryv.property.string().length({ min: 1, max: 8000 }),
});

/*---------------- product.apps ----------------*/
export const Apps = product
  .schema("Apps", { identityKind: identityKindField("app") })
  .extends(baseSchemas.IdentityEntity)
  .rule("AppKind", (v) => v.identityKind.eq("app"))
  .description("A Mzizi application: web, app or dev. Its names are `identity.names`.")
  .role("entity")
  .facets({ storage: dryv.storage("apps").references("AppIsIdentity", identityReference) });

/*---------------- product.sites ----------------*/
export const Sites = product
  .schema("Sites", {
    appId: belongsTo(() => Apps),
    host: dryv.field(productProperties.Host).description("The public host name (ke.mzizi.africa)."),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("The country a country site serves; empty for the continental site."),
    localeId: belongsTo(() => Locales)
      .maybe()
      .description("The default locale of the site."),
    status: dryv.field(productProperties.SiteStatus),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A public site or domain of an app, with its default locale and status.")
  .role("entity")
  .facets({ storage: dryv.storage("sites").unique("host").index("appId").index("countryId") });

/*---------------- product.releases ----------------*/
export const Releases = product
  .schema("Releases", {
    appId: belongsTo(() => Apps),
    countryId: belongsTo(() => Countries),
    status: dryv.field(productProperties.ReleaseStatus),
    fromOn: dryv.field(sharedProperties.CalendarDate).maybe().description("Date the country went live on the app."),
    toOn: dryv.field(sharedProperties.CalendarDate).maybe().description("Date the release ended."),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("ReleaseDatesAreOrdered", dryv.rule.ordered("fromOn", "toOn", { allowEqual: true }))
  .description("Which country is served on which app and since when.")
  .role("entity")
  .facets({ storage: dryv.storage("releases").unique("appId", "countryId", "fromOn").index("countryId") });

/*---------------- product.lang ----------------*/
export const Lang = product
  .schema("Lang", {
    releaseId: belongsTo(() => Releases, { onDelete: "cascade" }),
    languageId: belongsTo(() => Languages),
    position: dryv.field(sharedProperties.NonNegativeInteger).description("Order in the site's language menu (0 first)."),
  })
  .extends(baseSchemas.Association)
  .description("The languages a release offers, in order.")
  .role("entity")
  .facets({ storage: dryv.storage("lang").unique("releaseId", "languageId").index("languageId") });

/*---------------- product.keys ----------------*/
export const Keys = product
  .schema("Keys", {
    code: dryv.field(productProperties.KeyCode).description("The interface key as declared in contracts (web.home.title)."),
    appId: belongsTo(() => Apps)
      .maybe()
      .description("The app that declares the key; empty for keys shared by every app (enum labels)."),
    description: dryv
      .field(sharedProperties.Description)
      .maybe()
      .description("Context for translators: where the text appears and what it means."),
    placeholders: dryv
      .field(productProperties.Placeholder)
      .array()
      .maybe()
      .description("Names of the placeholders the text takes ({count})."),
    maxLength: dryv.field(sharedProperties.PositiveInteger).maybe().description("Longest text that fits where it is shown."),
  })
  .extends(baseSchemas.Entity)
  .description("An interface text key declared in contracts; unknown keys are refused and missing messages are gaps.")
  .role("entity")
  .facets({ storage: dryv.storage("keys").unique("code").index("appId") });

/*---------------- product.messages ----------------*/
export const Messages = product
  .schema("Messages", {
    keyId: belongsTo(() => Keys, { onDelete: "cascade" }),
    languageId: belongsTo(() => Languages),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("Set when one country words the key differently."),
    text: dryv.field(productProperties.MessageText),
    origin: dryv.field(productProperties.TextOrigin).description("original, human translation or machine translation."),
    status: dryv.field(productProperties.MessageStatus),
    translator: dryv.field(sharedProperties.NonEmptyString255).maybe().description("Who translated or reviewed the text."),
  })
  .extends(baseSchemas.Entity)
  .description("The text of one interface key in one language, optionally for one country.")
  .role("entity");

const liveMessage = (withCountry: boolean) =>
  product.expression(
    withCountry ? "LiveCountryMessage" : "LiveGlobalMessage",
    Messages.check((v) => (withCountry ? v.countryId.isNotNull() : v.countryId.isNull()).and(v.deletedAt.isNull())),
  );
Messages.facets({
  storage: dryv
    .storage("messages")
    .indexes(
      { fields: ["keyId", "languageId", "countryId"], unique: true, where: liveMessage(true) },
      { fields: ["keyId", "languageId"], unique: true, where: liveMessage(false) },
    )
    .index("languageId"),
});
