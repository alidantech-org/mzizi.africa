import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { officeHolderSearchItemExample } from "#/modules/governance/dto/office-holder-search-item.dto.example.ts";

/** The contract shape of OfficeHolderSearchResponse, for generated tests. */
export const officeHolderSearchResponseExample: ContractExample = contractExample({
  name: "OfficeHolderSearchResponse",
  fields: [
    {
      name: "limit",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "page",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "results",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => officeHolderSearchItemExample },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
  ],
  invariants: [
  ],
});