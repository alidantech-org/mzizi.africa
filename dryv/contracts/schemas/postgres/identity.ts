/**
 * Schema: identity | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 3, 5 and 21.3 (approved 2026-11-25).
 * Contract authors: `names` and `identifiers` are list-partitioned by identity kind, so their primary and unique keys
 * carry `identity_kind`, and links into them are composite (`id`, `identity_kind`).
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas, codeDescription } from "#/schemas/_base.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identityProperties, registerLinkTargets, term } from "./_links.ts";
import { Countries, Languages } from "./reference.ts";
import { Terms } from "./vocabulary.ts";

export const identity = dryv
  .group({ name: "identity" })
  .description(
    "One language-neutral identity for every named thing, and everything about named things: names, identifiers, readable addresses, classifications and tags.",
  )
  .facets({ storage: { namespace: "identity", store: "main" } });

export const identityText = identity.properties({
  NameText: dryv.property.string().length({ min: 1, max: 1000 }),
  AddressSegment: dryv.property
    .string()
    .length({ min: 1, max: 200 })
    .pattern({ match: ["^[a-z0-9]+(-[a-z0-9]+)*$"] }),
});

/** Partitions shared by names and identifiers: the largest kinds alone, reference kinds together, the rest by default. */
const kindPartitions = (table: string) => ({
  strategy: "list" as const,
  keys: ["identityKind"] as const,
  partitions: [
    { name: `${table}_feature`, bound: { kind: "list" as const, values: ["feature"] } },
    { name: `${table}_individual`, bound: { kind: "list" as const, values: ["individual"] } },
    { name: `${table}_entity`, bound: { kind: "list" as const, values: ["entity"] } },
    { name: `${table}_instrument`, bound: { kind: "list" as const, values: ["instrument"] } },
    {
      name: `${table}_reference`,
      bound: {
        kind: "list" as const,
        values: ["country", "language", "currency", "unit", "timezone", "hierarchy", "level", "app"],
      },
    },
    { name: `${table}_other`, bound: { kind: "default" as const } },
  ],
});

/*---------------- identity.identities ----------------*/
export const Identities = identity
  .schema("Identities", {
    kind: dryv
      .field(identityProperties.IdentityKind)
      .description("What kind of named thing this is; fixed for the life of the identity."),
    code: dryv.field(sharedProperties.IdentityCode).description(codeDescription),
  })
  .extends(baseSchemas.Entity)
  .description(
    "The anchor of every named thing (country, feature, person, organisation, office, law, event). Extending tables use this id as their own primary key; it never carries display text.",
  )
  .role("entity");

Identities.facets({
  storage: dryv.storage("identities").unique("code").unique("id", "kind").index("kind"),
});

registerLinkTargets({ identities: Identities });

