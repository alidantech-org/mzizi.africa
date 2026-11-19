import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionDetailParentsRelationExample } from "@test/modules/insights/schema/dto/examples/institution-detail-parents-relation.dto.example.ts";

/** The contract shape of InstitutionDetailParents, for generated tests. */
export const institutionDetailParentsExample: ContractExample = contractExample({
  name: "InstitutionDetailParents",
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
        example: () => institutionDetailParentsRelationExample,
      },
    },
  ],
  invariants: [],
});
