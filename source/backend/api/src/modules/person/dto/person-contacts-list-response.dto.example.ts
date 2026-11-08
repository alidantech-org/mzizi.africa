import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { personContactPublicExample } from "#/modules/person/dto/person-contact-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PersonContactsListResponse, for generated tests. */
export const personContactsListResponseExample: ContractExample = contractExample({
  name: "PersonContactsListResponse",
  fields: [
    {
      name: "contacts",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => personContactPublicExample },
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