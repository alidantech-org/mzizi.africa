import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ChildOutlineEntryOutlines, for generated tests. */
export const childOutlineEntryOutlinesExample: ContractExample = contractExample({
  name: "ChildOutlineEntryOutlines",
  fields: [
    {
      name: "band",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0, max: 3 },
    },
  ],
  invariants: [],
});
