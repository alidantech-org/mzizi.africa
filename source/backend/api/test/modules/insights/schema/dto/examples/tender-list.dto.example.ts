import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { tenderListSummaryExample } from "@test/modules/insights/schema/dto/examples/tender-list-summary.dto.example.ts";
import { tenderListTendersExample } from "@test/modules/insights/schema/dto/examples/tender-list-tenders.dto.example.ts";

/** The contract shape of TenderList, for generated tests. */
export const tenderListExample: ContractExample = contractExample({
  name: "TenderList",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "summary",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => tenderListSummaryExample },
    },
    {
      name: "tenders",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => tenderListTendersExample },
    },
  ],
  invariants: [],
});
