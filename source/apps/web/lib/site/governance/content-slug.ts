
/** Next route segments may retain an encoded slash; decode once before the generated query builder encodes it. */
export function contentSlug(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    throw new Error(
      "This article address is not valid. Return to the knowledge library.",
    );
  }
}
