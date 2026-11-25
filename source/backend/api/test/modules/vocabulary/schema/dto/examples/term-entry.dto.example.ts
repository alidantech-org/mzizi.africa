import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { TermStatus } from "#/modules/vocabulary/schema/enum/term-status.enum.ts";
import { termEntryLabelsExample } from "@test/modules/vocabulary/schema/dto/examples/term-entry-labels.dto.example.ts";

/** The contract shape of TermEntry, for generated tests. */
export const termEntryExample: ContractExample = contractExample({
  name: "TermEntry",
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
      name: "colorToken",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "iconCode",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "labels",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => termEntryLabelsExample },
    },
    {
      name: "lower",
      optional: false,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "parentId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "position",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(TermStatus) },
    },
    {
      name: "termId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "upper",
      optional: false,
      nullable: true,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
