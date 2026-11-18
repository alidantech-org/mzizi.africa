import type { ReactNode } from "react";

/** One link of the sidebar. The label is already in the visitor's language; the icon is a ready element. */
export interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon?: ReactNode;
}

/** A titled group of links in the sidebar. */
export interface NavGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly NavItem[];
}

/** One step of the breadcrumbs: a link, except the last which is the current page. */
export interface Crumb {
  readonly label: string;
  readonly href?: string;
}
