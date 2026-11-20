import { ReferenceTemplateProduct } from "#sdk/types/reference/enums/template-product.ts";

/** One thing a pattern produces, how many (one per unit of a level), how it is named and coded, and the attributes it carries. Templates generate structure only, never people. */
export interface ReferenceTemplate {
  armId?: string | null;
  classId?: string | null;
  code: string;
  codeTemplate: string;
  createdAt: string;
  deletedAt?: string | null;
  fanOutLevelId?: string | null;
  id: string;
  institutionKindId?: string | null;
  nameTemplate: string;
  parentTemplateId?: string | null;
  patternId: string;
  produces: ReferenceTemplateProduct;
  roleId?: string | null;
  seatBasisId?: string | null;
  seatCount?: number | null;
  selectionMethodId?: string | null;
  sourceCitationId?: string | null;
  termLimit?: number | null;
  termYears?: number | null;
  updatedAt: string;
  version: number;
}
