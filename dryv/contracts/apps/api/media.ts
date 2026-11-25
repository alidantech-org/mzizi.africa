/**
 * Module `media`: articles and assets that belong to a named thing, with their texts and captions in every language.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Versions } from "#/schemas/postgres/filesystem.ts";
import { Articles, Assets, Captions, media, Texts, Uses } from "#/schemas/postgres/media.ts";
import { Languages } from "#/schemas/postgres/reference.ts";
import { apiHttp, CACHE, MAX_PAGE, PageWindow } from "./_shared.ts";

const library = media.feature("Library").failureDefaults(apiHttp);
const article = Articles.asRef();
const text = Texts.asRef();
const asset = Assets.asRef();
const caption = Captions.asRef();
const use = Uses.asRef();
const version = Versions.asRef();
const language = Languages.asRef();

const IdentityMedia = media
  .schema("IdentityMedia", { identityId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const ArticleKey = media.schema("ArticleKey", { code: dryv.field(p.IdentityCode) }).asRef();

const q = library.queries({
  ScanArticles: dryv.readQuery
    .from(article)
    .input(IdentityMedia)
    .where((row, args) => [row.fields.identityId.eq(args.identityId)])
    .select((row) => ({
      articleId: row.fields.id,
      code: row.fields.code,
      categoryTerm: row.fields.categoryTerm,
      publishedAt: row.fields.publishedAt,
      titles: row.reverse(text.fields.articleId, text).select(
        (t) => ({
          title: t.fields.title,
          summary: t.fields.summary,
          origin: t.fields.origin,
          status: t.fields.status,
          languageCode: t.follow(text.fields.languageId, language).fields.code,
        }),
        (t) => [t.fields.origin.order("asc"), t.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.publishedAt.order("desc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  FindArticle: dryv.readQuery
    .from(article)
    .input(ArticleKey)
    .where((row, args) => [row.fields.code.eq(args.code)])
    .select((row) => ({
      articleId: row.fields.id,
      code: row.fields.code,
      identityId: row.fields.identityId,
      categoryTerm: row.fields.categoryTerm,
      publishedAt: row.fields.publishedAt,
      texts: row.reverse(text.fields.articleId, text).select(
        (t) => ({
          title: t.fields.title,
          summary: t.fields.summary,
          body: t.fields.body,
          origin: t.fields.origin,
          status: t.fields.status,
          languageCode: t.follow(text.fields.languageId, language).fields.code,
        }),
        (t) => [t.fields.origin.order("asc"), t.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.id.order("asc")])
    .zeroOrOne(),
  ScanUses: dryv.readQuery
    .from(use)
    .input(IdentityMedia)
    .where((row, args) => [row.fields.identityId.eq(args.identityId)])
    .select((row) => ({
      assetId: row.fields.assetId,
      purposeTerm: row.fields.purposeTerm,
      position: row.fields.position,
      kind: row.follow(use.fields.assetId, asset).fields.kind,
      kindTerm: row.follow(use.fields.assetId, asset).fields.kindTerm,
      s3Key: row.follow(use.fields.assetId, asset).follow(asset.fields.versionId, version).fields.s3Key,
      externalUrl: row.follow(use.fields.assetId, asset).fields.externalUrl,
      embedUrl: row.follow(use.fields.assetId, asset).fields.embedUrl,
      thumbnailUrl: row.follow(use.fields.assetId, asset).fields.thumbnailUrl,
      width: row.follow(use.fields.assetId, asset).fields.width,
      height: row.follow(use.fields.assetId, asset).fields.height,
      captions: row
        .follow(use.fields.assetId, asset)
        .reverse(caption.fields.assetId, caption)
        .select(
          (c) => ({
            title: c.fields.title,
            altText: c.fields.altText,
            languageCode: c.follow(caption.fields.languageId, language).fields.code,
          }),
          (c) => [c.fields.id.order("asc")],
        ),
    }))
    .orderBy((row) => [row.fields.purposeTerm.order("asc"), row.fields.position.order("asc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
});
export const mediaQueries = q;
const rows = media.schemas({
  ArticleEntry: dryv.schema.fromQuery(q.ScanArticles),
  ArticleDetail: dryv.schema.fromQuery(q.FindArticle),
  UseEntry: dryv.schema.fromQuery(q.ScanUses),
});
export const mediaRows = rows;
const io = media.schemas({
  ArticleCollection: dryv.schema({ articles: dryv.field(rows.ArticleEntry).array() }),
  UseCollection: dryv.schema({ uses: dryv.field(rows.UseEntry).array() }),
});

export const mediaOperations = library.operations({
  ListArticles: dryv
    .operation()
    .role("list")
    .description("The articles for a named thing, newest first, with their titles in every language.")
    .input(IdentityMedia)
    .output(io.ArticleCollection)
    .queryFromInput(q.ScanArticles, { envelope: { articles: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/media/articles").input(input, dryv.queryObject()).output(output),
    })),
  GetArticle: dryv
    .operation()
    .role("detail")
    .description("One article with its texts in every language; machine translations are marked by origin.")
    .input(ArticleKey)
    .output(rows.ArticleDetail)
    .queryFromInput(q.FindArticle, { missing: f.NotFound })
    .cache(CACHE.structure)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/media/articles/{code}").input(inputField("code"), dryv.path()).output(output),
    })),
  ListAssets: dryv
    .operation()
    .role("list")
    .description("The photos, logos, flags and videos that illustrate a named thing, with captions.")
    .input(IdentityMedia)
    .output(io.UseCollection)
    .queryFromInput(q.ScanUses, { envelope: { uses: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/media/assets").input(input, dryv.queryObject()).output(output),
    })),
});
