import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Coalition, for generated tests. */
export const coalitionExample: ContractExample = contractExample({
  name: "Coalition",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "dissolvedOn",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "formedOn",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
