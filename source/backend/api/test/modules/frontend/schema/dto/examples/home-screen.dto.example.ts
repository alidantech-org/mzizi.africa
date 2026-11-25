import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { countryLinkExample } from "@test/modules/frontend/schema/dto/examples/country-link.dto.example.ts";
import { languageOptionExample } from "@test/modules/frontend/schema/dto/examples/language-option.dto.example.ts";

/** The contract shape of HomeScreen, for generated tests. */
export const homeScreenExample: ContractExample = contractExample({
  name: "HomeScreen",
  fields: [
    {
      name: "countries",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => countryLinkExample },
    },
    {
      name: "language",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "languages",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => languageOptionExample },
    },
  ],
  invariants: [],
});
