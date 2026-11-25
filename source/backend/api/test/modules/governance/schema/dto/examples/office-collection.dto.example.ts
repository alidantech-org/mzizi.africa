import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { officeEntryExample } from "@test/modules/governance/schema/dto/examples/office-entry.dto.example.ts";

/** The contract shape of OfficeCollection, for generated tests. */
export const officeCollectionExample: ContractExample = contractExample({
  name: "OfficeCollection",
  fields: [
    {
      name: "offices",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => officeEntryExample },
    },
  ],
  invariants: [],
});
