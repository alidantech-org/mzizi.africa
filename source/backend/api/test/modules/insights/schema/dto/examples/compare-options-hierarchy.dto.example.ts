import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { compareOptionsHierarchyUnitExample } from "@test/modules/insights/schema/dto/examples/compare-options-hierarchy-unit.dto.example.ts";

/** The contract shape of CompareOptionsHierarchy, for generated tests. */
export const compareOptionsHierarchyExample: ContractExample = contractExample({
  name: "CompareOptionsHierarchy",
  fields: [
    {
      name: "available",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "message",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "rung",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unit",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => compareOptionsHierarchyUnitExample,
      },
    },
  ],
  invariants: [],
});
