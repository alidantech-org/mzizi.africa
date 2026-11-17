/** Types shared by the web components. They hold data only; the generated glue fills them from the contract. */

/** One choice of a selectable field. */
export interface FieldOption {
  readonly value: string;
  readonly label: string;
}

/** A field of a filter bar or form. A choice field gets its options from `loadOptions` (a contract option source). */
export type FieldSpec =
  | { readonly kind: "text"; readonly name: string; readonly label: string }
  | {
      readonly kind: "choice";
      readonly name: string;
      readonly label: string;
      readonly loadOptions: () => Promise<readonly FieldOption[]>;
    };

/** The values a filter bar holds: a text per field name; an empty text means "no filter". */
export type FieldValues = Readonly<Record<string, string>>;

/** One column of a data table; the cell text is read from the row by `key`. */
export interface ColumnSpec {
  readonly key: string;
  readonly label: string;
}

/** A page window: how many rows and where they start. */
export interface PageWindow {
  readonly limit: number;
  readonly offset: number;
}
