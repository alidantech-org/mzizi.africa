import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { selectionProcedurePublicExample } from "#/modules/governance/dto/selection-procedure-public.dto.example.ts";

/** The contract shape of SelectionProcedureResponse, for generated tests. */
export const selectionProcedureResponseExample: ContractExample = contractExample({
  name: "SelectionProcedureResponse",
  fields: [
    {
      name: "procedure",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => selectionProcedurePublicExample },
    },
  ],
  invariants: [
  ],
});