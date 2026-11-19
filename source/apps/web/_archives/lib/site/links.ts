/** Addresses are built from the place's clean path (`nairobi/westlands`) and a section; the country itself has no path. */
export function placeAt(path: string | null | undefined, section: string): string {
  const parts = [path, section].filter((part): part is string => typeof part === "string" && part !== "");
  return `/${parts.join("/")}`;
}

/** An election's address: its kind and year (`/elections/general/2022`). */
export function electionAt(election: { kind: string; year: number }): string {
  return `/elections/${election.kind}/${election.year}`;
}

/** A leader's address: the person's slug (`/leaders/william-ruto`). */
export function leaderAt(leader: { leaderSlug?: string | null; holderId?: string | null; subjectId?: string | null }): string {
  return `/leaders/${leader.leaderSlug ?? leader.holderId ?? leader.subjectId ?? ""}`;
}
