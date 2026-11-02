import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { expenditurePublicExample } from "#/modules/finance/dto/expenditure-public.dto.example.ts";

/** The contract shape of ExpenditureResponse, for generated tests. */
export const expenditureResponseExample: ContractExample = contractExample({
  name: "ExpenditureResponse",
  fields: [
    {
      name: "expenditure",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => expenditurePublicExample },
    },
  ],
  invariants: [
  ],
});