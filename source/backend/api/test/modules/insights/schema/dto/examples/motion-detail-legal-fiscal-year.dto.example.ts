import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of MotionDetailLegalFiscalYear, for generated tests. */
export const motionDetailLegalFiscalYearExample: ContractExample = contractExample({
  name: "MotionDetailLegalFiscalYear",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "endsOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "startsOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
