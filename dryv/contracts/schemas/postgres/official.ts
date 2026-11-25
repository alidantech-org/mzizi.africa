/**
 * Schema: official | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md section 25 (approved 2026-11-25).
 * Contract authors: private personal contacts are never stored; kinship and associate links only for public figures,
 * shown only when verified. Images are `media`; words and colours stay in `branding`.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { periodFields, periodProperties } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identity, identityKindField, identityProperties, identityReference, term } from "./_links.ts";
import { Names } from "./identity.ts";
import { Countries, Languages } from "./reference.ts";

export const official = dryv
  .group({ name: "official" })
  .description("Organisations and people of public life, their name parts, public contacts, relationships and branding.")
  .facets({ storage: { namespace: "official", store: "main" } });

const officialProperties = official.properties({
  NamePart: dryv.property.enum({ Prefix: "prefix", Given: "given", Middle: "middle", Family: "family", Suffix: "suffix" }),
  ContactValue: dryv.property.string().length({ min: 1, max: 1000 }),
  BrandText: dryv.property.string().length({ min: 1, max: 2000 }),
  HexColor: dryv.property.string().pattern({ match: ["^#[0-9a-fA-F]{6}$"] }),
});

/*---------------- official.entities ----------------*/
export const Entities = official
  .schema("Entities", {
    identityKind: identityKindField("entity"),
    kindTerm: term("ofc.entity.kind", "company, NGO, regional bloc, union, public body."),
    registrationCountryId: belongsTo(() => Countries)
      .maybe()
      .description("The country the organisation is registered in."),
    ...periodFields,
    registeredOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    dissolvedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("EntityKind", (v) => v.identityKind.eq("entity"))
  .rule("EntityPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .rule("EntityDatesAreOrdered", rule.ordered("registeredOn", "dissolvedOn", { allowEqual: true }))
  .description(
    "An organisation. Institutions, parties and publishers share their organisation's identity; regional bodies (EAC, AU) are entities with dated memberships.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("entities")
      .index("kindTerm")
      .index("registrationCountryId")
      .references("EntityIsIdentity", identityReference),
  });

/*---------------- official.individuals ----------------*/
export const Individuals = official
  .schema("Individuals", {
    identityKind: identityKindField("individual"),
    birthYear: dryv.field(periodProperties.Year).maybe(),
    deathYear: dryv.field(periodProperties.Year).maybe(),
    birthDate: dryv.field(sharedProperties.CalendarDate).maybe(),
    deathDate: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("IndividualKind", (v) => v.identityKind.eq("individual"))
  .rule("LifeYearsAreOrdered", rule.ordered("birthYear", "deathYear", { allowEqual: true }))
  .rule("LifeDatesAreOrdered", rule.ordered("birthDate", "deathDate", { allowEqual: true }))
  .description("A person in public life. Display names are `identity.names`; name parts are `official.parts`.")
  .role("entity")
  .facets({ storage: dryv.storage("individuals").references("IndividualIsIdentity", identityReference) });

/*---------------- official.parts ----------------*/
export const Parts = official
  .schema("Parts", {
    nameId: belongsTo(() => Names).description("The display name split here; with `name_kind` a composite key."),
    nameKind: dryv
      .field(identityProperties.IdentityKind)
      .default("individual")
      .description("Identity kind of the name's row, the partition key of `identity.names`."),
    part: dryv.field(officialProperties.NamePart).description("prefix, given, middle, family or suffix."),
    position: dryv.field(sharedProperties.NonNegativeInteger),
    text: dryv.field(sharedProperties.NonEmptyString255),
  })
  .extends(baseSchemas.Association)
  .description("The parts of a person's name (given, family), for sorting and formal display.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("parts")
      .unique("nameId", "position")
      .references("PartOfName", {
        fields: ["nameId", "nameKind"],
        target: () => Names,
        targetFields: ["id", "identityKind"],
      }),
  });

/*---------------- official.contacts ----------------*/
export const Contacts = official
  .schema("Contacts", {
    identityId: identity("The person, organisation, office, institution or party reached."),
    kindTerm: term("ofc.contact.kind", "phone, email, website, postal address, social account."),
    value: dryv.field(officialProperties.ContactValue),
    visibilityTerm: term("ofc.contact.visibility", "public or official business only; private contacts are never stored."),
    ...periodFields,
  })
  .extends(baseSchemas.Entity)
  .rule("ContactPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description("A public or official-business contact of a named thing.")
  .role("entity")
  .facets({ storage: dryv.storage("contacts").index("identityId", "kindTerm") });

/*---------------- official.relationships ----------------*/
export const Relationships = official
  .schema("Relationships", {
    fromId: identity("The first person or organisation."),
    toId: identity("The second person or organisation."),
    kindTerm: term("ofc.relationship.kind", "kinship, business or political tie."),
    basisTerm: term("ofc.relationship.basis", "The kind of evidence the tie rests on."),
    statusTerm: term("ofc.relationship.status", "Verification status; shown only when verified."),
    sharePercentage: dryv.field(sharedProperties.Percentage).maybe(),
    confidence: dryv.field(sharedProperties.Confidence).maybe(),
    ...periodFields,
    startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("RelationshipIsNotSelf", rule.differs("fromId", "toId"))
  .rule("RelationshipDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description("A kinship, business or political tie between public figures and organisations, always with a source link.")
  .role("entity")
  .facets({ storage: dryv.storage("relationships").index("fromId", "kindTerm").index("toId", "kindTerm") });

/*---------------- official.branding ----------------*/
export const Branding = official
  .schema("Branding", {
    identityId: identity("The organisation, party or person branded."),
    kindTerm: term("ofc.branding.kind", "slogan, motto, colours, symbol."),
    text: dryv.field(officialProperties.BrandText).maybe(),
    languageId: belongsTo(() => Languages)
      .maybe()
      .description("Language of `text`."),
    colors: dryv.field(officialProperties.HexColor).array().maybe().description("Hex colour values, used by charts."),
    ...periodFields,
  })
  .extends(baseSchemas.Entity)
  .rule("BrandTextHasLanguage", (v) => v.text.isNull().or(v.languageId.isNotNull()))
  .description("Words and colours of a named thing (slogan, motto, party colours); images are `media`.")
  .role("entity")
  .facets({ storage: dryv.storage("branding").index("identityId", "kindTerm") });
