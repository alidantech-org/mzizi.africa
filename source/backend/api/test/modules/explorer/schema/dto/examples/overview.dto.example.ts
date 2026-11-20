import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { contextExample } from "@test/modules/explorer/schema/dto/examples/context.dto.example.ts";
import { countExample } from "@test/modules/explorer/schema/dto/examples/count.dto.example.ts";
import { placesExample } from "@test/modules/explorer/schema/dto/examples/places.dto.example.ts";

/** The contract shape of Overview, for generated tests. */
export const overviewExample: ContractExample = contractExample({
  name: "Overview",
  fields: [
    {
      name: "children",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placesExample },
    },
    {
      name: "context",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => contextExample },
    },
    {
      name: "counts",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => countExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
  ],
  invariants: [],
});
