import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { flagColorExample } from "@test/modules/explorer/schema/dto/examples/flag-color.dto.example.ts";

/** The contract shape of CountryChoice, for generated tests. */
export const countryChoiceExample: ContractExample = contractExample({
  name: "CountryChoice",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
    {
      name: "flagColors",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => flagColorExample },
    },
    {
      name: "flagUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "rootFeatureId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "served",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
  ],
  invariants: [],
});
