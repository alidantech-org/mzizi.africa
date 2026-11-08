import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { SiteKind } from "#/types/website/site-kind.enum.ts";
import { SiteStatus } from "#/types/website/site-status.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of SiteListQuery, for generated tests. */
export const siteListQueryExample: ContractExample = contractExample({
  name: "SiteListQuery",
  fields: [
    {
      name: "includeHistory",
      optional: true,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "jurisdictionId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kind",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SiteKind) },
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
      name: "page",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "q",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "sort",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SortDirection) },
    },
    {
      name: "status",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SiteStatus) },
    },
  ],
  invariants: [
  ],
});