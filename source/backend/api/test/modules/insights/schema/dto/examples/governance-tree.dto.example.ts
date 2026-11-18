import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";

/** The contract shape of GovernanceTree, for generated tests. */
export const governanceTreeExample: ContractExample = contractExample({
  name: "GovernanceTree",
  fields: [
    {
      name: "edges",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "legend",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "nodes",
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
    {
      name: "rail",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "tab",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
