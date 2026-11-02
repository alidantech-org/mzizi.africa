import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";

/** The contract shape of MethodPublic, for generated tests. */
export const methodPublicExample: ContractExample = contractExample({
  name: "MethodPublic",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "description",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
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
      spec: { kind: "enum", values: Object.values(ProvenanceMethod) },
    },
    {
      name: "model",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "tool",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "toolVersion",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
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