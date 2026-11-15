import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionDetailMandates, for generated tests. */
export const institutionDetailMandatesExample: ContractExample = contractExample({
  name: "InstitutionDetailMandates",
  fields: [
    {
      name: "description",
      optional: false,
      nullable: false,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255, patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"] },
    },
    {
      name: "validFrom",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validUntil",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
  ],
  invariants: [
  ],
});