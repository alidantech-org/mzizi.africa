import * as dryv from "@dryvcode/author";

import { shared, sharedProperties } from "./index.ts";

/**
 * Authorization requirements for the API's few writes (DEC-API-AUTH-RBAC). Roles come from a
 * verified bearer token claim; the runtime guard resolves them. Reads are public unless a contract
 * says otherwise.
 */
export const accessProperties = shared.properties({
  ActorRole: dryv.property.enum({
    reader: "reader",
    contributor: "contributor",
    reviewer: "reviewer",
    admin: "admin",
  }),
});

export const accessContextSchemas = shared.schemas({
  ActorContext: dryv.schema({
    actorId: dryv.field(sharedProperties.Id),
    role: dryv.field(accessProperties.ActorRole),
  }),
});

export const accessPolicies = shared.policies({
  ContributorAccess: dryv
    .policy()
    .description("Require a contributor, reviewer or admin.")
    .requires({ actor: accessContextSchemas.ActorContext }),
  ReviewerAccess: dryv
    .policy()
    .description("Require a reviewer or admin.")
    .requires({ actor: accessContextSchemas.ActorContext }),
  AdminAccess: dryv.policy().description("Require an admin.").requires({ actor: accessContextSchemas.ActorContext }),
});
