import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { languageEntryNamesExample } from "@test/modules/reference/schema/dto/examples/language-entry-names.dto.example.ts";

/** The contract shape of LanguageEntry, for generated tests. */
export const languageEntryExample: ContractExample = contractExample({
  name: "LanguageEntry",
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
      name: "directionTerm",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "iso6391",
      optional: false,
      nullable: true,
      spec: { kind: "string", exactLength: 2, patterns: ["^[a-z]{2}$"] },
    },
    {
      name: "iso6393",
      optional: false,
      nullable: true,
      spec: { kind: "string", exactLength: 3, patterns: ["^[a-z]{3}$"] },
    },
    {
      name: "languageId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => languageEntryNamesExample },
    },
  ],
  invariants: [],
});
