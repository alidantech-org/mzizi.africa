import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ContentPageContentFrontMatter, for generated tests. */
export const contentPageContentFrontMatterExample: ContractExample = contractExample({
  name: "ContentPageContentFrontMatter",
  fields: [
    {
      name: "citationId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
