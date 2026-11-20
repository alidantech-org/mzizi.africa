/** Prefix every internal demo link, including links supplied by local prototype datasets. */
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { demoHref } from "#demo/_lib/navigation/base";
export default function DemoLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const destination =
    typeof href === "string" ? demoHref(href) : { ...href, pathname: href.pathname ? demoHref(href.pathname) : href.pathname };
  return <NextLink {...props} href={destination} />;
}
