import type { useRouter } from "next/navigation";

/** Changes only the query of the current page (search text, level, page of a list). `ListRefresh` has the server read the lists again. */
export function replaceQuery(router: ReturnType<typeof useRouter>, href: string) {
  router.replace(href, { scroll: false });
}
