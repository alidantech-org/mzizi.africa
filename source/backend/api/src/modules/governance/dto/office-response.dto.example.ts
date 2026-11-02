import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { officePublicExample } from "#/modules/governance/dto/office-public.dto.example.ts";

/** The contract shape of OfficeResponse, for generated tests. */
export const officeResponseExample: ContractExample = contractExample({
  name: "OfficeResponse",
  fields: [
    {
      name: "office",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => officePublicExample },
    },
  ],
  invariants: [
  ],
});