/** Calls a generated repository function with a plain input, converting it to the operation's DTO class. */
import { plainToInstance, type ClassConstructor } from "class-transformer";
import type { PersistenceRuntime } from "#/database/persistence/persistence.runtime";
import type { TrustedContext } from "#/database/persistence/persistence.types";
import { PUBLIC_CONTEXT } from "./localize";

type Repository<I, O> = (runtime: PersistenceRuntime, input: I, context: TrustedContext) => Promise<O>;

export function call<I extends object, O>(
  runtime: PersistenceRuntime,
  repository: Repository<I, O>,
  dto: ClassConstructor<I>,
  input: Partial<I>,
): Promise<O> {
  // Optional inputs that are not set are left out: the runtime accepts only finite JSON values.
  const defined = Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
  return repository(runtime, plainToInstance(dto, defined), PUBLIC_CONTEXT);
}
