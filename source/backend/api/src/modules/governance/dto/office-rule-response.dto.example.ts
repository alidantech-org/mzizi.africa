import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { officeRulePublicExample } from "#/modules/governance/dto/office-rule-public.dto.example.ts";

/** The contract shape of OfficeRuleResponse, for generated tests. */
export const officeRuleResponseExample: ContractExample = contractExample({
  name: "OfficeRuleResponse",
  fields: [
    {
      name: "rule",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => officeRulePublicExample },
    },
  ],
  invariants: [
  ],
});