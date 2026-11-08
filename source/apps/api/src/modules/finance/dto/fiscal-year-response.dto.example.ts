import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { fiscalYearPublicExample } from "#/modules/finance/dto/fiscal-year-public.dto.example.ts";

/** The contract shape of FiscalYearResponse, for generated tests. */
export const fiscalYearResponseExample: ContractExample = contractExample({
  name: "FiscalYearResponse",
  fields: [
    {
      name: "fiscalYear",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => fiscalYearPublicExample },
    },
  ],
  invariants: [
  ],
});