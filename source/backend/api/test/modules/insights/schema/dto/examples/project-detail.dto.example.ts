import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ProjectDetail, for generated tests. */
export const projectDetailExample: ContractExample = contractExample({
  name: "ProjectDetail",
  fields: [
    {
      name: "evidence",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "media",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "money",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "procurement",
      optional: true,
      nullable: true,
      spec: { kind: "unknown" },
    },
    {
      name: "project",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
