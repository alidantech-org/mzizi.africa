import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { legalProvisionPublicExample } from "#/modules/legal/dto/legal-provision-public.dto.example.ts";

/** The contract shape of LegalProvisionResponse, for generated tests. */
export const legalProvisionResponseExample: ContractExample = contractExample({
  name: "LegalProvisionResponse",
  fields: [
    {
      name: "provision",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => legalProvisionPublicExample },
    },
  ],
  invariants: [
  ],
});