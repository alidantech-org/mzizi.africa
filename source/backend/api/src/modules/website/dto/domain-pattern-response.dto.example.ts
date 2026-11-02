import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { domainPatternPublicExample } from "#/modules/website/dto/domain-pattern-public.dto.example.ts";

/** The contract shape of DomainPatternResponse, for generated tests. */
export const domainPatternResponseExample: ContractExample = contractExample({
  name: "DomainPatternResponse",
  fields: [
    {
      name: "domainPattern",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => domainPatternPublicExample },
    },
  ],
  invariants: [
  ],
});