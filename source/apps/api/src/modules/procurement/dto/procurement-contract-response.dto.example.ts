import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { procurementContractPublicExample } from "#/modules/procurement/dto/procurement-contract-public.dto.example.ts";

/** The contract shape of ProcurementContractResponse, for generated tests. */
export const procurementContractResponseExample: ContractExample = contractExample({
  name: "ProcurementContractResponse",
  fields: [
    {
      name: "contract",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => procurementContractPublicExample },
    },
  ],
  invariants: [
  ],
});