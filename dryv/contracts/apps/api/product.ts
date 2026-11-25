/**
 * Module `product`: interface messages for an app and language, and the sites and releases that serve countries.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Apps, Keys, Messages, product, productProperties, Releases, Sites } from "#/schemas/postgres/product.ts";
import { Countries, Languages } from "#/schemas/postgres/reference.ts";
import { apiHttp, CACHE, MAX_PAGE, PageWindow } from "./_shared.ts";

const copy = product.feature("Copy").failureDefaults(apiHttp);
const serving = product.feature("Serving").failureDefaults(apiHttp);
const key = Keys.asRef();
const message = Messages.asRef();
const language = Languages.asRef();
const site = Sites.asRef();
const release = Releases.asRef();
const app = Apps.asRef();
const country = Countries.asRef();

const MessageWindow = product
  .schema("MessageWindow", { appCode: dryv.field(p.IdentityCode), lang: dryv.field(p.IdentityCode) })
  .extends(PageWindow)
  .asRef();
const SiteKey = product.schema("SiteKey", { host: dryv.field(productProperties.Host) }).asRef();
const ReleaseWindow = product.schema("ReleaseWindow", {}).extends(PageWindow).asRef();

const q = {
  ...copy.queries({
    ScanMessages: dryv.readQuery
      .from(message)
      .input(MessageWindow)
      .where((row, args) => [
        row.follow(message.fields.keyId, key).follow(key.fields.appId, app).fields.code.eq(args.appCode),
        row.follow(message.fields.languageId, language).fields.code.eq(args.lang),
      ])
      .select((row) => ({
        key: row.follow(message.fields.keyId, key).fields.code,
        text: row.fields.text,
        countryId: row.fields.countryId,
        origin: row.fields.origin,
        status: row.fields.status,
      }))
      .orderBy((row) => [row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: 5000 })),
  }),
  ...serving.queries({
    FindSite: dryv.readQuery
      .from(site)
      .input(SiteKey)
      .where((row, args) => [row.fields.host.eq(args.host)])
      .select((row) => ({
        siteId: row.fields.id,
        code: row.fields.code,
        host: row.fields.host,
        status: row.fields.status,
        appCode: row.follow(site.fields.appId, app).fields.code,
        countryId: row.fields.countryId,
        countryCode: row.follow(site.fields.countryId, country).fields.code,
        localeId: row.fields.localeId,
      }))
      .orderBy((row) => [row.fields.id.order("asc")])
      .zeroOrOne(),
    ScanReleases: dryv.readQuery
      .from(release)
      .input(ReleaseWindow)
      .select((row) => ({
        releaseId: row.fields.id,
        appCode: row.follow(release.fields.appId, app).fields.code,
        countryId: row.fields.countryId,
        countryCode: row.follow(release.fields.countryId, country).fields.code,
        status: row.fields.status,
        fromOn: row.fields.fromOn,
      }))
      .orderBy((row) => [row.fields.fromOn.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  }),
};
export const productQueries = q;
const rows = product.schemas({
  MessageEntry: dryv.schema.fromQuery(q.ScanMessages),
  SiteDetail: dryv.schema.fromQuery(q.FindSite),
  ReleaseEntry: dryv.schema.fromQuery(q.ScanReleases),
});
export const productRows = rows;
const io = product.schemas({
  MessageCollection: dryv.schema({ messages: dryv.field(rows.MessageEntry).array() }),
  ReleaseCollection: dryv.schema({ releases: dryv.field(rows.ReleaseEntry).array() }),
});

export const productOperations = {
  ...copy.operations({
    ListMessages: dryv
      .operation()
      .role("list")
      .description("The interface messages of an app in one language; missing keys are gaps the UI shows as keys.")
      .input(MessageWindow)
      .output(io.MessageCollection)
      .queryFromInput(q.ScanMessages, { envelope: { messages: "rows" } })
      .cache(CACHE.reference)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/product/messages").input(input, dryv.queryObject()).output(output),
      })),
  }),
  ...serving.operations({
    GetSite: dryv
      .operation()
      .role("detail")
      .description("The site served on a host, with its app, country and default locale.")
      .input(SiteKey)
      .output(rows.SiteDetail)
      .queryFromInput(q.FindSite, { missing: f.NotFound })
      .cache(CACHE.reference)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/product/site").input(input, dryv.queryObject()).output(output),
      })),
    ListReleases: dryv
      .operation()
      .role("list")
      .description("Which countries are served on which app, and since when.")
      .input(ReleaseWindow)
      .output(io.ReleaseCollection)
      .queryFromInput(q.ScanReleases, { envelope: { releases: "rows" } })
      .cache(CACHE.reference)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/product/releases").input(input, dryv.queryObject()).output(output),
      })),
  }),
};
