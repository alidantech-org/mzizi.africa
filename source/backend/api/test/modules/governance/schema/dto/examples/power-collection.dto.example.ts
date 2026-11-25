import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { powerEntryExample } from "@test/modules/governance/schema/dto/examples/power-entry.dto.example.ts";

/** The contract shape of PowerCollection, for generated tests. */
export const powerCollectionExample: ContractExample = contractExample({
  name: "PowerCollection",
  fields: [
    {
      name: "powers",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => powerEntryExample },
    },
  ],
  invariants: [],
});
