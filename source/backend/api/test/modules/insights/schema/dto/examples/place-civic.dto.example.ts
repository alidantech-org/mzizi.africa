import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";

/** The contract shape of PlaceCivic, for generated tests. */
export const placeCivicExample: ContractExample = contractExample({
  name: "PlaceCivic",
  fields: [
    {
      name: "chain",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
    {
      name: "classes",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "fund",
      optional: true,
      nullable: true,
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
      name: "infrastructure",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "leadership",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
    {
      name: "projects",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "years",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
