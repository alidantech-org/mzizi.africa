import * as dryv from "@dryvcode/author";

import { optionalId, plainId, recorded, relationTo, searchable } from "../../foundation/shared/builders.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Places, occupancy, expected presence and contact points (.docs/design/data/PLACES_AND_PRESENCE_ASSESSMENT.md).
 *
 * Four domain-neutral capabilities shared by every domain that needs "where":
 *  - `place.places`: one self-referencing tree of physical places (site, structure, floor, wing, room, unit, service point);
 *  - `place.occupancies` and `place.occupancy_links`: who uses which place, for which role and period, and how one use
 *    gave way to another (move, split, merge);
 *  - `place.expectations`: where a presence is expected to exist before any place is known; it never holds an address;
 *  - `contact.points`: contact channels at any scope, with a fallback walk up the scope chain.
 *
 * None of these carries a source column: evidence is `source.attributions` and `source.verifications` on the target
 * kinds `place.places`, `place.occupancies`, `place.occupancy_links`, `place.expectations` and `contact.points`.
 * Subjects, scopes and geography units are plain ids (soft references checked by the database engine's integrity jobs).
 */
export const place = dryv
  .group({ name: "place" })
  .description("Physical places, occupancy, expected presence.")
  .tags("public", "place")
  .facets({ storage: { namespace: "place" } });
export const contact = dryv
  .group({ name: "contact" })
  .description("Contact points at any scope.")
  .tags("public", "contact")
  .facets({ storage: { namespace: "contact" } });

export const placeProperties = place.properties({
  /** Position in the place tree. A site is a compound or plot; structures, floors, wings, rooms and units nest inside. */
  PlaceKind: dryv.property.enum({
    site: "site",
    structure: "structure",
    floor: "floor",
    wing: "wing",
    room: "room",
    unit: "unit",
    servicePoint: "service_point",
  }),
  /** Lifecycle of the place itself, independent of who occupies it. */
  PlaceStatus: dryv.property.enum({ planned: "planned", inUse: "in_use", vacant: "vacant", closed: "closed", demolished: "demolished" }),
  OccupancyStatus: dryv.property.enum({ expected: "expected", active: "active", moved: "moved", closed: "closed" }),
  OccupancyLinkKind: dryv.property.enum({ move: "move", split: "split", merge: "merge" }),
  /** Why a presence is expected: a legal rule, a plan or a recurring pattern. */
  ExpectationBasis: dryv.property.enum({ legalRule: "legal_rule", plan: "plan", pattern: "pattern" }),
  ExpectationStatus: dryv.property.enum({
    expected: "expected",
    researching: "researching",
    identified: "identified",
    noDetailsFound: "no_details_found",
    notApplicable: "not_applicable",
    ceased: "ceased",
  }),
  Latitude: dryv.property.number.decimal({ precision: 9, scale: 6 }),
  Longitude: dryv.property.number.decimal({ precision: 9, scale: 6 }),
});

const places = place.schemas({
  /** A physical place: a site, or something inside one. Exists only with evidence; its status is its own. */
  Place: recorded(
    {
      kind: dryv.field(placeProperties.PlaceKind).query({ filter: ["equal", "in"] }),
      status: dryv.field(placeProperties.PlaceStatus).query({ filter: ["equal", "in"] }),
      name: dryv.field(sharedProperties.Name).query(searchable),
      /** Containing place; null for a site. */
      parentId: optionalId(),
      /** Classification of the building (hospital block, office tower), when known. */
      buildingTypeId: optionalId(),
      /** The geography unit that contains the place. Containment only, never jurisdiction. */
      locatedInUnitId: optionalId(),
      addressText: dryv.field(sharedProperties.LongText).optional().nullable(),
      latitude: dryv.field(placeProperties.Latitude).optional().nullable(),
      longitude: dryv.field(placeProperties.Longitude).optional().nullable(),
      availableFrom: dryv.field(sharedProperties.Date).optional().nullable(),
    },
    "places",
    [
      { name: "idx_place_parent", fields: ["parentId"] },
      { name: "idx_place_located_in", fields: ["locatedInUnitId"] },
      { name: "idx_place_kind_status", fields: ["kind", "status"] },
    ],
  ),
});

const occupancies = place.schemas({
  /** A subject (any record, by kind and id) uses a place, structure or space for a role during a period. */
  Occupancy: recorded(
    {
      subjectKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
      subjectId: plainId(),
      placeId: relationTo(() => places.Place.field("id")),
      roleId: plainId(),
      status: dryv.field(placeProperties.OccupancyStatus).query({ filter: ["equal", "in"] }),
    },
    "occupancies",
    [
      { name: "idx_occupancy_subject", fields: ["subjectKind", "subjectId"] },
      { name: "idx_occupancy_place", fields: ["placeId"] },
    ],
  ),
});

const links = place.schemas({
  /** One occupancy giving way to another. Many predecessors or successors express a split or a merge. */
  OccupancyLink: recorded(
    {
      predecessorId: relationTo(() => occupancies.Occupancy.field("id")),
      successorId: plainId(),
      kind: dryv.field(placeProperties.OccupancyLinkKind).query({ filter: ["equal"] }),
    },
    "occupancy_links",
    [
      { name: "idx_occupancy_link_pair", fields: ["predecessorId", "successorId"], unique: true },
      { name: "idx_occupancy_link_successor", fields: ["successorId"] },
    ],
  ),
});

const expectations = place.schemas({
  /** Where a presence should exist. It never contains an address; once identified it points at the resolving occupancy. */
  Expectation: recorded(
    {
      subjectKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
      subjectId: plainId(),
      roleId: plainId(),
      scopeGeoUnitId: optionalId(),
      facilityTypeId: optionalId(),
      minCount: dryv.field(sharedProperties.Count),
      maxCount: dryv.field(sharedProperties.Count).optional().nullable(),
      basis: dryv.field(placeProperties.ExpectationBasis).query({ filter: ["equal", "in"] }),
      status: dryv.field(placeProperties.ExpectationStatus).query({ filter: ["equal", "in"] }),
      resolvedOccupancyId: optionalId(),
    },
    "expectations",
    [
      { name: "idx_expectation_subject", fields: ["subjectKind", "subjectId"] },
      { name: "idx_expectation_scope", fields: ["scopeGeoUnitId"] },
      { name: "idx_expectation_status", fields: ["status"] },
    ],
  ),
});

export const contactProperties = contact.properties({
  ContactChannel: dryv.property.enum({ phone: "phone", email: "email", fax: "fax", postal: "postal", messaging: "messaging" }),
  ContactVisibility: dryv.property.enum({ public: "public", restricted: "restricted", internal: "internal" }),
  ContactValue: dryv.property.string().length({ min: 1, max: 500 }),
});

const points = contact.schemas({
  /** A contact channel at any scope (an institution, a place, a unit, a post). A missing scope falls back to the next one up. */
  ContactPoint: recorded(
    {
      scopeKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
      scopeId: plainId(),
      channel: dryv.field(contactProperties.ContactChannel).query({ filter: ["equal", "in"] }),
      value: dryv.field(contactProperties.ContactValue),
      label: dryv.field(sharedProperties.Label).optional().nullable(),
      visibility: dryv.field(contactProperties.ContactVisibility).query({ filter: ["equal", "in"] }),
    },
    "points",
    [{ name: "idx_contact_point_scope", fields: ["scopeKind", "scopeId", "channel"] }],
  ),
});

export { places, occupancies, links, expectations, points };
