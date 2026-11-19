import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of MotionListMotions, for generated tests. */
export const motionListMotionsExample: ContractExample = contractExample({
  name: "MotionListMotions",
  fields: [
    {
      name: "absent",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "abstain",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "heldOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "institution",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "institutionId",
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
      name: "no",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "outcome",
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
      name: "title",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "yes",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
