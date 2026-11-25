import type { SchemeAnswers } from "#/modules/vocabulary/schema/enum/scheme-answers.enum.ts";
import type { SchemeShape } from "#/modules/vocabulary/schema/enum/scheme-shape.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { SchemeDetailLabels } from "#/modules/vocabulary/schema/interface/scheme-detail-labels.interface.ts";

/** Scheme Detail */
export interface SchemeDetail {
  answers: SchemeAnswers;
  code: IdentityCode;
  isOpen: Flag;
  labels: SchemeDetailLabels[];
  schemeId: Id;
  shape: SchemeShape;
}
