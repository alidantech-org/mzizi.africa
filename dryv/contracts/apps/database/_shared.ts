import { failureProfile, mapFailure } from "@dryvcode/author";
import { sharedFailures as f } from "#/schemas/_shared.ts";

export const databaseHttp = failureProfile().http(
  mapFailure(f.Unauthorized, 401),
  mapFailure(f.Forbidden, 403),
  mapFailure(f.NotFound, 404),
  mapFailure(f.ValidationError, 422),
  mapFailure(f.InternalError, 500),
);
