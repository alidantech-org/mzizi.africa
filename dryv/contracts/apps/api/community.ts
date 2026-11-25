/**
 * Module `community`: counted views from visitors, and published contributions about a named thing. Contributions
 * need a signed-in account and are published only after review; this module serves only published posts.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { Actors, community, Posts } from "#/schemas/postgres/community.ts";
import { Languages } from "#/schemas/postgres/reference.ts";
import { apiHttp, CACHE, MAX_PAGE, PageWindow } from "./_shared.ts";

const contributions = community.feature("Contributions").failureDefaults(apiHttp);
const counting = community.feature("Counting").failureDefaults(apiHttp);
const post = Posts.asRef();
const actor = Actors.asRef();
const language = Languages.asRef();

const communityApi = community.properties({
  Visitor: dryv.property.string().length({ min: 1, max: 600 }),
  SubjectCode: dryv.property.string().length({ min: 1, max: 255 }),
});

const IdentityPosts = community
  .schema("IdentityPosts", { countryId: dryv.field(p.Id), identityId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const shapes = community.schemas({
  ViewInput: dryv.schema({
    subjectCode: dryv.field(communityApi.SubjectCode).description("Code of the named thing or article viewed."),
    visitor: dryv
      .field(communityApi.Visitor)
      .description("Address and browser joined; hashed with a daily salt, never stored."),
  }),
  Recorded: dryv.schema({ recorded: dryv.field(p.Flag) }),
});

const q = contributions.queries({
  ScanPosts: dryv.readQuery
    .from(post)
    .input(IdentityPosts)
    .where((row, args) => [row.fields.countryId.eq(args.countryId), row.fields.identityId.eq(args.identityId)])
    .select((row) => ({
      postId: row.fields.id,
      kindTerm: row.fields.kindTerm,
      body: row.fields.body,
      rating: row.fields.rating,
      state: row.fields.state,
      languageCode: row.follow(post.fields.languageId, language).fields.code,
      handle: row.follow(post.fields.actorId, actor).fields.handle,
      displayName: row.follow(post.fields.actorId, actor).fields.displayName,
      publishedAt: row.fields.publishedAt,
    }))
    .orderBy((row) => [row.fields.publishedAt.order("desc"), row.fields.id.order("asc"), row.fields.countryId.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
});
export const communityQueries = q;
const rows = community.schemas({ PostEntry: dryv.schema.fromQuery(q.ScanPosts) });
export const communityRows = rows;
const io = community.schemas({ PostCollection: dryv.schema({ posts: dryv.field(rows.PostEntry).array() }) });

export const communityOperations = {
  ...contributions.operations({
    ListPosts: dryv
      .operation()
      .role("list")
      .description("Contributions about a named thing, newest first. The implementation returns published posts only.")
      .input(IdentityPosts)
      .output(io.PostCollection)
      .queryFromInput(q.ScanPosts, { envelope: { posts: "rows" } })
      .cache(CACHE.live)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/community/posts").input(input, dryv.queryObject()).output(output),
      })),
  }),
  ...counting.operations({
    RecordView: dryv
      .operation()
      .role("create")
      .description("A named thing or article was viewed; one view per visitor per day.")
      .input({ body: shapes.ViewInput })
      .output(shapes.Recorded)
      .facets(({ input, output }) => ({
        http: dryv.http("POST", "/v1/community/views").input(input.body, dryv.body()).output(output),
      })),
  }),
};
