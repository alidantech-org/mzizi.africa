import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { DomainRole } from "#/types/website/domain-role.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of SiteDomainListQuery, for generated tests. */
export const siteDomainListQueryExample: ContractExample = contractExample({
  name: "SiteDomainListQuery",
  fields: [
    {
      name: "hostname",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 253 },
    },
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
      name: "page",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "role",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(DomainRole) },
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