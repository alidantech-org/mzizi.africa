import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";

/** The contract shape of LeaderTree, for generated tests. */
export const leaderTreeExample: ContractExample = contractExample({
  name: "LeaderTree",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "levels",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "place",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
  ],
  invariants: [],
});
