import * as dryv from "@dryvcode/author";

import { accessProperties } from "../../foundation/shared/access.ts";
import { optionalId, plainId, recorded, relationTo, searchable, systemRecord } from "../../foundation/shared/builders.ts";
import { readSurface } from "../../foundation/shared/read-surface.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * People and identity (PEOPLE_DESIGN.md).
 *
 * `person` models every real human the research concerns, outside any role: names, profile,
 * contacts and public handles, each with an exposure level the API enforces. `identity` models
 * platform accounts and grants; it is private and has no public endpoints. They link by plain id.
 * Portraits and other media are filesystem attachments, not columns here.
 */
export const person = dryv.group({ name: "person" }).description("Real people: individuals, names, profiles, contacts and public handles.").tags("public", "person").facets({ storage: { namespace: "person" } });
export const identity = dryv.group({ name: "identity" }).description("Platform accounts and role grants. Private: no public endpoints.").tags("identity").facets({ storage: { namespace: "identity" } });

export const personProperties = person.properties({
  LifeStatus: dryv.property.enum({ alive: "alive", deceased: "deceased", unknown: "unknown" }),
  NameKind: dryv.property.enum({ legal: "legal", common: "common", honorific: "honorific", alias: "alias", transliteration: "transliteration", birth: "birth" }),
  ContactKind: dryv.property.enum({ email: "email", phone: "phone", postal: "postal", website: "website", messaging: "messaging" }),
  /** Who may be shown the value. The public API serves only `public`. */
  Exposure: dryv.property.enum({ public: "public", restricted: "restricted", private: "private" }),
  ContactValue: dryv.property.string().length({ min: 1, max: 500 }),
  HandleName: dryv.property.string().length({ min: 1, max: 200 }),
  Occupation: dryv.property.string().length({ min: 1, max: 300 }),
});

export const identityProperties = identity.properties({
  AccountStatus: dryv.property.enum({ active: "active", suspended: "suspended", closed: "closed" }),
  Issuer: dryv.property.string().length({ min: 1, max: 500 }),
  Subject: dryv.property.string().length({ min: 1, max: 255 }),
});

/* ----------------------------------- person ------------------------------------ */

const individuals = person.schemas({
  Person: recorded(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      displayName: dryv.field(sharedProperties.Name).query(searchable),
      givenName: dryv.field(sharedProperties.Name).optional().nullable(),
      familyName: dryv.field(sharedProperties.Name).optional().nullable(),
      birthDate: dryv.field(sharedProperties.Date).optional().nullable().query({ filter: ["between"] }),
      birthDatePrecision: dryv.field(sharedProperties.DatePrecision).optional().nullable(),
      deathDate: dryv.field(sharedProperties.Date).optional().nullable(),
      deathDatePrecision: dryv.field(sharedProperties.DatePrecision).optional().nullable(),
      lifeStatus: dryv.field(personProperties.LifeStatus).query({ filter: ["equal"] }),
      birthPlaceId: optionalId(),
    },
    "individuals",
    [{ name: "idx_individual_code", fields: ["code"], unique: true }],
  ),
});

