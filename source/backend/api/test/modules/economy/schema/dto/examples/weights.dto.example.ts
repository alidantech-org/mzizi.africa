import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { basketsExample } from "@test/modules/economy/schema/dto/examples/baskets.dto.example.ts";
import { goodsExample } from "@test/modules/economy/schema/dto/examples/goods.dto.example.ts";
import { associationExample } from "@test/modules/shared/schema/dto/examples/association.dto.example.ts";

/** The contract shape of Weights, for generated tests. */
export const weightsExample: ContractExample = contractExample({
  name: "Weights",
  fields: [
    {
      name: "basketId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "goodId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "weight",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0 },
    },
  ],
  invariants: [],
});
