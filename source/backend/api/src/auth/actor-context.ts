import { AsyncLocalStorage } from "node:async_hooks";

import type { Role } from "#/auth/roles";

/** Who is acting. Always taken from the verified token, never from a request body. */
export interface Actor {
  actorId: string;
  role: Role;
}

const storage = new AsyncLocalStorage<Actor>();

export function currentActor(): Actor | undefined {
  return storage.getStore();
}

/** For use cases that write: the actor, or a clear failure if no guard ran. */
export function requireActor(): Actor {
  const actor = storage.getStore();
  if (!actor) throw new Error("no authenticated actor in context: the auth guard did not run");
  return actor;
}

/** For tests: run a function as an actor. */
export function runAsActor<T>(actor: Actor, run: () => T): T {
  return storage.run(actor, run);
}
