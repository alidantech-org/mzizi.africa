import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CompareOptionsTop, for generated tests. */
export const compareOptionsTopExample: ContractExample = contractExample({
  name: "CompareOptionsTop",
  fields: [
    {
      name: "detail",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "featureId",
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
    {
      name: "path",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "rank",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "share",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "subjectId",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "value",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
