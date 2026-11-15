import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CodedIdentified, for generated tests. */
export const codedIdentifiedExample: ContractExample = contractExample({
  name: "CodedIdentified",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255, patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"] },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});