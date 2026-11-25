import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { childOutlineEntryOutlinesExample } from "@test/modules/geography/schema/dto/examples/child-outline-entry-outlines.dto.example.ts";

/** The contract shape of ChildOutlineEntry, for generated tests. */
export const childOutlineEntryExample: ContractExample = contractExample({
  name: "ChildOutlineEntry",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: [
          "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ],
      },
    },
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "outlines",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => childOutlineEntryOutlinesExample },
    },
  ],
  invariants: [],
});
