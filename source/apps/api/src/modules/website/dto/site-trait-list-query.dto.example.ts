import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { RelationOwnerKind } from "#/types/website/relation-owner-kind.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of SiteTraitListQuery, for generated tests. */
export const siteTraitListQueryExample: ContractExample = contractExample({
  name: "SiteTraitListQuery",
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
      spec: { kind: "enum", values: Object.values(RelationOwnerKind) },
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
    {
      name: "tag",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 3, maxLength: 200 },
    },
  ],
  invariants: [
  ],
});