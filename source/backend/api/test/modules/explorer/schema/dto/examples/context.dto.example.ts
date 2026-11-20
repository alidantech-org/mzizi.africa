import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { countryChoiceExample } from "@test/modules/explorer/schema/dto/examples/country-choice.dto.example.ts";
import { levelExample } from "@test/modules/explorer/schema/dto/examples/level.dto.example.ts";
import { placeExample } from "@test/modules/explorer/schema/dto/examples/place.dto.example.ts";

/** The contract shape of Context, for generated tests. */
export const contextExample: ContractExample = contractExample({
  name: "Context",
  fields: [
    {
      name: "chain",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeExample },
    },
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
      name: "language",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "levels",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => levelExample },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeExample },
    },
  ],
  invariants: [],
});
