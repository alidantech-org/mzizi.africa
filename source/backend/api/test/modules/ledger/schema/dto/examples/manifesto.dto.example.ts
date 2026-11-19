import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Manifesto, for generated tests. */
export const manifestoExample: ContractExample = contractExample({
  name: "Manifesto",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "election",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "party",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "publishedOn",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
