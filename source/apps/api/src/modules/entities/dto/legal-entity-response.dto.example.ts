import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { legalEntityPublicExample } from "#/modules/entities/dto/legal-entity-public.dto.example.ts";

/** The contract shape of LegalEntityResponse, for generated tests. */
export const legalEntityResponseExample: ContractExample = contractExample({
  name: "LegalEntityResponse",
  fields: [
    {
      name: "entity",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => legalEntityPublicExample },
    },
  ],
  invariants: [
  ],
});