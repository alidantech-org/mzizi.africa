/**
 * Schema: community | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 27.5 and 28 (approved 2026-11-25).
 * Contract authors: visitors read anonymously; every contribution (posts, reactions, media, articles) needs a signed-in
 * account and is published only after human review or automated filtering. Members are not identities. `posts` is
 * hash-partitioned by country; `views`, `notifications` and `dispatches` are range-partitioned by month, so links into
 * them carry their partition key.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { enums } from "#/schemas/_enums.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, byCountry, byMonth, identity, term } from "./_links.ts";
import { Accounts } from "./auth.ts";
import { Occurrences } from "./event.ts";
import { Features } from "./geography.ts";
import { Articles, Assets } from "./media.ts";
import { Keys } from "./product.ts";
import { Countries, Languages } from "./reference.ts";

export const community = dryv
  .group({ name: "community" })
  .description(
    "Visitors and members, their devices, consents, preferences and places, contributions and their moderation, follows and notifications.",
  )
  .facets({ storage: { namespace: "community", store: "main" } });

export const communityEnums = community.properties({
  ActorKind: dryv.property.enum(["visitor", "member"]),
  ActorStatus: dryv.property.enum(["active", "blocked", "closed"]),
  Platform: dryv.property.enum(["web", "android", "ios"]),
  AttestationStatus: dryv.property.enum(["none", "passed", "failed", "unavailable"]),
  PushProvider: dryv.property.enum(["fcm", "apns", "onesignal"]),
  ThemeChoice: dryv.property.enum(["system", "light", "dark"]),
  PostState: dryv.property.enum(["draft", "pending", "published", "rejected", "removed"]),
  LocationCheck: dryv.property.enum(["inside", "near", "outside", "unavailable", "suspected-mock"]),
  DispatchState: dryv.property.enum(["queued", "sent", "failed", "opened"]),
  Checker: dryv.property.enum(["ai", "rules", "human"]),
  Verdict: dryv.property.enum(["pass", "flag", "fail"]),
  Handle: dryv.property
    .string()
    .length({ min: 3, max: 30 })
    .pattern({ match: ["^[a-z][a-z0-9]*([._][a-z0-9]+)*$"] }),
  Rating: dryv.property.number.integer({ range: { min: 1, max: 5 } }),
  Body: dryv.property.string().length({ min: 1, max: 20000 }),
  TextVersion: dryv.property.string().length({ min: 1, max: 100 }),
});

/*---------------- community.actors ----------------*/
export const Actors = community
  .schema("Actors", {
    kind: dryv.field(communityEnums.ActorKind).description("visitor (anonymous) or member (signed in)."),
    status: dryv.field(communityEnums.ActorStatus),
    accountId: belongsTo(() => Accounts)
      .maybe()
      .description("The sign-in account; required for a member."),
    handle: dryv
      .field(communityEnums.Handle)
      .maybe()
      .description(
        "Public username: 3–30 of a–z, 0–9, . and _, starting with a letter, no doubled separators, stored lowercase, reserved names refused.",
      ),
    displayName: dryv.field(sharedProperties.NonEmptyString100).maybe().description("Free text shown beside the handle."),
    avatarId: belongsTo(() => Assets).maybe(),
    countryId: belongsTo(() => Countries).maybe(),
    languageId: belongsTo(() => Languages).maybe(),
    firstSeenAt: dryv.field(sharedProperties.Instant),
    lastSeenAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .rule("MemberHasAccount", (v) => v.kind.ne("member").or(v.accountId.isNotNull()))
  .rule("HandleIsForMembers", (v) => v.handle.isNull().or(v.kind.eq("member")))
  .description("A visitor or member; a member's public profile. Members are not identities.")
  .role("entity")
  .facets({ storage: dryv.storage("actors").unique("handle").unique("accountId").index("countryId") });

/*---------------- community.devices ----------------*/
export const Devices = community
  .schema("Devices", {
    actorId: belongsTo(() => Actors, { onDelete: "cascade" }),
    platform: dryv.field(communityEnums.Platform),
    fingerprintHash: dryv
      .field(sharedProperties.Sha256)
      .description("Hash of the device fingerprint; the fingerprint is not stored."),
    appVersion: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    attestation: dryv.field(communityEnums.AttestationStatus),
    firstSeenAt: dryv.field(sharedProperties.Instant),
    lastSeenAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .description("A device an actor uses.")
  .role("entity")
  .facets({ storage: dryv.storage("devices").unique("actorId", "fingerprintHash") });

/*---------------- community.tokens ----------------*/
export const Tokens = community
  .schema("Tokens", {
    deviceId: belongsTo(() => Devices, { onDelete: "cascade" }),
    provider: dryv.field(communityEnums.PushProvider),
    token: dryv.field(sharedProperties.NonEmptyString1000).sensitive().description("Push token, stored encrypted."),
    enabledAt: dryv.field(sharedProperties.Instant),
    revokedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("A push notification token of a device.")
  .role("entity")
  .facets({ storage: dryv.storage("tokens").index("deviceId") });

/*---------------- community.consents ----------------*/
export const Consents = community
  .schema("Consents", {
    actorId: belongsTo(() => Actors, { onDelete: "cascade" }),
    purposeTerm: term("com.consent.purpose", "analytics, notifications, location."),
    countryId: belongsTo(() => Countries).maybe(),
    keyId: belongsTo(() => Keys).description("The interface key of the consent text shown."),
    textVersion: dryv.field(communityEnums.TextVersion).description("Version of the consent text shown."),
    givenAt: dryv.field(sharedProperties.Instant),
    withdrawnAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("A consent an actor gave or withdrew, with the exact text version.")
  .role("entity")
  .facets({ storage: dryv.storage("consents").index("actorId", "purposeTerm") });

/*---------------- community.preferences ----------------*/
export const Preferences = community
  .schema("Preferences", {
    actorId: belongsTo(() => Actors, { onDelete: "cascade" }),
    countryId: belongsTo(() => Countries).maybe(),
    languageId: belongsTo(() => Languages).maybe(),
    theme: dryv.field(communityEnums.ThemeChoice).maybe(),
    homeFeatureId: belongsTo(() => Features)
      .maybe()
      .description("The place the actor calls home; drives local events and figures."),
  })
  .extends(baseSchemas.Entity)
  .description("An actor's saved country, language, theme and home place.")
  .role("entity")
  .facets({ storage: dryv.storage("preferences").unique("actorId") });

/*---------------- community.places ----------------*/
export const Places = community
  .schema("Places", {
    actorId: belongsTo(() => Actors, { onDelete: "cascade" }),
    featureId: belongsTo(() => Features),
    label: dryv.field(sharedProperties.NonEmptyString100).description("The member's own name for the place (home, work)."),
    suggestionTerm: term("com.place.suggestion", "home, work, family.").maybe(),
    isHome: dryv.field(sharedProperties.Flag),
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("A place an actor saved.")
  .role("entity")
  .facets({ storage: dryv.storage("places").unique("actorId", "featureId").index("featureId") });

/*---------------- community.proofs ----------------*/
export const Proofs = community
  .schema("Proofs", {
    actorId: belongsTo(() => Actors, { onDelete: "cascade" }),
    deviceId: belongsTo(() => Devices),
    matchedFeatureId: belongsTo(() => Features).maybe(),
    check: dryv.field(communityEnums.LocationCheck),
    accuracyMeters: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    coarseCell: dryv
      .field(sharedProperties.NonEmptyString100)
      .maybe()
      .description("A coarse grid cell; exact coordinates are not kept."),
    mockLocationDetected: dryv.field(sharedProperties.Flag),
    attestationOk: dryv.field(sharedProperties.Flag).maybe(),
    travelOk: dryv
      .field(sharedProperties.Flag)
      .maybe()
      .description("True when the movement since the last proof is plausible."),
    headerAgrees: dryv
      .field(sharedProperties.Flag)
      .maybe()
      .description("True when network location agrees with the device."),
    trustScore: dryv.field(sharedProperties.Percentage),
    recordedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .description("A location check that a contribution was made from where it claims.")
  .role("entity")
  .facets({ storage: dryv.storage("proofs").index("actorId").index("matchedFeatureId") });

/*---------------- community.posts ----------------*/
export const Posts = community
  .schema("Posts", {
    actorId: belongsTo(() => Actors),
    deviceId: belongsTo(() => Devices).maybe(),
    kind: dryv.field(enums.PostKind).description("comment, review, report, question."),
    body: dryv.field(communityEnums.Body).maybe(),
    languageId: belongsTo(() => Languages).maybe(),
    countryId: belongsTo(() => Countries).description("Partition key."),
    parentId: belongsTo(dryv.self).maybe().description("The post this one replies to, in the same country."),
    proofId: belongsTo(() => Proofs).maybe(),
    identityId: identity("The named thing the post is about.").maybe(),
    rating: dryv.field(communityEnums.Rating).maybe().description("1–5 for a review."),
    state: dryv.field(communityEnums.PostState).description("Nothing is published until reviewed or filtered."),
    publishedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.PartitionedEntity)
  .rule("PublishedPostHasTime", (v) => v.state.ne("published").or(v.publishedAt.isNotNull()))
  .description("Every contribution: comments, reviews, reports and questions from signed-in members.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("posts")
      .partitioning(byCountry("posts"))
      .primaryKey("id", "countryId")
      .index("countryId", "identityId", "state")
      .index("countryId", "actorId")
      .index("countryId", "parentId")
      .references("PostReplyOf", {
        fields: ["parentId", "countryId"],
        target: () => Posts,
        targetFields: ["id", "countryId"],
      }),
  });

/** A link into a post carries the post's country, the partition key of `posts`. */
const postLink = (meaning: string) => ({
  postId: dryv.field(sharedProperties.Id).maybe().description(meaning),
  postCountryId: belongsTo(() => Countries)
    .maybe()
    .description("The post's country, with `post_id` a composite foreign key."),
});
const postReference = () => ({
  fields: ["postId", "postCountryId"] as const,
  target: () => Posts,
  targetFields: ["id", "countryId"],
});

/*---------------- community.attachments ----------------*/
export const Attachments = community
  .schema("Attachments", {
    postId: belongsTo(() => Posts),
    postCountryId: belongsTo(() => Countries),
    assetId: belongsTo(() => Assets),
  })
  .extends(baseSchemas.Association)
  .description("Media attached to a post; reviewed with the post.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("attachments")
      .unique("postId", "assetId")
      .index("assetId")
      .references("AttachmentOfPost", postReference()),
  });

/*---------------- community.reactions ----------------*/
export const Reactions = community
  .schema("Reactions", {
    actorId: belongsTo(() => Actors, { onDelete: "cascade" }).description("A signed-in member; reactions need an account."),
    ...postLink("The post reacted to."),
    identityId: identity("The named thing reacted to.").maybe(),
    articleId: belongsTo(() => Articles).maybe(),
    kindTerm: term("com.reaction.kind", "like, helpful, agree."),
  })
  .extends(baseSchemas.Entity)
  .rule("ReactionHasOneSubject", rule.exactlyOne("postId", "identityId", "articleId"))
  .description("A member's reaction to a post, named thing or article.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("reactions")
      .index("actorId")
      .index("postId")
      .index("identityId")
      .index("articleId")
      .references("ReactionToPost", postReference()),
  });

/*---------------- community.views ----------------*/
export const Views = community
  .schema("Views", {
    day: dryv.field(sharedProperties.CalendarDate).description("Partition key: the day of the view."),
    visitorHash: dryv.field(sharedProperties.Sha256).description("Daily-salted hash; visitors are counted, not identified."),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("The viewer's country."),
    identityId: identity("The named thing viewed.").maybe(),
    articleId: belongsTo(() => Articles).maybe(),
    ...postLink("The post viewed."),
  })
  .extends(baseSchemas.PartitionedRecord)
  .rule("ViewHasOneSubject", rule.exactlyOne("identityId", "articleId", "postId"))
  .description("A counted view, kept for a limited time.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("views")
      .partitioning(byMonth("views", "day"))
      .primaryKey("id", "day")
      .index("day", "identityId")
      .index("day", "articleId")
      .references("ViewOfPost", postReference()),
  });

/*---------------- community.cases ----------------*/
export const Cases = community
  .schema("Cases", {
    postId: belongsTo(() => Posts),
    postCountryId: belongsTo(() => Countries),
    state: dryv.field(enums.CaseState).description("open, in review, decided or escalated."),
    reviewerAccountId: belongsTo(() => Accounts).maybe(),
    decision: dryv.field(enums.CaseDecision).description("approve, reject, remove, escalate.").maybe(),
    reason: dryv.field(sharedProperties.Description).maybe().description("Internal moderation note."),
    decidedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("The moderation of one post.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("cases")
      .index("postId")
      .index("state")
      .index("reviewerAccountId")
      .references("CaseOfPost", postReference()),
  });

/*---------------- community.checks ----------------*/
export const Checks = community
  .schema("Checks", {
    caseId: belongsTo(() => Cases, { onDelete: "cascade" }),
    checker: dryv.field(communityEnums.Checker).description("ai, rules or human."),
    verdict: dryv.field(communityEnums.Verdict).description("pass, flag or fail."),
    score: dryv.field(sharedProperties.Confidence).maybe(),
    categoryTerm: term("com.check.category", "spam, hate, misinformation.").maybe(),
    checkedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .description("One automated or human check of a moderation case.")
  .role("entity")
  .facets({ storage: dryv.storage("checks").index("caseId") });

/*---------------- community.blocks ----------------*/
export const Blocks = community
  .schema("Blocks", {
    accountId: belongsTo(() => Accounts),
    reasonTerm: term("com.block.reason", "spam, abuse, repeated misinformation."),
    caseId: belongsTo(() => Cases).maybe(),
    fromOn: dryv.field(sharedProperties.CalendarDate),
    toOn: dryv.field(sharedProperties.CalendarDate).maybe().description("Empty means permanent."),
    decidedBy: belongsTo(() => Accounts),
  })
  .extends(baseSchemas.Entity)
  .rule("BlockDatesAreOrdered", rule.ordered("fromOn", "toOn", { allowEqual: true }))
  .description("A block on an account that posted bad content; a blocked account cannot sign in or contribute.")
  .role("entity")
  .facets({ storage: dryv.storage("blocks").index("accountId", "fromOn") });

/*---------------- community.subscriptions ----------------*/
export const Subscriptions = community
  .schema("Subscriptions", {
    actorId: belongsTo(() => Actors, { onDelete: "cascade" }),
    identityId: identity("The named thing followed."),
    kind: dryv.field(enums.SubscriptionKind).description("follow, alerts."),
    revokedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("A named thing an actor follows.")
  .role("entity")
  .facets({ storage: dryv.storage("subscriptions").unique("actorId", "identityId", "kind").index("identityId") });

/*---------------- community.notifications ----------------*/
export const Notifications = community
  .schema("Notifications", {
    kind: dryv.field(enums.NotificationKind).description("new figure, event reminder, reply."),
    keyId: belongsTo(() => Keys).description("The interface key whose message is shown."),
    identityId: identity("The named thing the notification is about.").maybe(),
    ...postLink("The post the notification is about."),
    occurrenceId: belongsTo(() => Occurrences).maybe(),
  })
  .extends(baseSchemas.PartitionedRecord)
  .description("A notification to send; partitioned by month of creation.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("notifications")
      .partitioning(byMonth("notifications", "createdAt"))
      .primaryKey("id", "createdAt")
      .index("identityId")
      .references("NotificationOfPost", postReference()),
  });

/*---------------- community.dispatches ----------------*/
export const Dispatches = community
  .schema("Dispatches", {
    notificationId: belongsTo(() => Notifications),
    notificationCreatedAt: dryv.field(sharedProperties.Instant).description("The notification's partition key."),
    subscriptionId: belongsTo(() => Subscriptions),
    deviceId: belongsTo(() => Devices),
    state: dryv.field(communityEnums.DispatchState),
    sentAt: dryv.field(sharedProperties.Instant).maybe(),
    openedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.PartitionedRecord)
  .description("One sending of a notification to one device; partitioned by month.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("dispatches")
      .partitioning(byMonth("dispatches", "createdAt"))
      .primaryKey("id", "createdAt")
      .index("deviceId")
      .index("subscriptionId")
      .references("DispatchOfNotification", {
        fields: ["notificationId", "notificationCreatedAt"],
        target: () => Notifications,
        targetFields: ["id", "createdAt"],
      }),
  });

/*---------------- community.replies ----------------*/
export const Replies = community
  .schema("Replies", {
    postId: belongsTo(() => Posts),
    postCountryId: belongsTo(() => Countries),
    respondentId: identity("The office, institution or person replying officially."),
    body: dryv.field(communityEnums.Body),
    languageId: belongsTo(() => Languages),
    status: dryv.field(enums.ReplyStatus).description("received, published, withdrawn."),
    receivedAt: dryv.field(sharedProperties.Instant),
    publishedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("An official response to a post.")
  .role("entity")
  .facets({
    storage: dryv.storage("replies").index("postId").index("respondentId").references("ReplyToPost", postReference()),
  });
