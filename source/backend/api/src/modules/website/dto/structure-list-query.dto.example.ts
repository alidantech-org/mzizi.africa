import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { StructureOwnerKind } from "#/types/website/structure-owner-kind.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of StructureListQuery, for generated tests. */
export const structureListQueryExample: ContractExample = contractExample({
  name: "StructureListQuery",
  fields: [
    {
      name: "includeHistory",
      optional: true,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "order",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SortDirection) },
    },
    {
      name: "ownerId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "ownerKind",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(StructureOwnerKind) },
    },
    {
      name: "page",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "sort",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SortDirection) },
    },
  ],
  invariants: [
  ],
});