
import type { ActorRole } from "#/types/shared/actor-role.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";

/** Actor Context */
export interface ActorContext {
  actorId: Id;
  role: ActorRole;
}