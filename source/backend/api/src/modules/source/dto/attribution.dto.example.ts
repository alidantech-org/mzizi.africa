import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { AttributionRelation } from "#/types/source/attribution-relation.enum.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";
import { documentExample } from "#/modules/source/dto/document.dto.example.ts";

/** The contract shape of Attribution, for generated tests. */
export const attributionExample: ContractExample = contractExample({
  name: "Attribution",
  fields: [
    {
      name: "attributedBy",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "captureId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "confidence",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0, max: 1 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "documentId",
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
      name: "locator",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "methodId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "relation",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AttributionRelation) },
    },
    {
      name: "targetField",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "targetId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "targetKind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 100 },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [
  ],
});