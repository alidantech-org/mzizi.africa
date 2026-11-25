import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { powerEntryToNamesExample } from "@test/modules/governance/schema/dto/examples/power-entry-to-names.dto.example.ts";

/** The contract shape of PowerEntry, for generated tests. */
export const powerEntryExample: ContractExample = contractExample({
  name: "PowerEntry",
  fields: [
    {
      name: "isBinding",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "powerId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "provisionId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "thresholdTerm",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "toCode",
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
      name: "toId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "toNames",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => powerEntryToNamesExample },
    },
  ],
  invariants: [],
});
