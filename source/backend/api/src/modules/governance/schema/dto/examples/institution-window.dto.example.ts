import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionWindow, for generated tests. */
export const institutionWindowExample: ContractExample = contractExample({
  name: "InstitutionWindow",
  fields: [
    {
      name: "codePrefix",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255, patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"] },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
    {
      name: "offset",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
  ],
  invariants: [
  ],
});