import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { bidsExample } from "@test/modules/civic/schema/dto/examples/bids.dto.example.ts";
import { contractsExample } from "@test/modules/civic/schema/dto/examples/contracts.dto.example.ts";
import { goodsExample } from "@test/modules/economy/schema/dto/examples/goods.dto.example.ts";
import { currenciesExample } from "@test/modules/reference/schema/dto/examples/currencies.dto.example.ts";
import { unitsExample } from "@test/modules/reference/schema/dto/examples/units.dto.example.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";

/** The contract shape of Items, for generated tests. */
export const itemsExample: ContractExample = contractExample({
  name: "Items",
  fields: [
    {
      name: "bidId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "contractId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "currencyId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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
      name: "quantity",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "unitId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "unitPrice",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [
    {
      any: true,
      comparisons: [
        {
          left: { field: "unitPrice" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "currencyId" },
          operator: "not-equal",
          right: { literal: null },
        },
      ],
    },
  ],
});
