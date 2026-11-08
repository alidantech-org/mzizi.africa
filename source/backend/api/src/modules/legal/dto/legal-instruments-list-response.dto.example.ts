import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { legalInstrumentPublicExample } from "#/modules/legal/dto/legal-instrument-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of LegalInstrumentsListResponse, for generated tests. */
export const legalInstrumentsListResponseExample: ContractExample = contractExample({
  name: "LegalInstrumentsListResponse",
  fields: [
    {
      name: "instruments",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => legalInstrumentPublicExample },
    },
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
  ],
  invariants: [
  ],
});