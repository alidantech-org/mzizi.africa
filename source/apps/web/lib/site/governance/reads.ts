/** Generated request clients followed immediately by validation into named screen documents. */
import {
  listInstitutions,
  listInstitutionsRequest,
} from "#/lib/api/insights/list-institutions.ts";
import {
  getInstitution,
  getInstitutionRequest,
} from "#/lib/api/insights/get-institution.ts";
import { getGovernanceTabs } from "#/lib/api/insights/get-governance-tabs.ts";
import {
  getGovernanceTree,
  getGovernanceTreeRequest,
} from "#/lib/api/insights/get-governance-tree.ts";
import {
  getContent,
  getContentRequest,
} from "#/lib/api/insights/get-content.ts";
import {
  listContent,
  listContentRequest,
} from "#/lib/api/insights/list-content.ts";
import {
  getLegalBasis,
  getLegalBasisRequest,
} from "#/lib/api/insights/get-legal-basis.ts";
import {
  getCompareOptions,
  getCompareOptionsRequest,
} from "#/lib/api/insights/get-compare-options.ts";
import {
  getComparison,
  getComparisonRequest,
} from "#/lib/api/insights/get-comparison.ts";
import type { ClientResponse } from "#/lib/dryv/transport.ts";
import type { ContentInput } from "#/lib/types/content-input.ts";
import type { ContentListInput } from "#/lib/types/content-list-input.ts";
import type { GovTreeInput } from "#/lib/types/gov-tree-input.ts";
import type { InstitutionsInput } from "#/lib/types/institutions-input.ts";
import * as parse from "#/lib/site/governance/parse/documents.ts";

async function decoded<I, O>(
  pending: Promise<ClientResponse<I>>,
  decode: (input: I) => O,
): Promise<O> {
  const result = await pending;
  if (!result.success || result.body === null)
    throw new Error(
      result.message ||
        "This information could not be loaded. Please try again.",
    );
  return decode(result.body);
}
export const institutions = (input: InstitutionsInput = {}) =>
  decoded(
    listInstitutions(listInstitutionsRequest({ input })),
    parse.directory,
  );
export const institution = (code: string, languageCode: string) =>
  decoded(
    getInstitution(getInstitutionRequest({ code, input: { languageCode } })),
    parse.institution,
  );
export const treeOptions = (languageCode: string) =>
  decoded(getGovernanceTabs({ query: { languageCode } }), parse.options);
export const governanceTree = (input: GovTreeInput, languageCode: string) => {
  const request = getGovernanceTreeRequest({ input });
  return decoded(
    getGovernanceTree({
      ...request,
      query: { ...request.query, languageCode },
    }),
    parse.tree,
  );
};
export const content = (input: ContentInput) =>
  decoded(getContent(getContentRequest({ input })), parse.contentPage);
export const library = (input: ContentListInput = {}) =>
  decoded(listContent(listContentRequest({ input })), parse.library);
export const legalBasis = (subjectTable: string, subjectCode: string) =>
  decoded(
    getLegalBasis(
      getLegalBasisRequest({ input: { subjectTable, subjectCode } }),
    ),
    parse.legalBasis,
  );
export const compareOptions = (featureId: string, metric?: string) =>
  decoded(
    getCompareOptions(
      getCompareOptionsRequest({ input: { featureId, metric } }),
    ),
    parse.compareOptions,
  );
export const compare = (a: string, b: string, metrics?: string) =>
  decoded(
    getComparison(getComparisonRequest({ input: { a, b, metrics } })),
    parse.comparison,
  );
