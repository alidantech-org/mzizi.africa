/**
 * Interactions of the web: likes and views, nothing else. The web is read-only for content (USER_INTERACTIONS_AND_TRUST):
 * these are the only writes it may make. A visitor is a device actor the server creates on the first like; the web sends an
 * opaque random device identifier it keeps in a cookie, and the server stores only a salted hash of it. A view is counted
 * once per visitor per day by a daily-rotating salted hash of the address and browser, never kept in readable form.
 * Counts are derived from the rows; the web shows likes and does not show views.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { apiHttp } from "./_shared.ts";

export const interactions = dryv.group({ name: "interactions" }).description("Likes and views by anonymous device actors.");
const feature = interactions.feature("Interactions").failureDefaults(apiHttp);

const props = interactions.properties({
  /** The subject's table, one of the tables a visitor may react to. */
  Table: dryv.property.string().length({ min: 3, max: 100 }),
  /** The subject by its identity or its code. */
  Ref: dryv.property.string().length({ min: 1, max: 200 }),
  /** An opaque random identifier the web keeps in a cookie; the server stores only a salted hash of it. */
  DeviceId: dryv.property.string().length({ min: 16, max: 128 }),
  /** The address and browser of the visit, joined; hashed with a daily salt on arrival and never stored. */
  Visitor: dryv.property.string().length({ min: 1, max: 600 }),
});

const inputs = interactions.schemas({
  EngagementInput: dryv.schema({
    subjectTable: dryv.field(props.Table),
    subjectRef: dryv.field(props.Ref),
    deviceId: dryv.field(props.DeviceId).optional(),
  }),
  LikeInput: dryv.schema({
    subjectTable: dryv.field(props.Table),
    subjectRef: dryv.field(props.Ref),
    deviceId: dryv.field(props.DeviceId),
  }),
  ViewInput: dryv.schema({
    subjectTable: dryv.field(props.Table),
    subjectRef: dryv.field(props.Ref),
    visitor: dryv.field(props.Visitor),
  }),
});

const documents = interactions.schemas({
  Engagement: dryv.schema({ likes: dryv.field(p.NonNegativeInteger), liked: dryv.field(p.Flag) }),
  Recorded: dryv.schema({ recorded: dryv.field(p.Flag) }),
});

export const interactionOperations = feature.operations({
  GetEngagement: dryv
    .operation()
    .role("detail")
    .description("How many likes a subject has, and whether this device has liked it. Views are counted and not returned.")
    .input(inputs.EngagementInput)
    .output(documents.Engagement)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/engagement").input(input, dryv.queryObject()).output(output),
    })),

  Like: dryv
    .operation()
    .role("create")
    .description("This device likes a subject; liking twice changes nothing.")
    .input({ body: inputs.LikeInput })
    .output(documents.Engagement)
    .facets(({ input, output }) => ({
      http: dryv.http("POST", "/v1/likes").input(input.body, dryv.body()).output(output),
    })),

  Unlike: dryv
    .operation()
    .role("create")
    .description("This device withdraws its like.")
    .input({ body: inputs.LikeInput })
    .output(documents.Engagement)
    .facets(({ input, output }) => ({
      http: dryv.http("POST", "/v1/likes/remove").input(input.body, dryv.body()).output(output),
    })),

  RecordView: dryv
    .operation()
    .role("create")
    .description("A subject was viewed; one view per visitor per day.")
    .input({ body: inputs.ViewInput })
    .output(documents.Recorded)
    .facets(({ input, output }) => ({
      http: dryv.http("POST", "/v1/views").input(input.body, dryv.body()).output(output),
    })),
});
