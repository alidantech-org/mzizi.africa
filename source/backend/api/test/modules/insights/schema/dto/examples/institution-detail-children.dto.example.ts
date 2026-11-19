import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionDetailChildrenRelationExample } from "@test/modules/insights/schema/dto/examples/institution-detail-children-relation.dto.example.ts";

/** The contract shape of InstitutionDetailChildren, for generated tests. */
export const institutionDetailChildrenExample: ContractExample = contractExample({
  name: "InstitutionDetailChildren",
  fields: [
    {
      name: "children",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "relation",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => institutionDetailChildrenRelationExample,
      },
    },
  ],
  invariants: [],
});
