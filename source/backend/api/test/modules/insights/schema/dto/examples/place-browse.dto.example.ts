import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeChildExample } from "@test/modules/insights/schema/dto/examples/place-child.dto.example.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";

/** The contract shape of PlaceBrowse, for generated tests. */
export const placeBrowseExample: ContractExample = contractExample({
  name: "PlaceBrowse",
  fields: [
    {
      name: "chain",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
    {
      name: "children",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeChildExample },
    },
    {
      name: "media",
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
