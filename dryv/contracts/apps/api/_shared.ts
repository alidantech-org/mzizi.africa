/**
 * Conventions shared by every user-facing API operation.
 *
 * The API is a product surface: it answers people and clients (account, feedback, reads over verified
 * data); it is not a database mirror. Each feature opts in to the HTTP failure mapping once with
 * `failureDefaults(apiHttp)`, and every list takes a page window.
 */
import * as dryv from "@dryvcode/author";
import { shared, sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";

/** Failure to HTTP status mapping used by every API feature. */
export const apiHttp = dryv
  .failureProfile()
  .http(
    dryv.mapFailure(f.BadRequest, 400),
    dryv.mapFailure(f.Unauthorized, 401),
    dryv.mapFailure(f.Forbidden, 403),
    dryv.mapFailure(f.NotFound, 404),
    dryv.mapFailure(f.ValidationError, 422),
    dryv.mapFailure(f.InternalError, 500),
  );

/** The paging fields every list input extends: 50 rows from the start unless the caller says otherwise. */
export const PageWindow = shared
  .schema("PageWindow", {
    limit: dryv.field(p.Integer).optional().default(50),
    offset: dryv.field(p.Integer).optional().default(0),
  })
  .abstract()
  .asRef();

/** The largest page any list returns. */
export const MAX_PAGE = 200;
