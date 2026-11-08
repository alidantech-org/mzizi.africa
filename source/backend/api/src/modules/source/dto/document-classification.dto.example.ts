import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ClassifierMethod } from "#/types/source/classifier-method.enum.ts";
import { RouteStatus } from "#/types/source/route-status.enum.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** The contract shape of DocumentClassification, for generated tests. */
export const documentClassificationExample: ContractExample = contractExample({
  name: "DocumentClassification",
  fields: [
    {
      name: "classifiedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "classifierVersion",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
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
      name: "evidence",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "facts",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 60 },
    },
    {
      name: "method",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ClassifierMethod) },
    },
    {
      name: "routeParser",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "routeStatus",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(RouteStatus) },
    },
    {
      name: "score",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1 },
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