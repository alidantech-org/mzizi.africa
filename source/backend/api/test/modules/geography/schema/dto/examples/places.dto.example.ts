import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { featuresExample } from "@test/modules/geography/schema/dto/examples/features.dto.example.ts";

/** The contract shape of Places, for generated tests. */
export const placesExample: ContractExample = contractExample({
  name: "Places",
  fields: [
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isInhabited",
      optional: true,
      nullable: true,
      spec: { kind: "boolean" },
    },
  ],
  invariants: [],
});
