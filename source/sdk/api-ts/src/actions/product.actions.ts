"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { ProductMessageCollection } from "#sdk/types/product/dto/message-collection.ts";
import type { ProductMessageWindow } from "#sdk/types/product/dto/message-window.ts";
import type { ProductReleaseCollection } from "#sdk/types/product/dto/release-collection.ts";
import type { ProductReleaseWindow } from "#sdk/types/product/dto/release-window.ts";
import type { ProductSiteDetail } from "#sdk/types/product/dto/site-detail.ts";
import type { ProductSiteKey } from "#sdk/types/product/dto/site-key.ts";
/** GET /v1/product/site */
export type ProductGetSiteActionInput = ActionInput<never, ProductSiteKey, never>;

export async function productGetSite(input: ProductGetSiteActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.product.getSite;
  return api.get<ProductSiteDetail>(path, options);
}
/** GET /v1/product/messages */
export type ProductListMessagesActionInput = ActionInput<never, ProductMessageWindow, never>;

export async function productListMessages(input: ProductListMessagesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.product.listMessages;
  return api.get<ProductMessageCollection>(path, options);
}
/** GET /v1/product/releases */
export type ProductListReleasesActionInput = ActionInput<never, ProductReleaseWindow, never>;

export async function productListReleases(input: ProductListReleasesActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.product.listReleases;
  return api.get<ProductReleaseCollection>(path, options);
}
