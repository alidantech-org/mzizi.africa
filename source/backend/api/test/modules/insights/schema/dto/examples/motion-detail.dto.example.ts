import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { motionDetailLegalExample } from "@test/modules/insights/schema/dto/examples/motion-detail-legal.dto.example.ts";
import { motionDetailMembersExample } from "@test/modules/insights/schema/dto/examples/motion-detail-members.dto.example.ts";
import { motionDetailMotionExample } from "@test/modules/insights/schema/dto/examples/motion-detail-motion.dto.example.ts";
import { motionDetailPartiesExample } from "@test/modules/insights/schema/dto/examples/motion-detail-parties.dto.example.ts";
import { motionDetailTallyExample } from "@test/modules/insights/schema/dto/examples/motion-detail-tally.dto.example.ts";

/** The contract shape of MotionDetail, for generated tests. */
export const motionDetailExample: ContractExample = contractExample({
  name: "MotionDetail",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "legal",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => motionDetailLegalExample },
    },
    {
      name: "members",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => motionDetailMembersExample },
    },
    {
      name: "motion",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => motionDetailMotionExample },
    },
    {
      name: "parties",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => motionDetailPartiesExample },
    },
    {
      name: "tally",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => motionDetailTallyExample },
    },
  ],
  invariants: [],
});
