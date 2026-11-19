import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Budget, for generated tests. */
export const budgetExample: ContractExample = contractExample({
  name: "Budget",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "entity",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "fiscalFrom",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "fiscalTo",
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
      name: "latestReleasedOn",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "revisions",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0, max: 100000000 },
    },
  ],
  invariants: [],
});
