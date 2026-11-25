import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { relationshipEntryExample } from "@test/modules/governance/schema/dto/examples/relationship-entry.dto.example.ts";

/** The contract shape of RelationshipCollection, for generated tests. */
export const relationshipCollectionExample: ContractExample = contractExample({
  name: "RelationshipCollection",
  fields: [
    {
      name: "relationships",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => relationshipEntryExample },
    },
  ],
  invariants: [],
});
