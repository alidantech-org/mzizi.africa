import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { CheckKind } from "#/types/website/check-kind.enum.ts";
import { CheckOutcome } from "#/types/website/check-outcome.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of SiteCheckListQuery, for generated tests. */
export const siteCheckListQueryExample: ContractExample = contractExample({
  name: "SiteCheckListQuery",
  fields: [
    {
      name: "includeHistory",
      optional: true,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "kind",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(CheckKind) },
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
      name: "outcome",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(CheckOutcome) },
    },
    {
      name: "page",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "siteId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
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