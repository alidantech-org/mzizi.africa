import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { contextCountryExample } from "@test/modules/experience/schema/dto/examples/context-country.dto.example.ts";
import { contextLevelExample } from "@test/modules/experience/schema/dto/examples/context-level.dto.example.ts";
import { countryChoiceExample } from "@test/modules/experience/schema/dto/examples/country-choice.dto.example.ts";
import { placeRefExample } from "@test/modules/experience/schema/dto/examples/place-ref.dto.example.ts";

/** The contract shape of Context, for generated tests. */
export const contextExample: ContractExample = contractExample({
  name: "Context",
  fields: [
    {
      name: "chain",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeRefExample },
    },
    {
      name: "countries",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => countryChoiceExample },
    },
    {
      name: "country",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => contextCountryExample },
    },
    {
      name: "countrySource",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "languageCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "levels",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => contextLevelExample },
    },
    {
      name: "place",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => placeRefExample },
    },
    {
      name: "rest",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
  ],
  invariants: [],
});
