import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { createdExample } from "@test/modules/shared/schema/dto/examples/created.dto.example.ts";

/** The contract shape of Timestamped, for generated tests. */
export const timestampedExample: ContractExample = contractExample({
  name: "Timestamped",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
  ],
  invariants: [],
});
