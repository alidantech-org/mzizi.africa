import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { RelationshipKind } from "#/types/governance/relationship-kind.enum.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of InstitutionRelationshipListQuery, for generated tests. */
export const institutionRelationshipListQueryExample: ContractExample = contractExample({
  name: "InstitutionRelationshipListQuery",
  fields: [
    {
      name: "childInstitutionId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
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
      spec: { kind: "enum", values: Object.values(RelationshipKind) },
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
      name: "parentInstitutionId",
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