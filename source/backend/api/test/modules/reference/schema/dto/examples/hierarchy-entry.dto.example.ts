import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { hierarchyEntryLevelsExample } from "@test/modules/reference/schema/dto/examples/hierarchy-entry-levels.dto.example.ts";
import { hierarchyEntryNamesExample } from "@test/modules/reference/schema/dto/examples/hierarchy-entry-names.dto.example.ts";

/** The contract shape of HierarchyEntry, for generated tests. */
export const hierarchyEntryExample: ContractExample = contractExample({
  name: "HierarchyEntry",
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
      name: "fromYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "hierarchyId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isRouting",
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
      name: "levels",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => hierarchyEntryLevelsExample },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => hierarchyEntryNamesExample },
    },
    {
      name: "toYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
  ],
  invariants: [],
});
