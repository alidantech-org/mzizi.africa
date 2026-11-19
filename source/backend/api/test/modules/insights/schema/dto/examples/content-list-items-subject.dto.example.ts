import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ContentListItemsSubject, for generated tests. */
export const contentListItemsSubjectExample: ContractExample = contractExample({
  name: "ContentListItemsSubject",
  fields: [
    {
      name: "code",
      optional: true,
      nullable: true,
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
