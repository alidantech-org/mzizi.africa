import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ContentPageRelatedFrontMatter, for generated tests. */
export const contentPageRelatedFrontMatterExample: ContractExample = contractExample({
  name: "ContentPageRelatedFrontMatter",
  fields: [
    {
      name: "citationId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "parent",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
