import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Fund, for generated tests. */
export const fundExample: ContractExample = contractExample({
  name: "Fund",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "featureId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "flows",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0, max: 100000000 },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "manager",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "path",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "place",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "source",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
