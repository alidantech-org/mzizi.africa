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
import type { InsightsInstitutionList } from "@mzizi/api-client/types/insights/institution-list.ts";
import type { InsightsInstitutionDetail } from "@mzizi/api-client/types/insights/institution-detail.ts";
import type { InsightsGovernanceTabs } from "@mzizi/api-client/types/insights/governance-tabs.ts";
/** The tree's nodes are one object per `type` (root, arm, body, leader); the hand type narrows them by that tag. */
import type { GovernanceTree } from "#/lib/site/governance/contracts.ts";
import type { InsightsContentPage } from "@mzizi/api-client/types/insights/content-page.ts";
import type { InsightsContentList } from "@mzizi/api-client/types/insights/content-list.ts";
import type { InsightsLegalBasis } from "@mzizi/api-client/types/insights/legal-basis.ts";
import type { InsightsCompareOptions } from "@mzizi/api-client/types/insights/compare-options.ts";
import type { InsightsComparison } from "@mzizi/api-client/types/insights/comparison.ts";

interface Outcome<I> { readonly success: boolean; readonly body: I | null; readonly message?: string }

async function body<T>(pending: Promise<Outcome<unknown>>): Promise<T> {
  const result = await pending;
  if (!result.success || result.body === null) throw new Error(result.message || "This information could not be loaded. Please try again.");
  return result.body as T;
}
const opt = <T extends object>(o: T): Partial<T> =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== "")) as Partial<T>;

export const institutions = (input: InstitutionsInput = {}) => body<InsightsInstitutionList>(listInstitutions({ query: opt(input) }));
export const institution = (code: string, _languageCode?: string) => body<InsightsInstitutionDetail>(getInstitution({ params: { code } }));
export const treeOptions = (_languageCode?: string) => body<InsightsGovernanceTabs>(getGovernanceTabs({}));
export const governanceTree = (input: GovTreeInput, _languageCode?: string) => body<GovernanceTree>(getGovernanceTree({ query: opt(input) }));
export const content = (input: ContentInput) => body<InsightsContentPage>(getContent({ query: opt(input) }));
export const library = (input: ContentListInput = {}) => body<InsightsContentList>(listContent({ query: opt(input) }));
export const legalBasis = (subjectTable: string, subjectCode: string) => body<InsightsLegalBasis>(getLegalBasis({ query: { subjectTable, subjectCode } }));
export const compareOptions = (featureId: string, metric?: string) => body<InsightsCompareOptions>(getCompareOptions({ query: { featureId, ...opt({ metric }) } }));
export const compare = (a: string, b: string, metrics?: string) => body<InsightsComparison>(getComparison({ query: { a, b, ...opt({ metrics }) } }));
