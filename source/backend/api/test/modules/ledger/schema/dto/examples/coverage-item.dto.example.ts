import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CoverageItem, for generated tests. */
export const coverageItemExample: ContractExample = contractExample({
  name: "CoverageItem",
  fields: [
    {
      name: "checkedOn",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "expectedAt",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "level",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "note",
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
    {
      name: "subject",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
