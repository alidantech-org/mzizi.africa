import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { electionListElectionsExample } from "@test/modules/insights/schema/dto/examples/election-list-elections.dto.example.ts";

/** The contract shape of ElectionList, for generated tests. */
export const electionListExample: ContractExample = contractExample({
  name: "ElectionList",
  fields: [
    {
      name: "elections",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => electionListElectionsExample },
    },
  ],
  invariants: [],
});
