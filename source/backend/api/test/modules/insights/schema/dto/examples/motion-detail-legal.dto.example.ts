import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { motionDetailLegalFiscalYearExample } from "@test/modules/insights/schema/dto/examples/motion-detail-legal-fiscal-year.dto.example.ts";
import { motionDetailLegalProvisionExample } from "@test/modules/insights/schema/dto/examples/motion-detail-legal-provision.dto.example.ts";

/** The contract shape of MotionDetailLegal, for generated tests. */
export const motionDetailLegalExample: ContractExample = contractExample({
  name: "MotionDetailLegal",
  fields: [
    {
      name: "fiscalYear",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => motionDetailLegalFiscalYearExample,
      },
    },
    {
      name: "provision",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => motionDetailLegalProvisionExample,
      },
    },
  ],
  invariants: [],
});
