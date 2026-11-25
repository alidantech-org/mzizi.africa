import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { evidenceEntryExample } from "@test/modules/source/schema/dto/examples/evidence-entry.dto.example.ts";

/** The contract shape of EvidenceCollection, for generated tests. */
export const evidenceCollectionExample: ContractExample = contractExample({
  name: "EvidenceCollection",
  fields: [
    {
      name: "evidence",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => evidenceEntryExample },
    },
  ],
  invariants: [],
});
