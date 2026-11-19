import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CompareOptionsHierarchyUnit, for generated tests. */
export const compareOptionsHierarchyUnitExample: ContractExample = contractExample({
  name: "CompareOptionsHierarchyUnit",
  fields: [
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "kindCode",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "kindLabel",
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
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
