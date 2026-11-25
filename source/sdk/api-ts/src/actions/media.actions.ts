"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { MediaArticleCollection } from "#sdk/types/media/dto/article-collection.ts";
import type { MediaArticleDetail } from "#sdk/types/media/dto/article-detail.ts";
import type { MediaIdentityMedia } from "#sdk/types/media/dto/identity-media.ts";
import type { MediaUseCollection } from "#sdk/types/media/dto/use-collection.ts";
/** GET /v1/media/articles/{code} */
export type MediaGetArticleActionInput = ActionInput<{ code: string }, never, never>;

export async function mediaGetArticle(input: MediaGetArticleActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.media.getArticle(input.params);
  return api.get<MediaArticleDetail>(path, options);
}
/** GET /v1/media/articles */
export type MediaListArticlesActionInput = ActionInput<never, MediaIdentityMedia, never>;

export async function mediaListArticles(input: MediaListArticlesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.media.listArticles;
  return api.get<MediaArticleCollection>(path, options);
}
/** GET /v1/media/assets */
export type MediaListAssetsActionInput = ActionInput<never, MediaIdentityMedia, never>;

export async function mediaListAssets(input: MediaListAssetsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.media.listAssets;
  return api.get<MediaUseCollection>(path, options);
}
