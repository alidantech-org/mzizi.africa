import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionListArmsExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms.dto.example.ts";

/** The contract shape of InstitutionList, for generated tests. */
export const institutionListExample: ContractExample = contractExample({
  name: "InstitutionList",
  fields: [
    {
      name: "arms",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => institutionListArmsExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [],
});
