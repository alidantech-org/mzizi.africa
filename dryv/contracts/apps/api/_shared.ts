/**
 * Conventions shared by every user-facing API operation (`.docs/design/architecture/API_MODULES.md`).
 *
 * The API is a product surface, not a database mirror. Each feature opts in to the HTTP failure mapping once with
 * `failureDefaults(apiHttp)`; every list takes a bounded page window; every displayed text reaches the frontend as a
 * `LocalizedText` composed by the `frontend` module; schema modules return raw rows with all their names.
 */
import * as dryv from "@dryvcode/author";
import { shared, sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Identities, Names } from "#/schemas/postgres/identity.ts";
import { Languages } from "#/schemas/postgres/reference.ts";

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

/** Cache lifetimes (seconds) by how often the data changes; keys always include every input and the language. */
export const CACHE = {
  /** Reference data and vocabulary: changes with a release. */
  reference: { ttl: 21_600 },
  /** Places, institutions and structure: changes with a data load. */
  structure: { ttl: 3_600 },
  /** Figures, results and money: changes with a data load; invalidated by refreshes. */
  figures: { ttl: 1_800 },
  /** Contributions and counts: changes all the time. */
  live: { ttl: 60 },
} as const;

export const apiProperties = shared.properties({
  /** Language as shown to readers: ISO 639-1 where it exists, else the language row code. */
  LanguageCode: dryv.property.string().length({ min: 1, max: 255 }),
  TextDirection: dryv.property.enum({ Ltr: "ltr", Rtl: "rtl" }),
  SearchText: dryv.property.string().length({ min: 1, max: 200 }),
});

/**
 * Every displayed text (FOUNDATION_REDESIGN section 7.3): the chosen text, its language, whether it is a fallback and
 * its direction, so the UI can mark "shown in English" and set direction. Chosen by the frontend module from the
 * requested language, then the country's locales, then `mul`, then `en`, then any.
 */
export const sharedShapes = shared.schemas({
  LocalizedText: dryv.schema({
    text: dryv.field(p.NonEmptyString1000),
    language: dryv.field(apiProperties.LanguageCode),
    isFallback: dryv.field(p.Flag),
    direction: dryv.field(apiProperties.TextDirection),
  }),
});

/** The language a reader asked for; every frontend read takes it and it is part of every cache key. */
export const LanguageChoice = shared
  .schema("LanguageChoice", { lang: dryv.field(p.IdentityCode).optional() })
  .abstract()
  .asRef();

const identityRef = Identities.asRef();
const nameRef = Names.asRef();
const languageRef = Languages.asRef();

/** All names of an identity row, defaults first: the frontend module chooses one per reader. */
export function namesOf(row: dryv.QueryRow<typeof identityRef extends dryv.SchemaRef<infer F> ? F : never>) {
  return row.reverse(nameRef.fields.identityId, nameRef).select(
    (n) => ({
      text: n.fields.text,
      languageCode: n.follow(nameRef.fields.languageId, languageRef).fields.code,
      languageIso: n.follow(nameRef.fields.languageId, languageRef).fields.iso6391,
      kindTerm: n.fields.kindTerm,
      isDefault: n.fields.isDefault,
      fromYear: n.fields.fromYear,
      toYear: n.fields.toYear,
    }),
    (n) => [n.fields.isDefault.order("desc"), n.fields.id.order("asc"), n.fields.identityKind.order("asc")],
  );
}

export { identityRef, languageRef, nameRef };
