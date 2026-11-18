/**
 * Schema: community | Database: mzizi
 * What visitors do: an anonymous device actor (or an account), consent, preferences and saved places, likes and
 * deduplicated views, mobile-only posts with location proof and moderation, subscriptions and push delivery.
 * Design: .docs/design/architecture/USER_INTERACTIONS_AND_TRUST.md (proposal; legal review required before launch).
 * Personal data is minimised: fingerprints are salted hashes, positions are matched to a place and kept coarse,
 * and no email or phone is collected.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { subjectFields } from "#/schemas/_subjects.ts";
import { Accounts } from "./auth.ts";
import { Features } from "./geography.ts";
import { Country, Language, Value } from "./reference.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const community = dryv
  .group({ name: "community" })
  .description(
    "Visitors as device actors: consent, preferences, saved places, reactions, posts, moderation, subscriptions and push.",
  )
  .facets({ storage: { namespace: "community", store: "main" } });

export const communityEnums = community.properties({
  ActorKind: dryv.property.enum(["device", "account"]),
  ActorStatus: dryv.property.enum(["active", "blocked", "closed"]),
  Platform: dryv.property.enum(["web", "android", "ios"]),
  AttestationStatus: dryv.property.enum(["none", "passed", "failed", "unavailable"]),
  PushProvider: dryv.property.enum(["fcm", "apns", "onesignal"]),
  ThemeChoice: dryv.property.enum(["system", "light", "dark"]),
  ModerationState: dryv.property.enum([
    "received",
    "filtered",
    "pending_review",
    "published",
    "held",
    "rejected",
    "removed",
    "appealed",
  ]),
  LocationCheck: dryv.property.enum(["inside", "near", "outside", "unavailable", "suspected_mock"]),
  DeliveryState: dryv.property.enum(["queued", "sent", "failed", "opened"]),
});

/*---------------- community.actors ----------------*/
export const Actors = community
  .schema("Actors", {
    kind: dryv.field(communityEnums.ActorKind),
    status: dryv.field(communityEnums.ActorStatus),
    /** Set only when an account is linked; absent for anonymous device actors. */
    accountId: belongsTo(() => Accounts).maybe(),
    countryId: belongsTo(() => Country).maybe(),
    languageId: belongsTo(() => Language).maybe(),
    firstSeenAt: dryv.field(sharedProperties.Instant),
    lastSeenAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .description(
    "A visitor identity the server issues: anonymous by default, tied to an account only if one is linked later. No name, email or phone is held.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("actors").index("accountId").index("countryId").index("lastSeenAt") });

/*---------------- community.devices ----------------*/
export const Devices = community
  .schema("Devices", {
    actorId: belongsTo(() => Actors),
    platform: dryv.field(communityEnums.Platform),
    /** Salted one-way hash of the device fingerprint; used to deduplicate and rate-limit, never to identify a person. */
    fingerprintHash: dryv.field(sharedProperties.Sha256),
    appVersion: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    attestation: dryv.field(communityEnums.AttestationStatus),
    firstSeenAt: dryv.field(sharedProperties.Instant),
    lastSeenAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .description("One device or browser seen for an actor, identified only by a salted fingerprint hash.")
  .role("entity")
  .facets({ storage: dryv.storage("devices").unique("actorId", "fingerprintHash").index("fingerprintHash") });

/*---------------- community.push_tokens ----------------*/
export const Tokens = community
  .schema("Tokens", {
    deviceId: belongsTo(() => Devices),
    provider: dryv.field(communityEnums.PushProvider),
    token: dryv.field(sharedProperties.NonEmptyString1000),
    enabledAt: dryv.field(sharedProperties.Instant),
    revokedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("A push address for a mobile device, kept only while the visitor has notifications enabled.")
  .role("entity")
  .facets({ storage: dryv.storage("tokens").unique("provider", "token").index("deviceId") });

/*---------------- community.consents ----------------*/
export const Consents = community
  .schema("Consents", {
    actorId: belongsTo(() => Actors),
    /** Scheme com.consent.purpose: device identity for likes, analytics, location for posting, push notifications, personalisation. */
    purposeId: belongsTo(() => Value).tags("scheme:ref.sch.com.consent.purpose"),
    countryId: belongsTo(() => Country).maybe(),
    /** The version of the wording shown, so what was agreed to can be shown again. */
    textVersion: dryv.field(sharedProperties.NonEmptyString100),
    givenAt: dryv.field(sharedProperties.Instant),
    withdrawnAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One consent given or withdrawn by an actor for one purpose, with the wording version shown.")
  .role("entity")
  .facets({ storage: dryv.storage("consents").index("actorId", "purposeId").index("countryId") });

/*---------------- community.preferences ----------------*/
export const Preferences = community
  .schema("Preferences", {
    actorId: belongsTo(() => Actors),
    countryId: belongsTo(() => Country).maybe(),
    languageId: belongsTo(() => Language).maybe(),
    theme: dryv.field(communityEnums.ThemeChoice).maybe(),
    /** The place the home page opens on; the saved place marked as home keeps it in step. */
    homeFeatureId: belongsTo(() => Features).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("What an actor chose: country, language, theme and home place. The server renders pages in these.")
  .role("entity")
  .facets({ storage: dryv.storage("preferences").unique("actorId").index("homeFeatureId") });

/*---------------- community.saved_places ----------------*/
export const Places = community
  .schema("Places", {
    actorId: belongsTo(() => Actors),
    featureId: belongsTo(() => Features),
    /** The visitor's own text (Home, Work, Mama's farm), prefilled from the suggestion and editable. */
    label: dryv.field(sharedProperties.NonEmptyString100),
    /** Scheme com.place.label: the suggestion the label started from, in suggestion order. */
    suggestionId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.com.place.label"),
    isHome: dryv.field(sharedProperties.Flag),
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description(
    "A place an actor keeps, with a free-text label. The place unit is stored, never GPS coordinates. At most one is the home place.",
  )
  .role("entity");

const homePlace = community.expression(
  "HomePlace",
  Places.check((v) => v.isHome.eq(true)),
);

Places.facets({
  storage: dryv.storage("places").unique("actorId", "featureId").unique("actorId").where(homePlace).index("featureId"),
});

/*---------------- community.reactions ----------------*/
export const Reactions = community
  .schema("Reactions", {
    actorId: belongsTo(() => Actors),
    /** Scheme com.reaction.kind: like. More kinds can be added as values. */
    kindId: belongsTo(() => Value).tags("scheme:ref.sch.com.reaction.kind"),
    ...subjectFields,
  })
  .extends(baseSchemas.Entity)
  .description("One reaction (a like) by one actor to one subject; one per actor, kind and subject, reversible.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("reactions")
      .unique("actorId", "kindId", "subjectTable", "subjectId")
      .index("subjectTable", "subjectId"),
  });

/*---------------- community.views ----------------*/
export const Views = community
  .schema("Views", {
    ...subjectFields,
    day: dryv.field(sharedProperties.CalendarDate),
    /** Salted hash of network address and browser for that day only; no cookie and no stable identifier. */
    visitorHash: dryv.field(sharedProperties.Sha256),
    countryId: belongsTo(() => Country).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description(
    "One visitor-day of viewing one subject, deduplicated by a daily-rotating hash. Counts are derived from these rows.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("views").unique("subjectTable", "subjectId", "day", "visitorHash").index("day") });

/*---------------- community.location_proofs ----------------*/
export const Proofs = community
  .schema("Proofs", {
    actorId: belongsTo(() => Actors),
    deviceId: belongsTo(() => Devices),
    /** The place the position fell in or near; the raw position is not kept by default. */
    matchedFeatureId: belongsTo(() => Features).maybe(),
    check: dryv.field(communityEnums.LocationCheck),
    accuracyMeters: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    /** A rounded grid cell code, coarser than the position, for review. */
    coarseCell: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    mockLocationDetected: dryv.field(sharedProperties.Flag),
    /** 0 to 100: how far the signals support the claim of being there. Not proof. */
    trustScore: dryv.field(sharedProperties.Percentage),
    /** The signals behind the score (attestation, travel plausibility, country header agreement). */
    signals: dryv.field(sharedProperties.JsonText).maybe(),
    recordedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .description(
    "The evidence that a poster was in or near the place they posted about, with a trust score. A signal, never proof.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("proofs").index("actorId").index("deviceId").index("matchedFeatureId") });

/*---------------- community.interactions ----------------*/
export const Posts = community
  .schema("Posts", {
    actorId: belongsTo(() => Actors),
    deviceId: belongsTo(() => Devices),
    ...subjectFields,
    /** Scheme com.interaction.kind: comment, opinion, evidence, image, ground-truth report, error report, data request, classification correction. */
    kindId: belongsTo(() => Value).tags("scheme:ref.sch.com.interaction.kind"),
    body: dryv.field(sharedProperties.NonEmptyString).maybe(),
    languageId: belongsTo(() => Language).maybe(),
    countryId: belongsTo(() => Country).maybe(),
    parentInteractionId: belongsTo(() => Posts).maybe(),
    locationProofId: belongsTo(() => Proofs).maybe(),
    /** The office asked, for a data request. */
    addresseeFeatureId: belongsTo(() => Features).maybe(),
    state: dryv.field(communityEnums.ModerationState),
    publishedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description(
    "One thing an actor posted about a subject: a comment, evidence, an opinion, a photo, a ground-truth report, a correction or a data request. Never canonical data until reviewed; media attach to it as to any subject.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("posts")
      .index("subjectTable", "subjectId")
      .index("actorId")
      .index("deviceId")
      .index("kindId")
      .index("state")
      .index("parentInteractionId")
      .index("locationProofId"),
  });

/*---------------- community.moderation_cases ----------------*/
export const Cases = community
  .schema("Cases", {
    interactionId: belongsTo(() => Posts),
    /** Results of the automatic filters (abuse, personal data, spam, image checks); a proposal, not a decision. */
    filterResults: dryv.field(sharedProperties.JsonText).maybe(),
    state: dryv.field(communityEnums.ModerationState),
    reviewerAccountId: belongsTo(() => Accounts).maybe(),
    /** Scheme com.moderation.decision: publish, hold, reject, remove, legal takedown. */
    decisionId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.com.moderation.decision"),
    reason: dryv.field(sharedProperties.Description).maybe(),
    decidedAt: dryv.field(sharedProperties.Instant).maybe(),
    appealedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("The moderation record of one interaction: filter results, the reviewer, the decision and any appeal.")
  .role("entity")
  .facets({ storage: dryv.storage("cases").index("interactionId").index("state").index("reviewerAccountId") });

/*---------------- community.subscriptions ----------------*/
export const Subscriptions = community
  .schema("Subscriptions", {
    actorId: belongsTo(() => Actors),
    ...subjectFields,
    /** Scheme com.subscription.kind: updates, events, results, new tenders, rescheduling. */
    kindId: belongsTo(() => Value).tags("scheme:ref.sch.com.subscription.kind"),
    revokedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description(
    "An actor following one subject (a place, leader, project, election, tender, institution, supplier, event) for one kind of update.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("subscriptions")
      .unique("actorId", "subjectTable", "subjectId", "kindId")
      .index("subjectTable", "subjectId"),
  });

/*---------------- community.notifications ----------------*/
export const Notifications = community
  .schema("Notifications", {
    ...subjectFields,
    /** Scheme com.notification.kind: new content, result declared, event rescheduled, tender published, contract awarded. */
    kindId: belongsTo(() => Value).tags("scheme:ref.sch.com.notification.kind"),
    /** The copy key and the values filled in, so each recipient reads it in their language. */
    copyKey: dryv.field(sharedProperties.IdentityCode),
    payload: dryv.field(sharedProperties.JsonText).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description(
    "Something that happened to a subject and may be sent to followers; the wording is copy, filled per recipient.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("notifications").index("subjectTable", "subjectId").index("kindId") });

/*---------------- community.notification_deliveries ----------------*/
export const Deliveries = community
  .schema("Deliveries", {
    notificationId: belongsTo(() => Notifications),
    subscriptionId: belongsTo(() => Subscriptions),
    deviceId: belongsTo(() => Devices),
    state: dryv.field(communityEnums.DeliveryState),
    sentAt: dryv.field(sharedProperties.Instant).maybe(),
    openedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("DeliverySentBeforeOpened", rule.ordered("sentAt", "openedAt", { allowEqual: true }))
  .description("The delivery of one notification to one device for one subscription.")
  .role("entity")
  .facets({
    storage: dryv.storage("deliveries").unique("notificationId", "deviceId").index("subscriptionId").index("state"),
  });
