import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of Scopes, for generated tests. */
export const scopesExample: ContractExample = contractExample({
  name: "Scopes",
  fields: [
    {
      name: "countryRefId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "datasetRefId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fieldGroup",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "geographicUnitRefId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "includeDescendants",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "institutionRefId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isGlobal",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "scopeHash",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 64, patterns: ["^[a-f0-9]{64}$"] },
    },
  ],
  invariants: [
  ],
});