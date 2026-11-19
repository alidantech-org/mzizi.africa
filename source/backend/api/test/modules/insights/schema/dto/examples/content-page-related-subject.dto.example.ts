import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ContentPageRelatedSubject, for generated tests. */
export const contentPageRelatedSubjectExample: ContractExample = contractExample({
  name: "ContentPageRelatedSubject",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "table",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
