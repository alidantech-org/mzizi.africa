import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LeaderProfileActivitySpeeches, for generated tests. */
export const leaderProfileActivitySpeechesExample: ContractExample = contractExample({
  name: "LeaderProfileActivitySpeeches",
  fields: [
    {
      name: "heldOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "motion",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "motionCode",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "summary",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "wordCount",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