const details = person.schemas({
  PersonName: recorded(
    {
      personId: relationTo(() => individuals.Person.field("id")),
      name: dryv.field(sharedProperties.Name).query({ filter: ["contains"], search: true }),
      kind: dryv.field(personProperties.NameKind).query({ filter: ["equal"] }),
      language: dryv.field(sharedProperties.Label).optional().nullable(),
    },
    "names",
    [{ name: "idx_person_name_person", fields: ["personId"] }],
  ),

  PersonProfile: recorded(
    {
      personId: relationTo(() => individuals.Person.field("id")),
      summary: dryv.field(sharedProperties.Description).optional().nullable(),
      biography: dryv.field(sharedProperties.LongText).optional().nullable(),
      occupation: dryv.field(personProperties.Occupation).optional().nullable().query({ filter: ["contains"], search: true }),
      nationalityId: optionalId(),
      language: dryv.field(sharedProperties.Label).optional().nullable(),
    },
    "profiles",
    [{ name: "idx_person_profile_person", fields: ["personId"] }],
  ),

  /** A way to reach a person or, with officeId, a public office they hold. Only public values are served. */
  PersonContact: recorded(
    {
      personId: relationTo(() => individuals.Person.field("id")),
      officeId: optionalId(),
      kind: dryv.field(personProperties.ContactKind).query({ filter: ["equal", "in"] }),
      value: dryv.field(personProperties.ContactValue),
      label: dryv.field(sharedProperties.Label).optional().nullable(),
      exposure: dryv.field(personProperties.Exposure).query({ filter: ["equal", "in"] }),
    },
    "contacts",
    [{ name: "idx_person_contact_person", fields: ["personId", "exposure"] }],
  ),

  /** A social media or platform identity. The platform is a classification record. */
  PersonHandle: recorded(
    {
      personId: relationTo(() => individuals.Person.field("id")),
      platformId: plainId(),
      handle: dryv.field(personProperties.HandleName).query({ filter: ["equal", "startsWith"], search: true }),
      url: dryv.field(sharedProperties.Url).optional().nullable(),
      isVerified: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
      exposure: dryv.field(personProperties.Exposure).query({ filter: ["equal", "in"] }),
    },
    "handles",
    [{ name: "idx_person_handle_person", fields: ["personId", "exposure"] }],
  ),
});

const id = () => dryv.field(sharedProperties.Id).optional();
const personRead = person.feature("PersonRead").description("Public read access to people, names, profiles, public contacts and public handles.").tags("public");
const personSurfaces = [
  readSurface(person, { singular: "Person", plural: "People", itemKey: "person", listKey: "people", path: "/people/individuals", idParam: "personId", entity: individuals.Person, description: "people", filters: { lifeStatus: dryv.field(personProperties.LifeStatus).optional(), q: dryv.field(sharedProperties.Name).optional() } }),
  readSurface(person, { singular: "PersonName", plural: "PersonNames", itemKey: "personName", listKey: "personNames", path: "/people/names", idParam: "personNameId", entity: details.PersonName, description: "person names", filters: { personId: id(), kind: dryv.field(personProperties.NameKind).optional(), q: dryv.field(sharedProperties.Name).optional() } }),
  readSurface(person, { singular: "PersonProfile", plural: "PersonProfiles", itemKey: "profile", listKey: "profiles", path: "/people/profiles", idParam: "profileId", entity: details.PersonProfile, description: "person profiles", filters: { personId: id(), q: dryv.field(sharedProperties.Name).optional() } }),
  readSurface(person, { singular: "PersonContact", plural: "PersonContacts", itemKey: "contact", listKey: "contacts", path: "/people/contacts", idParam: "contactId", entity: details.PersonContact, description: "public person contacts", filters: { personId: id(), officeId: id(), kind: dryv.field(personProperties.ContactKind).optional() } }),
  readSurface(person, { singular: "PersonHandle", plural: "PersonHandles", itemKey: "handle", listKey: "handles", path: "/people/handles", idParam: "handleId", entity: details.PersonHandle, description: "public person handles", filters: { personId: id(), platformId: id() } }),
];
export const personReadOperations = personRead.operations(Object.assign({}, ...personSurfaces.map((surface) => surface.operations)));

/* ---------------------------------- identity ----------------------------------- */

const accounts = identity.schemas({
  Account: systemRecord(
    {
      issuer: dryv.field(identityProperties.Issuer).query({ filter: ["equal"] }),
      subject: dryv.field(identityProperties.Subject).query({ filter: ["equal"] }),
      personId: optionalId(),
      status: dryv.field(identityProperties.AccountStatus).query({ filter: ["equal", "in"] }),
      lastSeenAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
    },
    "accounts",
    [{ name: "idx_account_issuer_subject", fields: ["issuer", "subject"], unique: true }, { name: "idx_account_person", fields: ["personId"] }],
  ),
});

export const identityGrantSchemas = identity.schemas({
  AccountGrant: recorded(
    {
      accountId: relationTo(() => accounts.Account.field("id")),
      role: dryv.field(accessProperties.ActorRole).query({ filter: ["equal", "in"] }),
      jurisdictionId: optionalId(),
      grantedBy: optionalId(),
    },
    "grants",
    [{ name: "idx_grant_account", fields: ["accountId", "role"] }],
  ),
});
