import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { motionDetailMotionContributionsExample } from "@test/modules/insights/schema/dto/examples/motion-detail-motion-contributions.dto.example.ts";

/** The contract shape of MotionDetailMotion, for generated tests. */
export const motionDetailMotionExample: ContractExample = contractExample({
  name: "MotionDetailMotion",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "contributions",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => motionDetailMotionContributionsExample,
      },
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
      name: "movedBy",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "outcome",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "sitting",
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
  ],
  invariants: [],
});
