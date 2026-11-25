import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";
import type { ArticleLink } from "#/modules/frontend/schema/interface/article-link.interface.ts";
import type { CountryLink } from "#/modules/frontend/schema/interface/country-link.interface.ts";
import type { EventLink } from "#/modules/frontend/schema/interface/event-link.interface.ts";
import type { Figure } from "#/modules/frontend/schema/interface/figure.interface.ts";
import type { LanguageOption } from "#/modules/frontend/schema/interface/language-option.interface.ts";
import type { Leader } from "#/modules/frontend/schema/interface/leader.interface.ts";
import type { PlaceLink } from "#/modules/frontend/schema/interface/place-link.interface.ts";
import type { ProjectLink } from "#/modules/frontend/schema/interface/project-link.interface.ts";

/** Place Screen */
export interface PlaceScreen {
  articles: ArticleLink[];
  breadcrumb: PlaceLink[];
  children: PlaceLink[];
  country: CountryLink;
  events: EventLink[];
  figures: Figure[];
  language: LanguageCode;
  languages: LanguageOption[];
  leaders: Leader[];
  place: PlaceLink;
  projects: ProjectLink[];
}
