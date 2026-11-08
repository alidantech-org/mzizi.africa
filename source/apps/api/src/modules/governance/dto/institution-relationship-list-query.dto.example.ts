import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { RelationshipKind } from "#/types/governance/relationship-kind.enum.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of InstitutionRelationshipListQuery, for generated tests. */
export const institutionRelationshipListQueryExample: ContractExample = contractExample({
  name: "InstitutionRelationshipListQuery",
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
      spec: { kind: "enum", values: Object.values(RelationshipKind) },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "objectId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "objectKind",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 100 },
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
      name: "sort",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SortDirection) },
    },
    {
      name: "subjectId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "subjectKind",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 100 },
    },
  ],
  invariants: [
  ],
});