/*---------------- identity.names ----------------*/
export const Names = identity
  .schema("Names", {
    identityId: belongsTo(() => Identities).description("The named thing; with `identity_kind` a composite foreign key."),
    identityKind: dryv
      .field(identityProperties.IdentityKind)
      .description("Kind of the named thing, copied for list partitioning."),
    languageId: belongsTo(() => Languages).description(
      "Language of the text: any language, `mul` for a form shared by languages, never assumed English.",
    ),
    text: dryv.field(identityText.NameText),
    kindTerm: term(
      "idn.name.kind",
      "What the name is: preferred, official, short, local, alternative, historical, abbreviation, transliteration or definition.",
    ),
    scriptTerm: term("ref.script", "Writing system of the text (Latin, Ge'ez, Arabic).").maybe(),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("Set when the name is used in one country only."),
    ...periodFields,
    isDefault: dryv
      .field(sharedProperties.Flag)
      .description("The name shown when no other is asked for, in its language; at most one live default per language."),
  })
  .extends(baseSchemas.PartitionedEntity)
  .rule("NamePeriodIsOrdered", dryv.rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description(
    "Display names of named things in every language, with kind, script and valid period. Where a name came from is recorded in `source.evidence`.",
  )
  .role("entity");

Names.facets({
  storage: dryv
    .storage("names")
    .partitioning(kindPartitions("names"))
    .primaryKey("id", "identityKind")
    .indexes({
      description: "At most one current default name per identity and language.",
      fields: ["identityKind", "identityId", "languageId"],
      unique: true,
      where: identity.expression(
        "CurrentDefaultName",
        Names.check((v) => v.isDefault.eq(true).and(v.toYear.isNull(), v.deletedAt.isNull())),
      ),
    })
    .index("identityKind", "identityId")
    .index("languageId")
    .index("text")
    .references("NameOfIdentity", {
      fields: ["identityId", "identityKind"],
      target: () => Identities,
      targetFields: ["id", "kind"],
    }),
});

/*---------------- identity.identifiers ----------------*/
export const Identifiers = identity
  .schema("Identifiers", {
    identityId: belongsTo(() => Identities).description(
      "The identified thing; with `identity_kind` a composite foreign key.",
    ),
    identityKind: dryv
      .field(identityProperties.IdentityKind)
      .description("Kind of the identified thing, copied for list partitioning."),
    schemeTerm: term("idn.identifier.scheme", "The identifier system (ISO 3166, IEBC, Wikidata, a company registry)."),
    namespace: dryv
      .field(sharedProperties.NonEmptyString255)
      .maybe()
      .description("Sub-space inside the scheme where values repeat (a registry per country)."),
    value: dryv.field(sharedProperties.NonEmptyString500).description("The public identifier exactly as issued."),
    issuerId: belongsTo(() => Identities)
      .maybe()
      .description("The body that issued it, when known."),
    ...periodFields,
  })
  .extends(baseSchemas.PartitionedEntity)
  .rule("IdentifierPeriodIsOrdered", dryv.rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description(
    "Public identifiers of named things (ISO codes, IEBC codes, Wikidata ids, registration numbers). Personal identifiers such as national ID numbers are never stored.",
  )
  .role("entity");

Identifiers.facets({
  storage: dryv
    .storage("identifiers")
    .partitioning(kindPartitions("identifiers"))
    .primaryKey("id", "identityKind")
    .indexes(
      {
        description: "One live holder per scheme, namespace and value.",
        fields: ["identityKind", "schemeTerm", "namespace", "value"],
        unique: true,
        where: identity.expression(
          "LiveNamespacedIdentifier",
          Identifiers.check((v) => v.namespace.isNotNull().and(v.deletedAt.isNull())),
        ),
      },
      {
        description: "One live holder per scheme and value when there is no namespace.",
        fields: ["identityKind", "schemeTerm", "value"],
        unique: true,
        where: identity.expression(
          "LiveIdentifierWithoutNamespace",
          Identifiers.check((v) => v.namespace.isNull().and(v.deletedAt.isNull())),
        ),
      },
    )
    .index("identityKind", "identityId")
    .index("issuerId")
    .references("IdentifierOfIdentity", {
      fields: ["identityId", "identityKind"],
      target: () => Identities,
      targetFields: ["id", "kind"],
    }),
});

/*---------------- identity.addresses ----------------*/
export const Addresses = identity
  .schema("Addresses", {
    identityId: belongsTo(() => Identities, { onDelete: "cascade" }).description("The named thing this address opens."),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("The country address space; empty for global addresses."),
    segment: dryv
      .field(identityText.AddressSegment)
      .description("One readable URL path segment (`nairobi`); its namespace is the identity kind plus `section_term`."),
    sectionTerm: term(
      "idn.address.section",
      "Optional section where kinds share an address space (a person shown under leaders).",
    ).maybe(),
    parentId: belongsTo(dryv.self).maybe().description("The address this one sits under (`ke/nairobi/westlands`)."),
    languageId: belongsTo(() => Languages)
      .maybe()
      .description("Language of the segment when it is a translated form."),
    canonicalId: belongsTo(dryv.self)
      .maybe()
      .description("For an old or alternative address, the current address it redirects to."),
    ...periodFields,
  })
  .extends(baseSchemas.Entity)
  .description("Readable URL addresses of named things; dated rows keep old addresses resolving.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("addresses")
      .index("countryId", "parentId", "segment")
      .index("identityId")
      .index("canonicalId")
      .acyclic("AddressParentsHaveNoCycle", { field: "parentId" }),
  });

/*---------------- identity.classifications ----------------*/
export const Classifications = identity
  .schema("Classifications", {
    identityId: belongsTo(() => Identities, { onDelete: "cascade" }).description("The classified thing."),
    classTerm: belongsTo(() => Terms).description(
      "The answer: a term from any scheme whose scopes include the identity's kind (vocabulary.scopes).",
    ),
    schemeId: dryv
      .field(sharedProperties.Id)
      .description("The answer term's scheme, copied so the one-answer rule is a single index lookup."),
    ...periodFields,
  })
  .extends(baseSchemas.Entity)
  .rule("ClassificationPeriodIsOrdered", dryv.rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description(
    "Dated answers to questions about a named thing (UN region, feature function, office selection). Mzizi's code checks the scheme's scopes and one-answer rule.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("classifications")
      .unique("identityId", "classTerm", "fromYear")
      .index("classTerm")
      .index("identityId", "schemeId")
      .references("ClassificationTermInScheme", {
        fields: ["classTerm", "schemeId"],
        target: () => Terms,
        targetFields: ["id", "schemeId"],
      }),
  });

/*---------------- identity.tags ----------------*/
export const Tags = identity
  .schema("Tags", {
    identityId: belongsTo(() => Identities, { onDelete: "cascade" }).description("The tagged thing."),
    tagTerm: term("idn.tag", "The editorial tag, a term of the open tag scheme."),
  })
  .extends(baseSchemas.Association)
  .description("Loose editorial labels on named things, for related links and collections.")
  .role("entity")
  .facets({ storage: dryv.storage("tags").unique("identityId", "tagTerm").index("tagTerm") });
