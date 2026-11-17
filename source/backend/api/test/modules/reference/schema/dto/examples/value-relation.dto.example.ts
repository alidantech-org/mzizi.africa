import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { ValueRelationKind } from "#/modules/reference/schema/enum/value-relation-kind.enum.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";
import { associationExample } from "@test/modules/shared/schema/dto/examples/association.dto.example.ts";

/** The contract shape of ValueRelation, for generated tests. */
export const valueRelationExample: ContractExample = contractExample({
  name: "ValueRelation",
  fields: [
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
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "relationKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ValueRelationKind) },
    },
    {
      name: "sourceValueId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "targetValueId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
    {
      any: false,
      comparisons: [
        {
          left: { field: "sourceValueId" },
          operator: "not-equal",
          right: { field: "targetValueId" },
        },
      ],
    },
  ],
});
