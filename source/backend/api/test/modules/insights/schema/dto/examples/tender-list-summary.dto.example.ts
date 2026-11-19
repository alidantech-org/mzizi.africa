import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { tenderListSummaryByStatusExample } from "@test/modules/insights/schema/dto/examples/tender-list-summary-by-status.dto.example.ts";
import { tenderListSummaryTransparencyExample } from "@test/modules/insights/schema/dto/examples/tender-list-summary-transparency.dto.example.ts";

/** The contract shape of TenderListSummary, for generated tests. */
export const tenderListSummaryExample: ContractExample = contractExample({
  name: "TenderListSummary",
  fields: [
    {
      name: "byStatus",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => tenderListSummaryByStatusExample },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "transparency",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => tenderListSummaryTransparencyExample,
      },
    },
  ],
  invariants: [],
});
