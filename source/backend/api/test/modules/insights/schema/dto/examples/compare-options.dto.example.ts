import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { compareOptionsHierarchyExample } from "@test/modules/insights/schema/dto/examples/compare-options-hierarchy.dto.example.ts";
import { compareOptionsMetricsExample } from "@test/modules/insights/schema/dto/examples/compare-options-metrics.dto.example.ts";
import { compareOptionsNearbyExample } from "@test/modules/insights/schema/dto/examples/compare-options-nearby.dto.example.ts";
import { compareOptionsPlaceExample } from "@test/modules/insights/schema/dto/examples/compare-options-place.dto.example.ts";
import { compareOptionsTopExample } from "@test/modules/insights/schema/dto/examples/compare-options-top.dto.example.ts";

/** The contract shape of CompareOptions, for generated tests. */
export const compareOptionsExample: ContractExample = contractExample({
  name: "CompareOptions",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "hierarchy",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => compareOptionsHierarchyExample },
    },
    {
      name: "metrics",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => compareOptionsMetricsExample },
    },
    {
      name: "nearby",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => compareOptionsNearbyExample },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => compareOptionsPlaceExample },
    },
    {
      name: "top",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => compareOptionsTopExample },
    },
  ],
  invariants: [],
});
