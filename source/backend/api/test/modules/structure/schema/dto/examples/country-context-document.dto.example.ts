import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { countryContextDocumentLevelsExample } from "@test/modules/structure/schema/dto/examples/country-context-document-levels.dto.example.ts";

/** The contract shape of CountryContextDocument, for generated tests. */
export const countryContextDocumentExample: ContractExample = contractExample({
  name: "CountryContextDocument",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: true,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
    {
      name: "countryId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "levels",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => countryContextDocumentLevelsExample,
      },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [],
});
