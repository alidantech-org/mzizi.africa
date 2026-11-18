/** Generated server actions followed immediately by validation into named screen documents. */
import { listInstitutions } from "@mzizi/api-client/actions/insights/list-institutions.actions.ts";
import { getInstitution } from "@mzizi/api-client/actions/insights/get-institution.actions.ts";
import { getGovernanceTabs } from "@mzizi/api-client/actions/insights/get-governance-tabs.actions.ts";
import { getGovernanceTree } from "@mzizi/api-client/actions/insights/get-governance-tree.actions.ts";
import { getContent } from "@mzizi/api-client/actions/insights/get-content.actions.ts";
import { listContent } from "@mzizi/api-client/actions/insights/list-content.actions.ts";
import { getLegalBasis } from "@mzizi/api-client/actions/insights/get-legal-basis.actions.ts";
import { getCompareOptions } from "@mzizi/api-client/actions/insights/get-compare-options.actions.ts";
import { getComparison } from "@mzizi/api-client/actions/insights/get-comparison.actions.ts";
import type { ContentInput } from "#/lib/types/content-input.ts";
import type { ContentListInput } from "#/lib/types/content-list-input.ts";
import type { GovTreeInput } from "#/lib/types/gov-tree-input.ts";
import type { InstitutionsInput } from "#/lib/types/institutions-input.ts";
import * as parse from "#/lib/site/governance/parse/documents.ts";

interface Outcome<I> { readonly success: boolean; readonly body: I | null; readonly message?: string }

async function decoded<I, O>(pending: Promise<Outcome<I>>, decode: (input: I) => O): Promise<O> {
  const result = await pending;
  if (!result.success || result.body === null) throw new Error(result.message || "This information could not be loaded. Please try again.");
  return decode(result.body);
}
const opt = <T extends object>(o: T): Partial<T> =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== "")) as Partial<T>;

export const institutions = (input: InstitutionsInput = {}) => decoded(listInstitutions({ query: opt(input) }), parse.directory);
export const institution = (code: string, _languageCode?: string) => decoded(getInstitution({ params: { code } }), parse.institution);
export const treeOptions = (_languageCode?: string) => decoded(getGovernanceTabs({}), parse.options);
export const governanceTree = (input: GovTreeInput, _languageCode?: string) => decoded(getGovernanceTree({ query: opt(input) }), parse.tree);
export const content = (input: ContentInput) => decoded(getContent({ query: opt(input) }), parse.contentPage);
export const library = (input: ContentListInput = {}) => decoded(listContent({ query: opt(input) }), parse.library);
export const legalBasis = (subjectTable: string, subjectCode: string) => decoded(getLegalBasis({ query: { subjectTable, subjectCode } }), parse.legalBasis);
export const compareOptions = (featureId: string, metric?: string) => decoded(getCompareOptions({ query: { featureId, ...opt({ metric }) } }), parse.compareOptions);
export const compare = (a: string, b: string, metrics?: string) => decoded(getComparison({ query: { a, b, ...opt({ metrics }) } }), parse.comparison);
