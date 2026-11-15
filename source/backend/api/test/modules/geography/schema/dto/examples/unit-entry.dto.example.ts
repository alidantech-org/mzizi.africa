import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { unitEntryNamesExample } from "@test/modules/geography/schema/dto/examples/unit-entry-names.dto.example.ts";

/** The contract shape of UnitEntry, for generated tests. */
export const unitEntryExample: ContractExample = contractExample({
  name: "UnitEntry",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"],
      },
    },
    {
      name: "countryId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => unitEntryNamesExample },
    },
    {
      name: "validFrom",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validUntil",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
  ],
  invariants: [],
});
