import { ReferenceValueLabelKind } from "#sdk/types/reference/enums/value-label-kind.ts";

/** A label of a value in one language and of one kind, so a value can be shown in English, Swahili and other languages, with alternative names, abbreviations and definitions. The value's own label is the default display text. */
export interface ReferenceValueLabel {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  label: string;
  labelKind: ReferenceValueLabelKind;
  languageId: string;
  updatedAt: string;
  valueId: string;
  version: number;
}
