import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { eventLinkPublicExample } from "#/modules/events/dto/event-link-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of EventLinksListResponse, for generated tests. */
export const eventLinksListResponseExample: ContractExample = contractExample({
  name: "EventLinksListResponse",
  fields: [
    {
      name: "links",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => eventLinkPublicExample },
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