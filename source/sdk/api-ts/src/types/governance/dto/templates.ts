import { GovernanceTemplateProduct } from "#sdk/types/governance/enums/template-product.ts";

/** One thing a pattern produces, how many, how it is named and coded. Templates generate structure only, never people. */
export interface GovernanceTemplates {
  armTerm?: string | null;
  basisTerm?: string | null;
  classTerm?: string | null;
  code: string;
  codeTemplate: string;
  createdAt: string;
  deletedAt?: string | null;
  fanOutLevelId?: string | null;
  id: string;
  kindTerm?: string | null;
  methodTerm?: string | null;
  nameTemplate: string;
  parentTemplateId?: string | null;
  patternId: string;
  produces: GovernanceTemplateProduct;
  roleTerm?: string | null;
  seatCount?: number | null;
  termLimit?: number | null;
  termYears?: number | null;
  updatedAt: string;
  version: number;
}
