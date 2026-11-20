import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { countryChoiceExample } from "@test/modules/explorer/schema/dto/examples/country-choice.dto.example.ts";
import { navigationItemExample } from "@test/modules/explorer/schema/dto/examples/navigation-item.dto.example.ts";

/** The contract shape of Navigation, for generated tests. */
export const navigationExample: ContractExample = contractExample({
  name: "Navigation",
  fields: [
    {
      name: "country",
      optional: false,
      nullable: false,
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
      name: "items",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => navigationItemExample },
    },
  ],
  invariants: [],
});
