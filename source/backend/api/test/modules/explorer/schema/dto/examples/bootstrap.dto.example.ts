import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { countryChoiceExample } from "@test/modules/explorer/schema/dto/examples/country-choice.dto.example.ts";
import { languageChoiceExample } from "@test/modules/explorer/schema/dto/examples/language-choice.dto.example.ts";

/** The contract shape of Bootstrap, for generated tests. */
export const bootstrapExample: ContractExample = contractExample({
  name: "Bootstrap",
  fields: [
    {
      name: "countries",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => countryChoiceExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "language",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "languages",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => languageChoiceExample },
    },
  ],
  invariants: [],
});
