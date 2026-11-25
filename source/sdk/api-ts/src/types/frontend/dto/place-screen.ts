import type { FrontendArticleLink } from "#sdk/types/frontend/dto/article-link.ts";
import type { FrontendCountryLink } from "#sdk/types/frontend/dto/country-link.ts";
import type { FrontendEventLink } from "#sdk/types/frontend/dto/event-link.ts";
import type { FrontendFigure } from "#sdk/types/frontend/dto/figure.ts";
import type { FrontendLanguageOption } from "#sdk/types/frontend/dto/language-option.ts";
import type { FrontendLeader } from "#sdk/types/frontend/dto/leader.ts";
import type { FrontendPlaceLink } from "#sdk/types/frontend/dto/place-link.ts";
import type { FrontendProjectLink } from "#sdk/types/frontend/dto/project-link.ts";

/** Place Screen */
export interface FrontendPlaceScreen {
  articles: FrontendArticleLink[];
  breadcrumb: FrontendPlaceLink[];
  children: FrontendPlaceLink[];
  country: FrontendCountryLink;
  events: FrontendEventLink[];
  figures: FrontendFigure[];
  language: string;
  languages: FrontendLanguageOption[];
  leaders: FrontendLeader[];
  place: FrontendPlaceLink;
  projects: FrontendProjectLink[];
}
