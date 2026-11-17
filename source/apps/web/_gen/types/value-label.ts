
import { ValueLabelKind } from './enums/value-label-kind';
import type { ValidityEntity } from './validity-entity';
import type { Value } from './value';

/** A label of a value in one language and of one kind, so a value can be shown in English, Swahili and other languages, with alternative names, abbreviations and definitions. The value's own label is the default display text. */
export interface ValueLabel {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  label: string;
  labelKind: ValueLabelKind;
  languageTag: string;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  valueId: string;
  version: number;
}