import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionDetailContentFrontMatter, for generated tests. */
export const institutionDetailContentFrontMatterExample: ContractExample = contractExample({
  name: "InstitutionDetailContentFrontMatter",
  fields: [
    {
      name: "image",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
