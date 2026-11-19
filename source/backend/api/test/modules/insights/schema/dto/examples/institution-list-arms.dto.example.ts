import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionListArmsGroupsExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups.dto.example.ts";

/** The contract shape of InstitutionListArms, for generated tests. */
export const institutionListArmsExample: ContractExample = contractExample({
  name: "InstitutionListArms",
  fields: [
    {
      name: "about",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "count",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "groups",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => institutionListArmsGroupsExample },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
