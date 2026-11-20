/** Compile-only assertions: required identities and filters cannot disappear at the SDK boundary. */
import type {
  GetExplorerContextInput,
  SearchExplorerPlacesInput,
  ResolveExplorerCoordinatesInput,
} from "@mzizi/api-client/actions/explorer.actions.ts";
import type { GetLocalityInput } from "@mzizi/api-client/actions/locality.actions.ts";
export function verifyClientContracts() {
  const country: GetExplorerContextInput = { query: { countryCode: "KE" } };
  const optionalLanguage: GetLocalityInput = { params: { featureId: "identity" } };
  // @ts-expect-error Explicit country query is required.
  const missingCountry: GetExplorerContextInput = {};
  // @ts-expect-error Search text is required.
  const missingQuery: SearchExplorerPlacesInput = { query: { countryCode: "KE" } };
  // @ts-expect-error Coordinate bodies require both axes.
  const missingLongitude: ResolveExplorerCoordinatesInput = { body: { latitude: 0 } };
  return { country, optionalLanguage, missingCountry, missingQuery, missingLongitude };
}
