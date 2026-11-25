import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of IdentityDetailIdentifiers, for generated tests. */
export const identityDetailIdentifiersExample: ContractExample = contractExample({
  name: "IdentityDetailIdentifiers",
  fields: [
    {
      name: "namespace",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "schemeTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "value",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
  ],
  invariants: [],
});
