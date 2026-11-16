import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { featureEntryNamesExample } from "@test/modules/geography/schema/dto/examples/feature-entry-names.dto.example.ts";

/** The contract shape of FeatureEntry, for generated tests. */
export const featureEntryExample: ContractExample = contractExample({
  name: "FeatureEntry",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: ["^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$"],
      },
    },
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "featureTypeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => featureEntryNamesExample },
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
