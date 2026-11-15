import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { identifiedExample } from "@test/modules/shared/schema/dto/examples/identified.dto.example.ts";

/** The contract shape of Created, for generated tests. */
export const createdExample: ContractExample = contractExample({
  name: "Created",
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
  ],
  invariants: [],
});
